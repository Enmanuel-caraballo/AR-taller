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


  async login(){
   const request = await this.authSrv.login(this.email.value, this.password.value);

    if (request === 'signIn') {
      this.navSrv.navigateRoot('home');
    }else{
      console.log('nada');
    }

  }

}
