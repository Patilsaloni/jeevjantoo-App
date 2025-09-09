import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardingDetailsPage } from './boarding-details.page';

const routes: Routes = [
  {
    path: '',
    component: BoardingDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardingDetailsPageRoutingModule {}
