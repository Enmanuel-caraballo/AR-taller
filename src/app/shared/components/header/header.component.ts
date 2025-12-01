import { Component, OnInit } from '@angular/core';
import { IonText } from "@ionic/angular/standalone";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent  implements OnInit {
  name: string = 'Enmanuel';
  constructor() { }

  ngOnInit() {}

}
