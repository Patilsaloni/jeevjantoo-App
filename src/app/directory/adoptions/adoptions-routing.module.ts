import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdoptionsPage } from './adoptions.page';

const routes: Routes = [
  {
    path: '',
    component: AdoptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdoptionsPageRoutingModule {}
