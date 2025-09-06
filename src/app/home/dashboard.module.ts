import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   // Needed for [(ngModel)]
import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';

@NgModule({
  imports: [
    CommonModule,        // Fixes *ngFor / *ngIf
    FormsModule,         // Fixes [(ngModel)]
    IonicModule,         // Fixes all <ion-*> components
    DashboardPageRoutingModule
  ],
  // declarations: [DashboardPage]
})
export class DashboardPageModule {}
