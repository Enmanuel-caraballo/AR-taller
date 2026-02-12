import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing-module';

// 👇 Importamos los componentes standalone
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,

    // 👇 Como son standalone, van en imports
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent
  ]
})
export class AuthModule { }
