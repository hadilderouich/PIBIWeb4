import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http'; // ✅ pour l'import standalone
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router'; // ✅ Ajout nécessaire

@Component({
  selector: 'app-mlform',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule // ✅ Nécessaire pour utiliser HttpClient dans un standalone component
  ],
  templateUrl: './mlform.component.html',
  styleUrls: ['./mlform.component.css']
})
export class MLFormComponent implements OnInit {
  loginForm!: FormGroup;
  predictedDate: string = '';
  erreur: string = '';

  constructor(private http: HttpClient, private router: Router) {} // ✅ injection du Router

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      nom: new FormControl('', Validators.required),
      prenom: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
      ]),
      dateEntretien: new FormControl('', Validators.required)
    });
  }

  envoyer() {
    if (this.loginForm.invalid) {
      this.erreur = 'Please fill in all fields correctly..';
      this.predictedDate = '';
      return;
    }

    const requestData = {
      date_entretien: this.loginForm.value.dateEntretien
    };

    this.http.post<any>('http://127.0.0.1:5001/predire', requestData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe(
      (response) => {
        this.predictedDate = response.date_predite;
        this.erreur = '';
      },
      (error) => {
        console.error('Erreur:', error);
        this.erreur = error.error ? error.error : 'Error while prediction';
        this.predictedDate = '';
      }
    );
  }

  logout(): void {
    this.router.navigate(['/login']); // ✅ bonne utilisation de this.router
  }
}
