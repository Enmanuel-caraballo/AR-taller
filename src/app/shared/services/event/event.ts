import { Injectable } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IEvents } from 'src/app/interfaces/events.interface';


@Injectable({
  providedIn: 'root',
})
export class Event {
  constructor(private readonly crudSrv: Crud, private readonly AuthSrv: Auth){}

  async createEvent(event: IEvents): Promise<void> {
    try {
       const user = await this.AuthSrv.getCurrentUser();
      console.log(user);

       const uid = user?.userUid;

     console.log(user?.userName, '||', user?.userUid);


      if (uid != null) {

        await this.crudSrv.add('events', {
          uid,
          title: event.title,
          start: event.start,
          end: event.end,
          // allDay: event.allDay,
          description: event.description,
          department: event.department,
          responsible: user?.userName,
          pdv: event.pdv
        }, );
        console.log('Funciona');

      }else{
        console.log("No uid no se agrega");
      }

    } catch (error) {
      console.log(error);

    }
  }
}
