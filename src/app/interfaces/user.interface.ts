export interface IUser{
  uid: string;
  name: string;
  lastName: string;
  department: string;
  email: string;
  password: string;
  photoURL?: string;
  rol?: string;
}

export interface IUserCreate extends Omit<IUser, 'uid'> {};
