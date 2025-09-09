import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GhelplineDetailsPageRoutingModule } from './ghelpline-details-routing.module';

import { GhelplineDetailsPage } from './ghelpline-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GhelplineDetailsPageRoutingModule
  ],
  declarations: [GhelplineDetailsPage]
})
export class GhelplineDetailsPageModule {}
