import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnimalcarePage } from './animalcare.page';

const routes: Routes = [
  {
    path: '',
    component: AnimalcarePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimalcarePageRoutingModule {}
