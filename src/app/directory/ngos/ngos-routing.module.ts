import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NgosPage } from './ngos.page';

const routes: Routes = [
  {
    path: '',
    component: NgosPage
  },  {
    path: 'ngos-details',
    loadChildren: () => import('./ngos-details/ngos-details.module').then( m => m.NgosDetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgosPageRoutingModule {}
