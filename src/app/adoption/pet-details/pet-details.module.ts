import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetDetailsPageRoutingModule } from './pet-details-routing.module';

import { PetDetailsPage } from './pet-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetDetailsPageRoutingModule
  ],
  declarations: [PetDetailsPage]
})
export class PetDetailsPageModule {}
