import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, OAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatProgressSpinnerModule   // ✅ IMPORTANTE
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  authForm!: FormGroup;

  // Google provider
  googleAuthProvider = new GoogleAuthProvider();
  // Microsoft provider
  microsoftAuthProvider = new OAuthProvider('microsoft.com');


  // Firebase auth instance
  auth = inject(Auth);

  isSubmissionInProgress: boolean = false;
  errorMessage: string = "";

  constructor(private router: Router) {
    this.initForm();
  }

  initForm() {
    this.authForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
    });
  }

  async onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isSubmissionInProgress = true;
    this.errorMessage = "";

    try {
      await signInWithEmailAndPassword(
        this.auth,
        this.authForm.value.email,
        this.authForm.value.password
      );

      this.redirectToDashboardPage();

    } catch (error: any) {
      this.errorMessage = this.getFirebaseErrorMessage(error.code);
    } finally {
      this.isSubmissionInProgress = false;
    }
  }

  //google
  onSignInWithGoogle() {
    signInWithPopup(this.auth, this.googleAuthProvider)
      .then((response) => {
        this.redirectToDashboardPage();
      })
      .catch(error => {
        console.error('error1', error);
        this.errorMessage = "algo salió mal, por favor inténtalo de nuevo"
      })
  }

  //microsoft
  async onSignInWithMicrosoft() {
    this.isSubmissionInProgress = true;
    this.errorMessage = "";

    try {
      await signInWithPopup(this.auth, this.microsoftAuthProvider);
      this.redirectToDashboardPage();
    } catch (error) {
      console.error('Microsoft login error:', error);
      this.errorMessage = "Error al iniciar sesión con Microsoft";
    } finally {
      this.isSubmissionInProgress = false;
    }
  }


  

  redirectToDashboardPage() {
    this.router.navigate(['/dashboard']);
  }

  // Manejo profesional de errores
  getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'El usuario no existe';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde';
      default:
        return 'Error al iniciar sesión';
    }
  }
}
