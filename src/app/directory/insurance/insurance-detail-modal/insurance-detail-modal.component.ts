import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-insurance-detail-modal',
  templateUrl: './insurance-detail-modal.component.html',
  styleUrls: ['./insurance-detail-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class InsuranceDetailModal {
  @Input() insurance: any;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  // 📞 Call helpline
  callInsurance(contact: string) {
    window.open(`tel:${contact}`, '_system');
  }

  // 📍 Open location in Google Maps
  openMap(lat: number, lng: number) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_system');
  }
}