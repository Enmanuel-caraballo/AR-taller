import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: false
})
export class SideMenuComponent  implements OnInit {

  constructor(private readonly authSrv: Auth) { }

  ngOnInit() {}

  signOut(){
    this.authSrv.logOut();
  }
}
