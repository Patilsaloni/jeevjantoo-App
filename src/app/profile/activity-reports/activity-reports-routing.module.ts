import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityReportsPage } from './activity-reports.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityReportsPageRoutingModule {}
