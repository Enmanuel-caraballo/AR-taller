import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Categories {

  constructor(private readonly http: HttpClient){}

  getCategories(): Observable<any>{
    return this.http.get('/assets/JSONS/categories.json');
  }

  getMessages(): Observable<any>{
    return this.http.get('/assets/JSONS/messages.json')
  }

  getCartContent(): Observable<any>{
    return this.http.get('/assets/JSONS/cardItems.json')
  }

  
}
