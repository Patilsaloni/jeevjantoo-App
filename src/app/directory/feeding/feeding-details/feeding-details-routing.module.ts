import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedingDetailsPage } from './feeding-details.page';

const routes: Routes = [
  {
    path: '',
    component: FeedingDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedingDetailsPageRoutingModule {}
