import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardingPage } from './boarding.page';

const routes: Routes = [
  {
    path: '',
    component: BoardingPage
  },  {
    path: 'boarding-details',
    loadChildren: () => import('./boarding-details/boarding-details.module').then( m => m.BoardingDetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardingPageRoutingModule {}
