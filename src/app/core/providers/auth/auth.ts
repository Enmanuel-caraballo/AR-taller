import { Injectable } from '@angular/core';
import { Auth as AuthFirebase } from '@angular/fire/auth';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';

import { GlobalEvent } from '../../../shared/services/global-event';
import { createUserWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(
    private authFirebase: AuthFirebase,
    private globalUidSrv: GlobalEvent
  ) { }

  //auntificaciones

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

      const uid = resp.user.uid;

      this.globalUidSrv.setUid(uid);

      return uid;

    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async loginWithGoogle(): Promise<string | null> {
    try {

      const provider = new GoogleAuthProvider();
      const resp = await signInWithPopup(this.authFirebase, provider);

      const uid = resp.user.uid;

      this.globalUidSrv.setUid(uid);

      return uid;

    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async loginWithMicrosoft(): Promise<string | null> {
    try {

      const provider = new OAuthProvider('microsoft.com');
      const resp = await signInWithPopup(this.authFirebase, provider);

      const uid = resp.user.uid;

      this.globalUidSrv.setUid(uid);

      return uid;

    } catch (error) {
      console.log(error);
      return null;
    }
  }
}