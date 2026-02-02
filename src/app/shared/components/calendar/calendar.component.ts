import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'
import { CalendarOptions } from '@fullcalendar/core';
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


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [FullCalendarModule, CommonModule],
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

    // this.globaEventSrv.setEvents(events);



  }

  constructor(private readonly providerJsonSrv: Categories, private readonly modalCtrl: ModalController, private readonly globaEventSrv: GlobalEvent) { }

  ngOnInit() {
    this.providerJsonSrv.getEvent().subscribe(e => {
      this.events = e;

      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events,
      }
      // console.log(e);
      // console.log(this.events);

    });
    // console.log(this.events);

    // this.calendarOptions = {
    //   ...this.calendarOptions,
    //   events: this.events,
    // }
  };

}
