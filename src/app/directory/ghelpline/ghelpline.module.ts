import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GhelplinePageRoutingModule } from './ghelpline-routing.module';

import { GhelplinePage } from './ghelpline.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GhelplinePageRoutingModule
  ],
  // declarations: [GhelplinePage]
})
export class GhelplinePageModule {}
