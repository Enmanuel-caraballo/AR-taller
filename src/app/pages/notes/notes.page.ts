import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Event } from 'src/app/shared/services/event/event';
import { AlertService } from 'src/app/core/providers/alert/alert.service';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IEvents } from 'src/app/interfaces/events.interface';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false,
})
export class NotesPage implements OnInit {
  title!: FormControl;
  description!: FormControl;
  pdv!: FormControl;
  start!: FormControl;
  end!: FormControl;
  department!: FormControl;

  registerForm!: FormGroup;

  minDate!: string;

  savedEvent!: IEvents;

  constructor(
    private readonly eventSrv: Event,
    private readonly navSrv: NavController,
    private readonly alertSrv: AlertService,
    private readonly crudSrv: Crud
  ) {
    this.initForm();
  }

  ngOnInit() {


    // console.log(this.minDate);
    const now = new Date().toISOString()

    const nowCol = formatDate(now, "yyyy-MM-ddTHH:mm:ss", 'es-CO', '-0500');
    this.minDate = nowCol;
  }

  private initForm() {
    const now = new Date().toISOString()

    const nowCol = formatDate(now, "yyyy-MM-ddTHH:mm:ss", 'es-CO', '-0500');

    console.log(now);


    this.title = new FormControl('', [Validators.required]);
    this.description = new FormControl('', [Validators.required]);
    this.pdv = new FormControl('', [Validators.required]);
    this.start = new FormControl(nowCol, [Validators.required]);
    this.end = new FormControl(nowCol, [Validators.required]);
    this.department = new FormControl('', [Validators.required])

    this.registerForm = new FormGroup({
      title: this.title,
      description: this.description,
      pdv: this.pdv,
      start: this.start,
      end: this.end,
      department: this.department
    });
  }

  public async doSchedule() {
    if (new Date(this.end.value) <= new Date(this.start.value)) {
      this.alertSrv.warning('Fechas inválidas', 'El evento no puede terminar antes de la fecha inicial');
      return;
    }

    try {

      const existingEvents: IEvents[] = await this.crudSrv.getByPdv('events', this.pdv.value) || [];

      const hasConflict = await this.checkEvents(this.start.value, this.end.value, existingEvents);

      if (hasConflict === true) {


        const newStart = new Date(this.start.value).getTime();
        const newEnd = new Date(this.end.value).getTime();

        for (let i = 0; i < existingEvents.length; i++) {
          const dateStartToConvert = existingEvents[i].start
          const dateStartToCompare = new Date(dateStartToConvert).getTime();

          const dateEndToConvert = existingEvents[i].end
          const dateEndToCompare = new Date(dateEndToConvert).getTime();

          if(newStart < dateEndToCompare && newEnd > dateStartToCompare){
            this.savedEvent = existingEvents[i]
            break;
          }

        }

        if (this.savedEvent.uid != null ) {

          const userConfirm = await this.alertSrv.showConflictDialog(this.savedEvent.responsible);
          if (userConfirm.isConfirmed) {
           await this.eventSrv.sendNotification(this.savedEvent.uid, `Solicitar compartir espacio a: ${this.savedEvent.responsible}`);
            await this.navSrv.navigateRoot('home');
            this.alertSrv.toast('Notificación enviada', 'success');
          }else{
            this.alertSrv.toast('Crecion cancelada', 'info')
          }

        }
        return;
      } else if (hasConflict === false) {
        await this.eventSrv.createEvent(this.registerForm.value);
        this.alertSrv.toast('Evento creado exitosamente');
        this.navSrv.navigateRoot('home');
      }

      // await this.eventSrv.createEvent(this.registerForm.value);
      // this.alertSrv.toast('Evento creado exitosamente');
      // this.navSrv.navigateRoot('home');

    } catch (error: any) {
      if (error.code === 'conflict') {
        const conflictingEvent = error.event;
        const result = await this.alertSrv.showConflictDialog(conflictingEvent.responsible || 'Desconocido');

        if (result.isConfirmed) {
          if (conflictingEvent.uid) {
            try {
              await this.eventSrv.sendNotification(
                conflictingEvent.uid,
                `Conflicto de horario en PDV ${this.pdv.value}. Intento de agendar evento: ${this.title.value} (${this.start.value} - ${this.end.value})`
              );
              this.alertSrv.success('Notificación enviada', 'El responsable ha sido notificado.');
            } catch (e) {
              this.alertSrv.error('Error', 'No se pudo enviar la notificación.');
            }
          } else {
            this.alertSrv.warning('Error', 'No se puede notificar al usuario (UID no encontrado).');
          }
        }
      } else {
        console.log(error);
        //nada
        this.alertSrv.error('Error', 'No se pudo crear el evento. Inténtalo de nuevo.');
      }
    }
  }

  async checkEvents(newStart: string, newEnd: string, existentEvents: IEvents[]): Promise<boolean> {
    if (!existentEvents || existentEvents.length === 0) {
      console.log("No hay eventos en ese pdv");
      return false;
    }

    const newStartTime = new Date(newStart).getTime();
    const newEndTime = new Date(newEnd).getTime();

    if (isNaN(newStartTime) || isNaN(newEndTime)) {
      console.error('Las fechas del nuevo evento son inválidas.');
      return true;
    }

    return existentEvents.some(event => {
      const existingStart = new Date(event.start).getTime();
      const existingEnd = new Date(event.end).getTime();
      return (newStartTime < existingEnd) && (newEndTime > existingStart);
    });
  }

}

