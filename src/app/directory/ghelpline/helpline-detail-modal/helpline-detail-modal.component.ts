import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-helpline-detail-modal',
  templateUrl: './helpline-detail-modal.component.html',
  styleUrls: ['./helpline-detail-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HelplineDetailModalComponent {
  @Input() helpline: any;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  callNumber(phone: string) {
    window.open(`tel:${phone}`, '_system');
  }
}
