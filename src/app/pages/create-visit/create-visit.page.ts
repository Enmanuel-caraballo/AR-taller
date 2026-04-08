import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PDFDocument } from 'pdf-lib';
import { FORMATOS_VISITA } from 'src/app/core/models/formatos.data';
import { supabase } from 'src/app/database/supabase';
import { IVisit } from 'src/app/interfaces/visit.interface';
import { Visit } from 'src/app/shared/services/visit/visit';

@Component({
  selector: 'app-create-visit',
  templateUrl: './create-visit.page.html',
  styleUrls: ['./create-visit.page.scss'],
  standalone: false
})
export class CreateVisitPage implements OnInit {

  responsible!: FormControl;
  pdv!: FormControl;
  usedPdf!: FormControl;
  madeAt!: FormControl;
  doc!: FormControl;
  month!: FormControl;
  formVisit!: FormGroup;


  monthToSave!: string;
  pdfName: string = '';
  title: string = '';

  data!: { madeTime: string, pdfName: string, responsible:string, title: string, doc: string}


  dinamicForm!: FormGroup;
  itemsEvaluacion: any[] = [];
  pdfBytesOriginal!: ArrayBuffer;
  cargando: boolean = false;

  formatoActivo: any;


  constructor(private fb: FormBuilder, private readonly router: Router, private readonly visitSrv: Visit ) {

    this.monthToSave = new Date().toISOString().slice(0, 7);

    const navigation = this.router.getCurrentNavigation();

    if(navigation?.extras?.state){
      this.data = navigation.extras.state['data'];
      console.log(this.data);

      this.pdfName = this.data.pdfName;
      this.title = this.data.title;


    }
    this.dinamicForm = this.fb.group({});
  };

 async ngOnInit() {

    this.initForm();

   await this.startVisitProcces(this.pdfName);
  };

  async startVisitProcces(formatoKey: string) {
    this.cargando = true;

    try {

      this.formatoActivo = FORMATOS_VISITA[formatoKey];

      if (!this.formatoActivo) {
        throw new Error('El formato seleccionado no existe en la configuración.');
      }

      const { data } = supabase.storage.from('PdfFiles').getPublicUrl(this.formatoActivo.nombreArchivoPdf);
      const urlPdf = data.publicUrl;
      console.log('URL PDF cargada:', urlPdf);

      await this.loadStructurePDF(urlPdf);

    } catch (error) {
      console.log('Error al procesar la visita:', error);
    } finally {
      this.cargando = false;
    }
  };

  async loadStructurePDF(url: string) {
    this.pdfBytesOriginal = await fetch(url).then(res => res.arrayBuffer());

    const pdfDocParaLeer = await PDFDocument.load(this.pdfBytesOriginal);
    const todosLosCampos = pdfDocParaLeer.getForm().getFields();
    const nombresDeCampos = todosLosCampos.map(campo => campo.getName());
    console.log('NOMBRES EXACTOS EN EL PDF:', nombresDeCampos);


    const totalItems = this.formatoActivo.totalItems;
    const diccionario = this.formatoActivo.diccionario;

    this.itemsEvaluacion = [];

    for (let i = 1; i <= totalItems; i++) {
      const nombreCumple = `item_cumple_${i}`;
      const nombreNoCumple = `item_no_cumple_${i}`;

      const controlCumple = new FormControl(false);
      const controlNoCumple = new FormControl(false);

      this.dinamicForm.addControl(nombreCumple, controlCumple);
      this.dinamicForm.addControl(nombreNoCumple, controlNoCumple);

      controlCumple.valueChanges.subscribe(marcado => {
        if (marcado) {
          controlNoCumple.setValue(false, { emitEvent: false });
        }
      });

      controlNoCumple.valueChanges.subscribe(marcado => {
        if (marcado) {
          controlCumple.setValue(false, { emitEvent: false });
        }
      });

      this.itemsEvaluacion.push({
        id: i,
        descripcion: diccionario[i] || `Descripción pendiente para el ítem ${i}`,
        controlCumple: nombreCumple,
        controlNoCumple: nombreNoCumple
      });
    }

    // Agregar campo de observaciones al formulario dinámico (si no existe aún)
    if (!this.dinamicForm.contains('observaciones')) {
      this.dinamicForm.addControl('observaciones', new FormControl(''));
    }

    console.log('Estructura lista para la vista:', this.itemsEvaluacion);
  };

