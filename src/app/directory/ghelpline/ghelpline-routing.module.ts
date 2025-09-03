import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GhelplinePage } from './ghelpline.page';

const routes: Routes = [
  {
    path: '',
    component: GhelplinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhelplinePageRoutingModule {}
