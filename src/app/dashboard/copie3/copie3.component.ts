import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-copie3',
  imports: [],
  templateUrl: './copie3.component.html',
  styleUrl: './copie3.component.css'
})
export class Copie3Component {
  userEmail: string = '';

  constructor(private router: Router) {}

  logout(): void {
    // Clear any session data if needed
    this.router.navigate(['/login']);
  }
}
