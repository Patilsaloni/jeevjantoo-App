import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GhelplinePage } from './ghelpline.page';

const routes: Routes = [
  {
    path: '',
    component: GhelplinePage
  },  {
    path: 'ghelpline-details',
    loadChildren: () => import('./ghelpline-details/ghelpline-details.module').then( m => m.GhelplineDetailsPageModule)
  },
  {
    path: 'ghelpline-details',
    loadChildren: () => import('./ghelpline-details/ghelpline-details.module').then( m => m.GhelplineDetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhelplinePageRoutingModule {}
