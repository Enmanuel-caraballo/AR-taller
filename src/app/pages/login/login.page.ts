import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Auth } from 'src/app/core/providers/auth/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  email!: FormControl;
  password!: FormControl;
  loginForm!: FormGroup;

  constructor(private authSrv: Auth, private readonly navSrv: NavController) {
    this.initForm();
  }

  ngOnInit(): void { }

  private initForm(): void {
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]);

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }


  async login() {
    const request = await this.authSrv.login(this.email.value, this.password.value);

    if (request === 'signIn') {
      this.navSrv.navigateRoot('home');
    } else {
      console.log('nada');
    }

  }
  //google
  async loginWithGoogle(): Promise<void> {
    /* this.isLoading = true;
    this.errorMessage = ''; */

    const uid = await this.authSrv.loginWithGoogle();

    /* this.isLoading = false; */

    if (uid) {
      this.navSrv.navigateRoot('home');
    } else {
      console.log('Error al iniciar sesión con Google');
    }
  }

  //  MICROSOFT
  async loginWithMicrosoft(): Promise<void> {
     /* this.isLoading = true;
     this.errorMessage = ''; */

    const uid = await this.authSrv.loginWithMicrosoft();

      /* this.isLoading = false; */

    if (uid) {
      this.navSrv.navigateRoot('home');
    } else {
      console.log('Error al iniciar sesión con Microsoft');
      ;
    }
  }

}
