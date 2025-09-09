import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClinicsDetailsPageRoutingModule } from './clinics-details-routing.module';

import { ClinicsDetailsPage } from './clinics-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClinicsDetailsPageRoutingModule
  ],
  // declarations: [ClinicsDetailsPage]
})
export class ClinicsDetailsPageModule {}
