import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { GlobalEvent } from '../../services/global-event';
import { IEvents } from 'src/app/interfaces/events.interface';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: false
})
export class ModalComponent  implements OnInit {

  @Input() events: IEvents[] = [];

  eventsDate = '';

  constructor(private readonly modalCtrl: ModalController, private readonly globalEventSrv: GlobalEvent) { }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  ngOnInit() {

    console.log(this.events);

  // const events = this.globalEventSrv.getEvents();
    // const mappedEvents = events.map(ev => ({
    //   id: ev.id,
    //   title: ev.title,
    //   start: ev.start,
    //   end: ev.end,
    //   allDay: ev.allDay,
    // }));

  if (this.events.length) {
    this.eventsDate = this.events[0].start;
  }

  }



}
