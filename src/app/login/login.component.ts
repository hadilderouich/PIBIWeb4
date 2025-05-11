import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  allowedEmails: Record<string, string> = {
    'wala.aloulou@esprit.tn': 'Password123',
    'bahaeddine.elfidha@esprit.tn': 'Password123',
    'hadil.derouich@esprit.tn': 'Password123',
    'meriem.dghaies@esprit.tn': 'Password123',
    'hadil.miladi@gmail.com': 'Password123',
    'mouhib.jendoubi@esprit.tn': 'Password123'
  };

  constructor(private router: Router) {}

  onSubmit(): void {
    const email = this.email.toLowerCase();
    if (!this.allowedEmails.hasOwnProperty(email)) {
      this.error = 'This email address is not registered. Please contact the administrator for access.';
      console.error(this.error);
      return;
    }

    const correctPassword = this.allowedEmails[email];
    if (this.password !== correctPassword) {
      this.error = 'Incorrect password. Please try again.';
      console.error(this.error);
      return;
    }

    console.log('Login successful');
    localStorage.setItem('isLoggedIn', 'true');

    if (email === 'wala.aloulou@esprit.tn' || email === 'bahaeddine.elfidha@esprit.tn') {
      this.router.navigate(['/dashboard/copie1']);
    } else if (email === 'hadil.derouich@esprit.tn' || email === 'meriem.dghaies@esprit.tn') {
      this.router.navigate(['/dashboard/copie2']);
    } else {
      this.router.navigate(['/dashboard/copie3']);
    }
  }
}
