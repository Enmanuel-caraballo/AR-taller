import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private authSrv: Auth) {
    this.initForm();
   }

  ngOnInit() {
  }

  private initForm(){
    this.email = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required]);

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }


  login(){
    this.authSrv.login(this.email.value, this.password.value);
  }

}
