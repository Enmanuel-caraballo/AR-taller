import { Component, OnInit,  } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IEvents } from 'src/app/interfaces/events.interface';
import { IUserCreate } from 'src/app/interfaces/user.interface';
import { GlobalEvent } from 'src/app/shared/services/global-event';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  // arrayEvents: any[] = [];

  constructor(private readonly crudSrv: Crud, private readonly authSrv: Auth, private readonly globalSrv: GlobalEvent) { }

  async ngOnInit() {

   const user= await this.authSrv.getCurrentUser();

   const uid = user?.userUid;

   if (uid) {
   const user = this.crudSrv.getByUid('users', uid)
   console.log(user);

   }else{
    console.log('No se recupero el usuario');

   }



//    const events = await this.crudSrv.getAll('events');

//  if (events) {
//        events.forEach(event =>{

//         //  this.name = user.name;
//         //  this.lastName = user.lastName;
//         //  this.gender = user.gender;
//         //  this.img = user.images[0];

//          const userShow: IEvents = {
//          title: event.title,
//          pdv:  event.pdv,
//          start: event.start,
//          end: event.end,
//          description: event.description,
//          department: event.department
//         }
//         this.arrayEvents.push(userShow);
//        });

//     console.log(this.arrayEvents);
//       }

  }

}
