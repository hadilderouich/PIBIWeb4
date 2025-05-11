import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MLFormComponent } from './mlform.component';

@NgModule({
  declarations: [], // Ne rien déclarer ici car MLFormComponent est standalone
  imports: [
    CommonModule,
    MLFormComponent, // Import du composant autonome
    RouterModule.forChild([
      { path: 'formulaire', component: MLFormComponent }
    ]),
    // HttpClientModule ici est optionnel mais acceptable
  ]
})
export class MLFormModule {}
