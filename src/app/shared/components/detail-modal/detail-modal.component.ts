import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IEvents } from 'src/app/interfaces/events.interface';
import { ITask } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.scss'],
  standalone: false
})
export class DetailModalComponent {
  @Input() items: (IEvents | ITask)[] = [];
  @Input() type: 'evento' | 'tarea' = 'evento';

  constructor(private readonly modalCtrl: ModalController) {}

  get isSingle(): boolean { return this.items.length === 1; }
  get firstItem(): IEvents | ITask { return this.items[0]; }
  get isEvent(): boolean { return this.type === 'evento'; }

  asEvent(item: IEvents | ITask): IEvents { return item as IEvents; }
  asTask(item: IEvents | ITask): ITask { return item as ITask; }

  selectItem(item: IEvents | ITask) {
    this.items = [item];
    
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
