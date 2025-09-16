import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdoptionPage } from './adoption.page';
import { PetDetailsPage } from './pet-details/pet-details.page';
import { AuthGuard } from '../guards/auth-guard'; 

const routes: Routes = [
  {
    path: '',
    component: AdoptionPage,
    canActivate: [AuthGuard],       // Protect parent route
    canActivateChild: [AuthGuard],  
  },
   {
    path: 'pets/pet-details/:name',
    component: PetDetailsPage,
  },
  {
    path: 'submit-pet',
    loadChildren: () => import('./submit-pet/submit-pet.module').then( m => m.SubmitPetPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdoptionPageRoutingModule {}
