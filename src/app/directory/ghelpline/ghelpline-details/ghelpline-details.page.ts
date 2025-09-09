import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-helpline-detail-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Helpline Details</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p>Details here</p>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HelplineDetailModalComponent {}
