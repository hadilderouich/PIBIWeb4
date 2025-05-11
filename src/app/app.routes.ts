import { Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { Copie1Component } from './dashboard/copie1/copie1.component';
import { Copie2Component } from './dashboard/copie2/copie2.component';
import { Copie3Component } from './dashboard/copie3/copie3.component';
import { LoginComponent } from './login/login.component';
import { MLFormComponent } from './mlform/mlform.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard/copie1',
    component: Copie1Component,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/copie2',
    component: Copie2Component,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/copie3',
    component: Copie3Component,
    canActivate: [AuthGuard]
  },
  {
    path: 'Formulaire',
    component: MLFormComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