  async generarPDF() {
    this.cargando = true;

    try {

      const datosDeLaVisita: IVisit = this.formVisit.getRawValue();

      await this.visitSrv.createVisit(datosDeLaVisita)

      const pdfDoc = await PDFDocument.load(this.pdfBytesOriginal);
      const form = pdfDoc.getForm();

      const respuestas = this.dinamicForm.value;
      const totalItems = this.formatoActivo.totalItems;
      let puntajeCumple = 0;

      // 1. Obtener nombres de campos para depuración (ayuda a ver si coinciden con el PDF)
      const camposEnPdf = form.getFields().map(f => f.getName());
      console.log('Campos detectados en el PDF:', camposEnPdf);

      // 2. Llenar los campos del formulario dinámicamente
      for (let i = 1; i <= totalItems; i++) {
        const nombreCumple = `item_cumple_${i}`;
        const nombreNoCumple = `item_no_cumple_${i}`;

        try {
          if (respuestas[nombreCumple] === true) {
            const checkbox = form.getCheckBox(nombreCumple);
            checkbox.check();
            puntajeCumple++;
          }

          if (respuestas[nombreNoCumple] === true) {
            const checkbox = form.getCheckBox(nombreNoCumple);
            checkbox.check();
          }
        } catch (e) {
          // Si el campo no existe en el PDF, se registra un aviso pero continúa el proceso
          console.warn(`Aviso: El campo ${nombreCumple} o ${nombreNoCumple} no existe en este formato PDF.`);
        }
      }

      // 3. Llenar campos de totales y observaciones (si existen)
      try {
        const porcentaje = (puntajeCumple / totalItems) * 100;

        if (camposEnPdf.includes('total_cumplimiento_num')) {
          form.getTextField('total_cumplimiento_num').setText(puntajeCumple.toString());
        }

        if (camposEnPdf.includes('total_cumplimiento_percent')) {
          form.getTextField('total_cumplimiento_percent').setText(`${porcentaje.toFixed(2)} %`);
        }

        // Llenar observaciones de visita
        const obsValue = this.dinamicForm.get('observaciones')?.value || '';
        if (camposEnPdf.includes('observaciones') && obsValue) {
          form.getTextField('observaciones').setText(obsValue);
        }
      } catch (e) {
        console.warn('Error al llenar los campos de totales:', e);
      }

      const todosLosCampos = form.getFields();
      todosLosCampos.forEach(campo => {
        campo.enableReadOnly();
      });

      const pdfBytesLleno = await pdfDoc.save();

      const nombreArchivoFinal = `Visita_Auditoria_${new Date().getTime()}.pdf`;
      this.descargarEnNavegador(pdfBytesLleno, nombreArchivoFinal);

    } catch (error) {
      console.error('Error al generar el documento PDF:', error);
    } finally {
      this.cargando = false;
    }
  };
  //!Revisar solo muestra previsualizacion en Safari
  descargarEnNavegador(pdfBytes: Uint8Array, nombreArchivo: string) {

    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });


    const url = window.URL.createObjectURL(blob);


    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };


  private initForm(){
    this.responsible = new FormControl(this.data.responsible, [Validators.required]);
    this.pdv = new FormControl('', [Validators.required]);
    this.usedPdf = new FormControl(this.data.pdfName, [Validators.required]);
    this.madeAt =  new FormControl(this.data.madeTime, [Validators.required]);
    this.doc = new FormControl(this.data.doc, [Validators.required]);
    this.month = new FormControl(this.monthToSave, [Validators.required]);

    this.formVisit = new FormGroup({
      responsible: this.responsible,
      pdv: this.pdv,
      usedPdf: this.usedPdf,
      madeAt: this.madeAt,
      doc: this.doc,
      month: this.month
    });
  };


};
