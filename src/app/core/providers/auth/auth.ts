import { Injectable } from '@angular/core';
import {Auth as AuthFirebase, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from '@angular/fire/auth';
import { GlobalEvent } from 'src/app/shared/services/global-event';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private readonly authFirebase: AuthFirebase, private readonly globalUidSrv: GlobalEvent){}

  async getCurrentUser(): Promise<string | null>{
    const auth = getAuth();
    const user = auth.currentUser;

    if(user){
      const uid = user.uid;
      this.globalUidSrv.setUid(uid);
      return uid
    }else{
      console.log("Not logged user");
      return null;
    }
  }

  async create(email: string, password: string){
    const request = await createUserWithEmailAndPassword(this.authFirebase, email, password);
    console.log(request);
    return request.user.uid;
  }

  async login(email: string, password: string){
    try {
      const resp = await signInWithEmailAndPassword(this.authFirebase, email, password);

      console.log("SI", resp.operationType);

      return resp.operationType;

    } catch (error) {
     console.log((error as any).message);
     return error;
    }
  }
}
