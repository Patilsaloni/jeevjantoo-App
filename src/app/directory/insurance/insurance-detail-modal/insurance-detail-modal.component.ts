import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // for *ngIf

@Component({
  selector: 'app-insurance-detail-modal',
  templateUrl: './insurance-detail-modal.component.html',
  standalone: true, // <- required for Angular 15+ standalone component
  imports: [
    IonicModule, // all Ionic components like ion-header, ion-button, ion-card
    CommonModule  // for *ngIf and other common directives
  ]
})
export class InsuranceDetailModal {
  @Input() insurance: any;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  callInsurance(contact: string) {
    window.open(`tel:${contact}`, '_self');
  }

  openWebsite(url: string) {
    window.open(url, '_blank');
  }

  openMap(lat: number, lng: number) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  }

  sharePlan(insurance: any) {
    const text = `Check out this insurance plan: ${insurance.providerName} - ${insurance.planName}`;
    navigator.share ? navigator.share({ text }) : alert(text);
  }

  reportIssue(insurance: any) {
    alert('Report submitted for admin review');
  }
}
  