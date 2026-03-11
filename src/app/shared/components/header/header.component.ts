import { Component, OnInit } from '@angular/core';
import { MenuController } from "@ionic/angular";
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IUser } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit {
  name: string = '';
  initial: string = '';
  userUid: string = '';

  constructor(
    private readonly menuCtrl: MenuController,
    private readonly crudSrv: Crud,
    private readonly authSrv: Auth
  ) { }

  async ngOnInit() {
    const user = await this.authSrv.getCurrentUser();
    if (user) {
      this.userUid = user.userUid;
      // Fetch fresh data if needed, or use what's returned
      // user.userName might already be there, but let's double check with crud if needed
      // The authSrv.getCurrentUser already fetches from crud, so user.userName should be correct
      if (user.userName) {
         this.name = user.userName;
         this.setInitial();
      } else {
         // Fallback if userName is missing in the returned object (though logic in Auth says it returns it)
         const userData = await this.crudSrv.getByUid('users', this.userUid);
         if (userData && userData[0]) {
            this.name = `${userData[0].name}`;
            this.setInitial();
         }
      }
    }
  }

  setInitial() {
    if (this.name) {
      this.initial = this.name.charAt(0).toUpperCase();
    }
  }

  openSideBar() {
    this.menuCtrl.open('end');
  }

  async logout() {
    await this.authSrv.logOut();
    window.location.href = '/login';
  }
}
