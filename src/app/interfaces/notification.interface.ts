export interface INotification {
  id?: string;
  to: string;
  from: string;
  message: string;
  date: string;
  read: boolean;
}
