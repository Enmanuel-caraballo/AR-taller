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
      // const uid = await this.AuthSrv.getCurrentUser();
      const uid = 'hola123';

      if (uid) {

        await this.crudSrv.create('events', {
          uid,
          // id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          // allDay: event.allDay,
          description: event.description,
          department: event.department,
          // author: event.author,
          pdv: event.pdv
        }, uid );
        console.log('Funciona');

      }else{
        console.log("No uid no se agrega");
      }

    } catch (error) {
      console.log(error);

    }
  }
}
