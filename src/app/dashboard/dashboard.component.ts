import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userEmail: string = localStorage.getItem('userEmail') || '';

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
}
