import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-clinics-details',
  templateUrl: './clinics-details.page.html',
  styleUrls: ['./clinics-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClinicsDetailsPage implements OnInit {
  clinic: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadClinic(id);
    }
  }

  async loadClinic(id: string) {
    this.loading = true;
    try {
      const clinics = await this.firebaseService.getInformation('veterinaryClinic');
      this.clinic = clinics.find((c: any) => c.id === id);
    } catch (err) {
      console.error('Error loading clinic:', err);
      this.clinic = null;
    } finally {
      this.loading = false;
    }
  }

  formatTiming(timeFrom: string, timeTo: string) {
    if (!timeFrom || !timeTo) return 'Timing not available';
    return `${timeFrom} - ${timeTo}`;
  }

  openMap() {
    if (this.clinic?.lat && this.clinic?.lng) {
      const url = `https://www.google.com/maps?q=${this.clinic.lat},${this.clinic.lng}`;
      window.open(url, '_blank');
    } else {
      alert('Location not available for this clinic');
    }
  }

  callClinic() {
    if (this.clinic?.contact) {
      window.open(`tel:${this.clinic.contact}`, '_system');
    } else {
      alert('Contact not available');
    }
  }

  openWhatsApp() {
    if (this.clinic?.contact) {
      const phone = this.clinic.contact.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_blank');
    } else {
      alert('WhatsApp not available');
    }
  }

  async saveClinic() {
    // Implement saving logic here (e.g., localStorage or Firebase)
    const toast = await this.toastCtrl.create({
      message: 'Clinic saved successfully!',
      duration: 1500,
      color: 'success',
      position: 'bottom'
    });
    toast.present();
  }

  shareClinic() {
    if (navigator.share) {
      navigator.share({
        title: this.clinic.name,
        text: `Check out this clinic: ${this.clinic.name} in ${this.clinic.city}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing', err));
    } else {
      alert('Sharing not supported on this device');
    }
  }

  async reportClinic() {
    const alert = await this.alertCtrl.create({
      header: 'Report Clinic',
      inputs: [
        { name: 'reason', type: 'text', placeholder: 'Enter reason for reporting' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { 
          text: 'Submit', 
          handler: async (data) => {
            console.log('Report submitted:', data.reason);
            const toast = await this.toastCtrl.create({
              message: 'Report submitted successfully!',
              duration: 1500,
              color: 'warning',
              position: 'bottom'
            });
            toast.present();
          }
        }
      ]
    });
    await alert.present();
  }
}
