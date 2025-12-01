import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabComponentComponent } from './components/tab-component/tab-component.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

const components = [TabComponentComponent, HeaderComponent];
const modules = [IonicModule, RouterModule];

@NgModule({
  declarations: [components],
  imports: [
    CommonModule,
    modules,
],
  exports:[components, modules],
})
export class SharedModule { }
