import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClinicsDetailsPage } from './clinics-details.page';

const routes: Routes = [
  {
    path: '',
    component: ClinicsDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicsDetailsPageRoutingModule {}
