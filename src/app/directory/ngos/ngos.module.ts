import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgosPageRoutingModule } from './ngos-routing.module';

import { NgosPage } from './ngos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgosPageRoutingModule
  ],
  // declarations: [NgosPage]
})
export class NgosPageModule {}
