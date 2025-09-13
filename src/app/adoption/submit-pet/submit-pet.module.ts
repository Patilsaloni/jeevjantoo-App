import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmitPetPageRoutingModule } from './submit-pet-routing.module';

import { SubmitPetPage } from './submit-pet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmitPetPageRoutingModule
  ],
  // declarations: [SubmitPetPage]
})
export class SubmitPetPageModule {}
