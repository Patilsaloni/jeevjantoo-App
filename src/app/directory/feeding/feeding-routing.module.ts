import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedingPage } from './feeding.page';

const routes: Routes = [
  {
    path: '',
    component: FeedingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedingPageRoutingModule {}
