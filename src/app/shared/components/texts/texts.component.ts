import { Component, OnInit } from '@angular/core';
import { Categories } from '../../services/jsonsProviders';
import { IEvents } from 'src/app/interfaces/events.interface';

@Component({
  selector: 'app-texts',
  templateUrl: './texts.component.html',
  styleUrls: ['./texts.component.scss'],
  standalone: false,
})
export class TextsComponent  implements OnInit {

  messages: { message: ''}[] = [];
  events: IEvents[] = [];

  constructor(private readonly providerJsonSrv: Categories) { }

  ngOnInit() {
    // this.providerJsonSrv.getMessages().subscribe(m => {
    //   this.messages = m;
    this.providerJsonSrv.getEvent().subscribe(m => {
      this.events = m;

    });
  }
}
