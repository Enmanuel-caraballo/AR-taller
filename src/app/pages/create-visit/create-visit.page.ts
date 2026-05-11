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

  data!: { madeTime: string, pdfName: string, responsible: string, title: string, doc: string }


  dinamicForm!: FormGroup;
  itemsEvaluacion: any[] = [];
  pdfBytesOriginal!: ArrayBuffer;
  cargando: boolean = false;

  formatoActivo: any;


  constructor(private fb: FormBuilder, private readonly router: Router, private readonly visitSrv: Visit) {

    this.monthToSave = new Date().toISOString().slice(0, 7);

    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.state) {
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
    const nombresDeCampos = pdfDocParaLeer.getForm().getFields().map(c => c.getName());
    console.log('NOMBRES EXACTOS EN EL PDF:', nombresDeCampos);

    const totalItems = this.formatoActivo.totalItems;
    const diccionario = this.formatoActivo.diccionario;
    const tipo = this.formatoActivo.tipoRespuesta; // 👈 NUEVO

    this.itemsEvaluacion = [];

    for (let i = 1; i <= totalItems; i++) {

      // ✅ CASO 1: BOOLEAN
      if (tipo === 'boolean') {

        const nombreCumple = `item_cumple_${i}`;
        const nombreNoCumple = `item_no_cumple_${i}`;

        const controlCumple = new FormControl(false);
        const controlNoCumple = new FormControl(false);

        this.dinamicForm.addControl(nombreCumple, controlCumple);
        this.dinamicForm.addControl(nombreNoCumple, controlNoCumple);

        controlCumple.valueChanges.subscribe(v => {
          if (v) controlNoCumple.setValue(false, { emitEvent: false });
        });

        controlNoCumple.valueChanges.subscribe(v => {
          if (v) controlCumple.setValue(false, { emitEvent: false });
        });

        this.itemsEvaluacion.push({
          id: i,
          descripcion: diccionario[i],
          tipo: 'boolean',
          controlCumple: nombreCumple,
          controlNoCumple: nombreNoCumple
        });
      }

      // ✅ CASO 2: ESCALA 1 A 5
      if (tipo === 'scale_1_5') {

        const nombre = `item_${i}`;
        const control = new FormControl(null, Validators.required);

        this.dinamicForm.addControl(nombre, control);

        this.itemsEvaluacion.push({
          id: i,
          descripcion: diccionario[i],
          tipo: 'scale',
          control: nombre
        });
      }
    }

    if (!this.dinamicForm.contains('observaciones')) {
      this.dinamicForm.addControl('observaciones', new FormControl(''));
    }

    console.log('Estructura lista:', this.itemsEvaluacion);
  }
  ////////////////////////////////////
  async generarPDF() {
    this.cargando = true;

    try {

      const datos: IVisit = this.formVisit.getRawValue();
      await this.visitSrv.createVisit(datos);

      const pdfDoc = await PDFDocument.load(this.pdfBytesOriginal);
      const form = pdfDoc.getForm();

      const respuestas = this.dinamicForm.value;
      const totalItems = this.formatoActivo.totalItems;

      let sumaTotal = 0;

      const campos = form.getFields().map(f => f.getName());
      console.log('Campos PDF:', campos);

      //  ITEMS (1 a 5)
      for (let i = 1; i <= totalItems; i++) {

        const control = `item_${i}`;
        const campoPdf = `pnto_item${i}`;

        const valor = respuestas[control];

        if (valor !== null && valor !== undefined) {

          sumaTotal += Number(valor);

          try {
            if (campos.includes(campoPdf)) {
              form.getTextField(campoPdf).setText(valor.toString());
            }
          } catch (e) {
            console.warn(`No existe ${campoPdf}`);
          }
        }
      }

      // 🔥 CALCULO
      const max = totalItems * 5;
      const porcentaje = (sumaTotal / max) * 100;

      // 🔥 LLENAR HEADER
      try {

        if (campos.includes('nombre_pdv')) {
          form.getTextField('nombre_pdv').setText(this.pdv.value || '');
        }

        if (campos.includes('fecha_eva')) {
          form.getTextField('fecha_eva').setText(this.madeAt.value || '');
        }

        if (campos.includes('lider_pdv')) {
          form.getTextField('lider_pdv').setText(this.responsible.value || '');
        }

        if (campos.includes('hora_eva')) {
          form.getTextField('hora_eva').setText(this.madeAt.value || '');
        }

        // ⚠️ ESTE ES EL IMPORTANTE
        if (campos.includes('puntuacion_pdv')) {
          form.getTextField('puntuacion_pdv').setText(`${porcentaje.toFixed(2)} %`);
        }

        if (campos.includes('tot_eva')) {
          form.getTextField('tot_eva').setText(sumaTotal.toString());
        }

        const obs = this.dinamicForm.get('observaciones')?.value || '';
        if (campos.includes('observa_eva')) {
          form.getTextField('observa_eva').setText(obs);
        }

      } catch (e) {
        console.warn('Error llenando encabezado');
      }

      // 🔒 bloquear
      form.getFields().forEach(f => f.enableReadOnly());

      const pdfBytes = await pdfDoc.save();

      this.descargarEnNavegador(pdfBytes, `Visita_${Date.now()}.pdf`);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.cargando = false;
    }
  }


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


  private initForm() {
    this.responsible = new FormControl(this.data.responsible, [Validators.required]);
    this.pdv = new FormControl('', [Validators.required]);
    this.usedPdf = new FormControl(this.data.pdfName, [Validators.required]);
    this.madeAt = new FormControl(this.data.madeTime, [Validators.required]);
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
