import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, getDocs, setDoc } from '@angular/fire/firestore';
import { IEvents } from 'src/app/interfaces/events.interface';


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


   async getAll(collectionName: string){
  try {
    const ref = collection(this.fireSt, collectionName);
    // const q = query(ref, where("uid", "==", id));
    const snapshot = await getDocs(ref);

    if (snapshot.empty) {
      console.warn("No hay usuarios");
      return null;
    }

    return snapshot.docs.map(doc =>({
      id: doc.id,
      ...(doc.data() as IEvents)
    }));
  } catch (error) {
    console.log("Error en getById",error);
    return;
  }
 }

}
