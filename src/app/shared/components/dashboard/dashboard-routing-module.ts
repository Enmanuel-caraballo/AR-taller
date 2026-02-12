import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from 'src/app/pages/home/home.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../../../pages/home/home.module').then(m => m.HomePageModule)
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
