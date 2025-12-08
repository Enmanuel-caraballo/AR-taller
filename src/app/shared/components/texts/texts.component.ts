import { Component, OnInit } from '@angular/core';
import { Categories } from '../../services/jsonsProviders';

@Component({
  selector: 'app-texts',
  templateUrl: './texts.component.html',
  styleUrls: ['./texts.component.scss'],
  standalone: false,
})
export class TextsComponent  implements OnInit {
  
  messages: { message: ''}[] = [];

  constructor(private readonly providerJsonSrv: Categories) { }

  ngOnInit() {
    this.providerJsonSrv.getMessages().subscribe(m => {
      this.messages = m;
    })
  }
}
