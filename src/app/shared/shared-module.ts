import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabComponentComponent } from './components/tab-component/tab-component.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ChipComponent } from './components/chip/chip.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  register as registerSwiperElement
} from 'swiper/element/bundle';
import { TextsComponent } from './components/texts/texts.component';
import { CardComponent } from './components/card/card.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ModalComponent } from './components/modal/modal.component';
import { InputComponent } from './components/input/input.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { SelectComponent } from './components/select/select.component';
registerSwiperElement();

const components = [TabComponentComponent, HeaderComponent,
  ChipComponent, TextsComponent, CardComponent, SideMenuComponent,
   ModalComponent, InputComponent, TextAreaComponent, SelectComponent];
const modules = [IonicModule, RouterModule, FormsModule, ReactiveFormsModule];

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
