import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController, ToastController } from '@ionic/angular';

interface Ambulance {
  id: string;
  name: string;
  contact: string;
  vehicle_number: string;
  governing_body: string;
  area: string;
  lat?: number;
  lng?: number;
  remarks?: string;
}

@Component({
  selector: 'app-ambulance-details',
  templateUrl: './ambulance-details.page.html',
  styleUrls: ['./ambulance-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AmbulanceDetailsPage implements OnInit {
  ambulance: Ambulance | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    private platform: Platform,
     private alertCtrl: AlertController,
  private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAmbulance(id);
    } else {
      this.loading = false;
    }
  }

  async loadAmbulance(id: string) {
    this.loading = true;
    try {
      const data: any[] = await this.firebaseService.getInformation('ambulance');
      const amb: any = data.find(a => a.id === id);

      if (amb) {
        this.ambulance = {
          id: amb.id,
          name: amb.name || 'Unknown',
          contact: amb.contact || 'N/A',
          vehicle_number: amb.vehicleNumber || 'N/A',
          governing_body: amb.govtBody || 'N/A',
          area: amb.area || 'N/A',
          lat: amb.lat,
          lng: amb.lng,
          remarks: amb.remarks || ''
        };
      } else {
        this.ambulance = null;
      }
    } catch (err) {
      console.error('Error loading ambulance:', err);
      this.ambulance = null;
    } finally {
      this.loading = false;
    }
  }

  callAmbulance(contact: string) {
    if (!contact) {
      alert('Contact not available');
      return;
    }

    if (this.platform.is('hybrid') || this.platform.is('ios') || this.platform.is('android')) {
      window.open(`tel:${contact}`, '_system');
    } else {
      alert(`Call feature only available on mobile. Number: ${contact}`);
    }
  }

  openMap(lat?: number, lng?: number) {
    if (lat == null || lng == null) {
      alert('Location not available');
      return;
    }
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  }

  saveAmbulance(ambulance: Ambulance) {
    console.log('Ambulance saved/shared:', ambulance);
    alert('Saved/Shared successfully!');
  }

  async reportIssue() {
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
