import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbcDetailsPageRoutingModule } from './abc-details-routing.module';

import { AbcDetailsPage } from './abc-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AbcDetailsPageRoutingModule
  ],
  // declarations: [AbcDetailsPage]
})
export class AbcDetailsPageModule {}
