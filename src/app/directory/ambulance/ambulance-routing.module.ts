import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmbulancePage } from './ambulance.page';

const routes: Routes = [
  {
    path: '',
    component: AmbulancePage
  },  {
    path: 'ambulance-details',
    loadChildren: () => import('./ambulance-details/ambulance-details.module').then( m => m.AmbulanceDetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmbulancePageRoutingModule {}
