import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgosDetailsPageRoutingModule } from './ngos-details-routing.module';

import { NgosDetailsPage } from './ngos-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgosDetailsPageRoutingModule
  ],
  // declarations: [NgosDetailsPage]
})
export class NgosDetailsPageModule {}
