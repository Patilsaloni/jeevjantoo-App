import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AdoptionPage } from './adoption.page';
import { AdoptionPageRoutingModule } from './adoption-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    AdoptionPageRoutingModule,
    AdoptionPage
  ]
})
export class AdoptionPageModule {}