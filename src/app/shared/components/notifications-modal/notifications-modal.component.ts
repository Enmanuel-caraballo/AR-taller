import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { INotification } from 'src/app/interfaces/notification.interface';
import { NotificationService } from '../../services/notification/notification.service';
import { GlobalEvent } from '../../services/global-event';

@Component({
  selector: 'app-notifications-modal',
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.scss'],
  standalone: false,
})
export class NotificationsModalComponent implements OnInit {
  notifications: INotification[] = [];
  isLoading = true;

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly notifSrv: NotificationService,
    private readonly navSrv: NavController,
  ) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.isLoading = true;
    this.notifications = await this.notifSrv.getMyNotifications();
    this.isLoading = false;
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  async onNotifTap(notif: INotification) {
    if (!notif.id) return;
    await this.notifSrv.markAsRead(notif.id);
    notif.read = true;
    if (notif.type == 'ev') {
      await this.modalCtrl.dismiss({ unreadCount: this.unreadCount });
      this.navSrv.navigateRoot('notify-details', {
        state: { data: notif }
      });
    }

  }

  async markAllAsRead() {
    await this.notifSrv.markAllAsRead(this.notifications);
    this.notifications.forEach(n => (n.read = true));
  }

  closeModal() {
    this.modalCtrl.dismiss({ unreadCount: this.unreadCount });
  }
}
