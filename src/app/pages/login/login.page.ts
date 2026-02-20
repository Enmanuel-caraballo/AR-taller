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

  isLoading = false;
  errorMessage = '';

  constructor(
    private authSrv: Auth,
    private readonly navSrv: NavController
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

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

  // 🔐 LOGIN NORMAL
  async login(): Promise<void> {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const uid = await this.authSrv.login(
      this.email.value,
      this.password.value
    );

    this.isLoading = false;

    if (uid) {
      this.navSrv.navigateRoot('home');
    } else {
      this.errorMessage = 'Credenciales incorrectas';
    }
  }

  // 🔵 GOOGLE
  async loginWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    const uid = await this.authSrv.loginWithGoogle();

    this.isLoading = false;

    if (uid) {
      this.navSrv.navigateRoot('home');
    } else {
      this.errorMessage = 'Error al iniciar sesión con Google';
    }
  }

  // 🟦 MICROSOFT
  async loginWithMicrosoft(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    const uid = await this.authSrv.loginWithMicrosoft();

    this.isLoading = false;

    if (uid) {
      this.navSrv.navigateRoot('home');
    } else {
      this.errorMessage = 'Error al iniciar sesión con Microsoft';
    }
  }
}