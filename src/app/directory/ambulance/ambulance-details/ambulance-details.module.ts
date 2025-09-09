import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmbulanceDetailsPageRoutingModule } from './ambulance-details-routing.module';

import { AmbulanceDetailsPage } from './ambulance-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmbulanceDetailsPageRoutingModule
  ],
  // declarations: [AmbulanceDetailsPage]
})
export class AmbulanceDetailsPageModule {}
