import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DashboardPage } from './dashboard.page';
import { DashboardPageRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [], // Remove DashboardPage from declarations
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    DashboardPageRoutingModule,
    DashboardPage // Add DashboardPage to imports
  ]
})
export class DashboardPageModule {}