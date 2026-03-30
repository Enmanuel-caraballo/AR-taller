export type userRoles = 'admin' | 'super-admin' | 'user';
export interface IUser {
  doc: string | '';
  uid: string;
  name: string;
  lastName: string;
  department: string;
  email: string;
  password: string;
  photoURL?: string;
  rol?: userRoles
  state?: string;
  active?: boolean;
}

export interface IUserCreate extends Omit<IUser, 'uid'> { };
