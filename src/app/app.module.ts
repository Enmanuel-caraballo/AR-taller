import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { environment } from '../environments/environment';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {MatButtonModule} from '@angular/material/button';
import { WelcomePageComponent } from '../app/shared/components/welcome-page/welcome-page.component';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,MatButtonModule,WelcomePageComponent],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  provideHttpClient(),
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
/*npx ng add @angular/fire, registarse en firebase, y https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade  */