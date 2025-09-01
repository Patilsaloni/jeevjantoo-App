import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   // 👈 add this
import { IonicModule } from '@ionic/angular';

import { SigninPageRoutingModule } from './signin-routing.module';
import { SigninPage } from './signin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,         // 👈 required for [(ngModel)]
    IonicModule,
    SigninPageRoutingModule
  ],
  // declarations: [SigninPage]
})
export class SigninPageModule {}
