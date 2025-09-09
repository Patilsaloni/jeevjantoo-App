import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GhelplineDetailsPage } from './ghelpline-details.page';

const routes: Routes = [
  {
    path: '',
    component: GhelplineDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhelplineDetailsPageRoutingModule {}
