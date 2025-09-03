import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedingPageRoutingModule } from './feeding-routing.module';

import { FeedingPage } from './feeding.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeedingPageRoutingModule
  ],
  // declarations: [FeedingPage]
})
export class FeedingPageModule {}
