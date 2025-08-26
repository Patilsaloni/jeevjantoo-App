import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PetsPage } from './pets.page';
import { PetsPageRoutingModule } from './pets-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    PetsPageRoutingModule,
    PetsPage
  ]
})
export class PetsPageModule {}