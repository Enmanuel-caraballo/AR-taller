import { Component, OnInit } from '@angular/core';
import { INotification } from 'src/app/interfaces/notification.interface';
import { GlobalEvent } from '../../../shared/services/global-event';
import { Router } from '@angular/router';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { IEvents } from 'src/app/interfaces/events.interface';
import { Event } from 'src/app/shared/services/event/event';
import { AlertService } from 'src/app/core/providers/alert/alert.service';

@Component({
  selector: 'app-notify-details',
  templateUrl: './notify-details.page.html',
  styleUrls: ['./notify-details.page.scss'],
  standalone: false
})
export class NotifyDetailsPage implements OnInit {
  selectedItem!: INotification
  constructor(private readonly router: Router, private readonly crudSrv: Crud, private readonly eventSrv: Event, private readonly alertSrv: AlertService) {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.state) {
      this.selectedItem = navigation.extras.state['data'];
      console.log(this.selectedItem);
    }
  }

  ngOnInit() {

  }

  selectItem(item: INotification) {
    this.selectedItem = item;
  }

  async onAccept() {

    try {
      const evVerification = this.selectedItem.event;
      if(evVerification?.uid){
        this.eventSrv.sendMessage(evVerification.uid, 'He aceptado compartir espacio contigo')
        this.crudSrv.add('events', this.selectedItem.event);
        await this.router.navigate(['/home']);
        this.alertSrv.toast('Notificación enviada', 'success');
      }


    } catch (error) {
      this.alertSrv.error('Error al aceptar el evento', 'No se pudo compartir el espacio contacta a soporte')
    }
  }

  onReject() {
    console.log('No compartir espacio:', this.selectedItem);
    // Aquí iría la lógica para rechazar
  }

}
