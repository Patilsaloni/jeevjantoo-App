import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmitPetPage } from './submit-pet.page';

const routes: Routes = [
  {
    path: '',
    component: SubmitPetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmitPetPageRoutingModule {}
