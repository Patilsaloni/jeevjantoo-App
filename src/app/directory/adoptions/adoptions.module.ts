import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdoptionsPageRoutingModule } from './adoptions-routing.module';

import { AdoptionsPage } from './adoptions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdoptionsPageRoutingModule
  ],
  // declarations: [AdoptionsPage]
})
export class AdoptionsPageModule {}
