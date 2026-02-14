import { Injectable } from '@angular/core';
import {Auth as AuthFirebase, getAuth} from '@angular/fire/auth';
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
}
