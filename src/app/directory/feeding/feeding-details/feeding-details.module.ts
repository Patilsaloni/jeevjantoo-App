import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedingDetailsPageRoutingModule } from './feeding-details-routing.module';

import { FeedingDetailsPage } from './feeding-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeedingDetailsPageRoutingModule
  ],
  // declarations: [FeedingDetailsPage]
})
export class FeedingDetailsPageModule {}
