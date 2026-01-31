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


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [FullCalendarModule, CommonModule],
})
export class CalendarComponent  implements OnInit {

  events: IEvents[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    locale: esLocale,
  }

  constructor(private readonly providerJsonSrv: Categories) { }

  ngOnInit() {
     this.providerJsonSrv.getEvent().subscribe( e => {
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
