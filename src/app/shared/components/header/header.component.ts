import { Component, OnInit } from '@angular/core';
import { IonText } from "@ionic/angular/standalone";
import { IonicModule, MenuController } from "@ionic/angular";
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IUser, IUserCreate } from 'src/app/interfaces/user.interface';
import { GlobalEvent } from 'src/app/shared/services/global-event';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent  implements OnInit {
  name: string = '';

  openSideBar(){
    this.menuCtrl.open('end');
  }
  constructor(private readonly menuCtrl: MenuController, private readonly crudSrv: Crud, private readonly authSrv: Auth ) { }

  async ngOnInit() {

   const user= await this.authSrv.getCurrentUser();

   const uid = user?.userUid;

   if (uid) {
   const user = await this.crudSrv.getByUid('users', uid);

    if(user){
      const mappedUser: IUser = user[0]

      this.name = mappedUser.name

    }

   console.log(this.name);

   }else{
    console.log('No se recupero el usuario');

   }


  }
}
