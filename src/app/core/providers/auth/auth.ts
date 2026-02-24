import { Injectable } from '@angular/core';
import {Auth as AuthFirebase, createUserWithEmailAndPassword, getAuth, getRedirectResult, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut} from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { GlobalEvent } from 'src/app/shared/services/global-event';

@Injectable({
  providedIn: 'root'
})
export class Auth {


  constructor(
    private authFirebase: AuthFirebase,
    private globalUidSrv: GlobalEvent,
    private readonly navSrv: NavController
  ) {

  }

  async getCurrentUser(): Promise<string | null> {
    const user = this.authFirebase.currentUser;

    if (user) {
      this.globalUidSrv.setUid(user.uid);

      return user.uid;
    }

    return null;
  }

  async create(email: string, password: string): Promise<string | null> {
    try {

      const resp = await createUserWithEmailAndPassword(
        this.authFirebase,
        email,
        password
      );

      const uid = resp.user.uid;

      this.globalUidSrv.setUid(uid);

      return uid;

    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async login(email: string, password: string): Promise<string | null> {
    try {

      const resp = await signInWithEmailAndPassword(
        this.authFirebase,
        email,
        password
      );

      const request = resp.operationType;

      return request;

    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async loginWithGoogle(){
      const provider = new GoogleAuthProvider();

      return await signInWithRedirect(this.authFirebase, provider);
  }

  async getResiltadosRedirect(){
    return await getRedirectResult(this.authFirebase);
  }

  async loginWithMicrosoft(): Promise<string | null> {
    try {

      const provider = new OAuthProvider('microsoft.com');
      const resp = await signInWithPopup(this.authFirebase, provider);

      console.log("SI", resp.operationType);

      return resp.operationType;

    } catch (error) {
     console.log((error as any).message);
     return null
    }
  }

  async logOut(){
   try {
    await signOut(this.authFirebase);
   } catch (error) {
    throw error;
   }
  }
}
