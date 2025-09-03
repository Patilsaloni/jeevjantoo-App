import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsurancePageRoutingModule } from './insurance-routing.module';

import { InsurancePage } from './insurance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsurancePageRoutingModule
  ],
  // declarations: [InsurancePage]
})
export class InsurancePageModule {}
