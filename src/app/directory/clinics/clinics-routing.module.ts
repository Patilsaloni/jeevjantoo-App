import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClinicsPage } from './clinics.page';

const routes: Routes = [
  {
    path: '',
    component: ClinicsPage
  },  {
    path: 'clinics-details',
    loadChildren: () => import('./clinics-details/clinics-details.module').then( m => m.ClinicsDetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicsPageRoutingModule {}
