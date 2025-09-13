import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AdoptionPage } from './adoption.page';
import { AdoptionPageRoutingModule } from './adoption-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    AdoptionPageRoutingModule,
    AdoptionPage   // ✅ Import standalone component here
  ]
})
export class AdoptionPageModule {}
