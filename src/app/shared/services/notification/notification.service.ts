import { Injectable } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Crud } from 'src/app/core/providers/crudFirebase/crud';
import { INotification } from 'src/app/interfaces/notification.interface';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(
    private readonly crudSrv: Crud,
    private readonly authSrv: Auth
  ) {}

  async getMyNotifications(): Promise<INotification[]> {
    const user = await this.authSrv.getCurrentUser();
    if (!user?.userUid) return [];
    return this.crudSrv.getNotifications(user.userUid) as Promise<INotification[]>;
  }

  async markAsRead(notificationId: string): Promise<void> {
    return this.crudSrv.update('notifications', notificationId, { read: true });
  }

  async markAllAsRead(notifications: INotification[]): Promise<void> {
    const unread = notifications.filter(n => !n.read && n.id);
    await Promise.all(unread.map(n => this.markAsRead(n.id!)));
  }
}
