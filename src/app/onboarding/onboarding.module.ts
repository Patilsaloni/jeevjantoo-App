import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { OnboardingPage } from './onboarding.page';
import { OnboardingPageRoutingModule } from './onboarding-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    OnboardingPageRoutingModule,
    OnboardingPage
  ]
})
export class OnboardingPageModule {}