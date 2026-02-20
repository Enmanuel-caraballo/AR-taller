import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const uid = await this.authService.getCurrentUser();

    if (uid) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}