import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdoptionPage } from './adoption.page';
import { PetDetailsPage } from './pet-details/pet-details.page';
import { AuthGuard } from '../guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: AdoptionPage },
      { path: 'pet-details/:id', component: PetDetailsPage },

      // (optional) keep old links working: /adoption/pets/pet-details/:id
      { path: 'pets/pet-details/:id', redirectTo: 'pet-details/:id', pathMatch: 'full' },

      {
        path: 'submit-pet',
        loadChildren: () =>
          import('./submit-pet/submit-pet.module').then(m => m.SubmitPetPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdoptionPageRoutingModule {}
