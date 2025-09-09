import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedingPage } from './feeding.page';

const routes: Routes = [
  {
    path: '',
    component: FeedingPage
  },  {
    path: 'feeding-details',
    loadChildren: () => import('./feeding-details/feeding-details.module').then( m => m.FeedingDetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedingPageRoutingModule {}
