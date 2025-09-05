import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimalcarePageRoutingModule } from './animalcare-routing.module';

import { AnimalcarePage } from './animalcare.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimalcarePageRoutingModule
  ],
  // declarations: [AnimalcarePage]
})
export class AnimalcarePageModule {}
