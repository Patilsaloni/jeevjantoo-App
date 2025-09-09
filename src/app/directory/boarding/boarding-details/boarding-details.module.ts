import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardingDetailsPageRoutingModule } from './boarding-details-routing.module';

import { BoardingDetailsPage } from './boarding-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardingDetailsPageRoutingModule
  ],
  // declarations: [BoardingDetailsPage]
})
export class BoardingDetailsPageModule {}
