import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';  // ✅ Correct import
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule   // ✅ Correct usage
  ],
  // declarations: [HomePage]
})
export class HomePageModule {}
