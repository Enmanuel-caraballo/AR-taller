import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Categories } from '../../services/jsonsProviders';
import { IEvents } from 'src/app/interfaces/events.interface';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';
import { GlobalEvent } from '../../services/global-event';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';

//npm run start -- --host=0.0.0.0 --port:8100

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: false,
 /*  imports: [FullCalendarModule, CommonModule], */
})
export class CalendarComponent implements OnInit {

  events: IEvents[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    locale: esLocale,
    dayMaxEvents: 1,
    moreLinkClick: (info) => {
      this.openModal(info.allSegs.map(s => s.event));
      return 'none';
    },
    eventContent: () => {
      return { html: '<span class="fc-custom-event">Evento</span>' };
    },
  dateClick: (arg: any) => {
      this.openCreatePrompt(arg);
    },
    eventClick: (arg: EventClickArg) => {
      this.openModal([arg.event]);
    },

  }

  async openModal(events: any[]) {

    const mappedEvents = events.map(ev => ({
      id: ev.id,
      title: ev.title,
      start: ev.start,
      end: ev.end,
      allDay: ev.allDay,
      ...ev.extendedProps
    }));

    console.log(mappedEvents);

    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.75,
      handle: true,
      cssClass: 'custom-modal',
      componentProps: {
        events: mappedEvents
      }

    });

    await modal.present();

  }

  constructor(private readonly providerJsonSrv: Categories, private readonly modalCtrl: ModalController, private readonly globaEventSrv: GlobalEvent, private readonly crudSrv: Crud) { }

  async ngOnInit() {

    const eventsData = await this.crudSrv.getAll('events');

  if (eventsData) {
    // Mapeamos los eventos a la interfaz
this.events = eventsData.map(event => ({
  title: event.title || 'Sin título',
  start: event.start,
  end: event.end,

  description: event.description || '',
  department: event.department || '',
  pdv: event.pdv || '',
  responsible: event.responsible || '',

  extendedProps: {
    pdv: event.pdv,
    description: event.description,
    department: event.department,
    responsible: event.responsible
  }
}));
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.events
    };

    console.log('Eventos cargados:', this.events);
  }




//  if (events) {
//        events.forEach(event =>{

//         //  this.name = user.name;
//         //  this.lastName = user.lastName;
//         //  this.gender = user.gender;
//         //  this.img = user.images[0];

//          const eventR: IEvents = {
//          title: event.title,
//          pdv:  event.pdv,
//          start: event.start,
//          end: event.end,
//          description: event.description,
//          department: event.department
//         }
//         this.events = eventR;
//        });

//     console.log(this.events);
//       }

    // this.providerJsonSrv.getEvent().subscribe(e => {
    //   this.events = e;

    //   this.calendarOptions = {
    //     ...this.calendarOptions,
    //     events: this.events,
    //   }
    //   // console.log(e);
    //   // console.log(this.events);

    // });
    // console.log(this.events);

    // this.calendarOptions = {
    //   ...this.calendarOptions,
    //   events: this.events,
    // }
  };

  async openCreatePrompt(arg: any) {
    const clickedDate = new Date(arg.date);

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    clickedDate.setHours(0, 0, 0, 0);

    if (clickedDate < today) {
      alert('No puedes crear eventos en fechas pasadas');
      return;
    }

    const { CreateEventModalComponent } = await import('../create-event-modal/create-event-modal.component');

    const modal = await this.modalCtrl.create({
      component: CreateEventModalComponent,
      cssClass: 'custom-create-modal',
      componentProps: {
        dateStr: arg.dateStr
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data) {
      console.log('Tipo seleccionado:', data.type, 'Fecha:', data.date);
    }
  }

}
