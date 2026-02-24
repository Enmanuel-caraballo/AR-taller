import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.scss'],
  standalone: false,
})
export class CreateEventModalComponent {
  @Input() dateStr = '';

  constructor(private readonly modalCtrl: ModalController) {}

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  selectType(type: 'evento' | 'tarea') {
    this.modalCtrl.dismiss({ type, date: this.dateStr }, 'confirm');
  }
}
