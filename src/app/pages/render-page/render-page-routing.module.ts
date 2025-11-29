import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenderPagePage } from './render-page.page';

const routes: Routes = [
  {
    path: '',
    component: RenderPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenderPagePageRoutingModule {}
