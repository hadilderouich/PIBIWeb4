import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-copie1',
  imports: [],
  templateUrl: './copie1.component.html',
  styleUrl: './copie1.component.css'
})
export class Copie1Component {
  userEmail: string = '';

  constructor(private router: Router) {}

  logout(): void {
    // Clear any session data if needed
    this.router.navigate(['/login']);
  }
}
