import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
