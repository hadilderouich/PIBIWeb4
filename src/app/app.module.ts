import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ nécessaire pour ngModel
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { AuthGuard } from './auth.guard';
import { Copie1Component } from './dashboard/copie1/copie1.component';
import { Copie2Component } from './dashboard/copie2/copie2.component';
import { Copie3Component } from './dashboard/copie3/copie3.component';
import { LoginComponent } from './login/login.component';
import { MLFormComponent } from './mlform/mlform.component';
import { EmotionDetectionService } from './services/emotion-detection.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard/copie1', component: Copie1Component, canActivate: [AuthGuard] },
  { path: 'dashboard/copie2', component: Copie2Component, canActivate: [AuthGuard] },
  { path: 'dashboard/copie3', component: Copie3Component, canActivate: [AuthGuard] },
  {path:'Formulaire', component: MLFormComponent,canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}

export const appConfig = {
  imports: [
    RouterModule.forRoot(routes),
    FormsModule, // ✅ important
    LoginComponent,
    Copie1Component,
    Copie2Component,
    Copie3Component,
    AuthGuard
  ],
  providers: [
    EmotionDetectionService
  ]
};
