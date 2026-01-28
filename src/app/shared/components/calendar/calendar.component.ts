import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [FullCalendarModule, CommonModule],
})
export class CalendarComponent  implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin]
  }

  constructor() { }

  ngOnInit() {

  }

}
