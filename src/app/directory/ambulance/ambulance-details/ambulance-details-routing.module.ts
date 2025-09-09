import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmbulanceDetailsPage } from './ambulance-details.page';

const routes: Routes = [
  {
    path: '',
    component: AmbulanceDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmbulanceDetailsPageRoutingModule {}
