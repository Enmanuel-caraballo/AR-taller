import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './shared/components/welcome-page/welcome-page.component';

const routes: Routes = [
  /* {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  }, */
  /* {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }, */

  {
    path: '',
    component: WelcomePageComponent
  },
  {
    path:'auth',
    loadChildren:()=>import('./shared/components/auth/auth-module')
    .then( m => m.AuthModule)
  },
  {
    path:'dashboard',
    loadChildren:()=>import('./shared/components/dashboard/dashboard-module')
    .then( m => m.DashboardModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
/*npx ng add @angular/fire, registarse en firebase, y https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade  */
export class AppRoutingModule { }
