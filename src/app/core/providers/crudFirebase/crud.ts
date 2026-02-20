import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class Crud {
  constructor(private readonly fireSt: Firestore){ }


  async register(collectionName: string, data:any, uid:string){
    try {
      const docRef = doc(this.fireSt, collectionName, uid);
      await setDoc(docRef, data);
      console.log("Documento con", uid);
    } catch (error) {
      throw error;
    }
  }

  async add(collectionName: string, data:any,){
    try {
      const docRef = collection(this.fireSt, collectionName);
      return await addDoc(docRef,data)
    } catch (error) {
      throw error;
    }
  }
}
