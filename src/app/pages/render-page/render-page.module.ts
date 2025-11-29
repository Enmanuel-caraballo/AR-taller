import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenderPagePageRoutingModule } from './render-page-routing.module';

import { RenderPagePage } from './render-page.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RenderPagePageRoutingModule,
  ],
  declarations: [RenderPagePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RenderPagePageModule {}
