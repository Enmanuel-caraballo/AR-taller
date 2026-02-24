import { Component, OnInit,  } from '@angular/core';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IEvents } from 'src/app/interfaces/events.interface';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  // arrayEvents: any[] = [];

  constructor(private readonly crudSrv: Crud) { }

  async ngOnInit() {
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
