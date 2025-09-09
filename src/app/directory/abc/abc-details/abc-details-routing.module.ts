import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbcDetailsPage } from './abc-details.page';

const routes: Routes = [
  {
    path: '',
    component: AbcDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbcDetailsPageRoutingModule {}
