import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.page.html',
  styleUrls: ['./clinics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClinicsPage implements OnInit {
  clinics: any[] = [];
  loading = true;

  constructor(
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadClinics();
  }

  async loadClinics() {
    this.loading = true;
    try {
      this.clinics = await this.firebaseService.getInformation('veterinaryClinic');
      
      this.clinics.forEach(clinic => {
        const lat = parseFloat(clinic.lat);
        const lng = parseFloat(clinic.lng);
        clinic.hasLocation = !isNaN(lat) && !isNaN(lng);
        clinic.lat = lat;
        clinic.lng = lng;
      });

    } catch (error) {
      console.error('Error loading clinics:', error);
      this.clinics = [];
    } finally {
      this.loading = false;
    }
  }

  openMap(clinic: any) {
    if (clinic.hasLocation) {
      const mapUrl = `https://www.google.com/maps?q=${clinic.lat},${clinic.lng}`;
      window.open(mapUrl, '_blank');
    } else {
      alert('Location not available for this clinic');
    }
  }

  async openAddClinicPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Add New Clinic',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Clinic Name' },
        { name: 'type', type: 'text', placeholder: 'Type' },
        { name: 'city', type: 'text', placeholder: 'City' },
        { name: 'state', type: 'text', placeholder: 'State' },
        { name: 'area', type: 'text', placeholder: 'Area' },
        { name: 'pincode', type: 'text', placeholder: 'Pincode' },
        { name: 'contact', type: 'text', placeholder: 'Contact' },
        { name: 'timeFrom', type: 'text', placeholder: 'From Time' },
        { name: 'timeTo', type: 'text', placeholder: 'To Time' },
        { name: 'lat', type: 'text', placeholder: 'Latitude' },
        { name: 'lng', type: 'text', placeholder: 'Longitude' },
        { name: 'remarks', type: 'text', placeholder: 'Remarks (Optional)' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Add',
          handler: (data) => this.addClinic(data)
        }
      ]
    });

    await alert.present();
  }

  async addClinic(data: any) {
    try {
      await this.firebaseService.addInformation(data.name, data, 'veterinaryClinic');
      this.loadClinics(); // Refresh list
    } catch (error) {
      console.error('Error adding clinic:', error);
    }
  }

  formatTiming(timeFrom: string, timeTo: string) {
    if (!timeFrom || !timeTo) return 'Timing not available';
    return `${timeFrom} - ${timeTo}`;
  }
}
