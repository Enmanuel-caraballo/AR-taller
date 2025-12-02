import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabComponentComponent } from './components/tab-component/tab-component.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ChipComponent } from './components/chip/chip.component';

import {
  register as registerSwiperElement
} from 'swiper/element/bundle';
registerSwiperElement();

const components = [TabComponentComponent, HeaderComponent, ChipComponent];
const modules = [IonicModule, RouterModule];

@NgModule({
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [components],
  imports: [
    CommonModule,
    modules,
],
  exports:[components, modules],
})
export class SharedModule { }
