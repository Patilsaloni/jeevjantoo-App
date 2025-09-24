import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InquiryThreadPageRoutingModule } from './inquiry-thread-routing.module';
import { InquiryThreadPage } from './inquiry-thread.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InquiryThreadPageRoutingModule
  ],
  // declarations: [InquiryThreadPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InquiryThreadPageModule {}
