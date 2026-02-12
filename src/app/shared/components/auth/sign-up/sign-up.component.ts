import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  Auth, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  authForm!: FormGroup;

  auth = inject(Auth);

  googleProvider = new GoogleAuthProvider();
  microsoftProvider = new OAuthProvider('microsoft.com');

  isSubmissionInProgress = false;
  errorMessage = "";

  constructor(private router: Router) {
    this.initForm();

    // Forzar selector en Microsoft
    this.microsoftProvider.setCustomParameters({
      prompt: 'select_account'
    });
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
      await createUserWithEmailAndPassword(
        this.auth,
        this.authForm.value.email,
        this.authForm.value.password
      );

      this.router.navigate(['/dashboard']);

    } catch (error: any) {
      this.errorMessage = this.getFirebaseErrorMessage(error.code);
    } finally {
      this.isSubmissionInProgress = false;
    }
  }

  async onSignUpWithGoogle() {
    try {
      await signInWithPopup(this.auth, this.googleProvider);
      this.router.navigate(['/dashboard']);
    } catch {
      this.errorMessage = "Error con Google";
    }
  }

  async onSignUpWithMicrosoft() {
    try {
      await signInWithPopup(this.auth, this.microsoftProvider);
      this.router.navigate(['/dashboard']);
    } catch {
      this.errorMessage = "Error con Microsoft";
    }
  }

  getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'El email ya está registrado';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      default:
        return 'Error al registrarse';
    }
  }
}
