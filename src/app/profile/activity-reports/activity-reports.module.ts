import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityReportsPageRoutingModule } from './activity-reports-routing.module';

import { ActivityReportsPage } from './activity-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityReportsPageRoutingModule
  ],
  // declarations: [ActivityReportsPage]
})
export class ActivityReportsPageModule {}
