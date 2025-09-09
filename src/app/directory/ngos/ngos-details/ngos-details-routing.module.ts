import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NgosDetailsPage } from './ngos-details.page';

const routes: Routes = [
  {
    path: '',
    component: NgosDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgosDetailsPageRoutingModule {}
