import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { INotification } from 'src/app/interfaces/notification.interface';
import { NotificationService } from '../../services/notification/notification.service';

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
    private readonly notifSrv: NotificationService
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
    if (notif.read || !notif.id) return;
    await this.notifSrv.markAsRead(notif.id);
    notif.read = true;
  }

  async markAllAsRead() {
    await this.notifSrv.markAllAsRead(this.notifications);
    this.notifications.forEach(n => (n.read = true));
  }

  closeModal() {
    this.modalCtrl.dismiss({ unreadCount: this.unreadCount });
  }
}
