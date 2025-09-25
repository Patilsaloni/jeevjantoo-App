import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { CommonModule, Location } from '@angular/common';
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    private toastCtrl: ToastController,
    private location: Location
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAmbulance(id);
    } else {
      this.loading = false;
    }
  }

  goBack() {
    this.location.back();
  }

 async loadAmbulance(id: string) {
  this.loading = true;
  try {
    const doc: any = await this.firebaseService.getDocument('ambulance', id);
    if (doc) {
      this.ambulance = {
        id: doc.id,
        name: doc.name || 'Unknown',
        contact: doc.contact || 'N/A',
        vehicle_number: doc.vehicleNumber || 'N/A',
        governing_body: doc.govtBody || 'N/A',
        area: doc.area || 'N/A',
        lat: doc.lat,
        lng: doc.lng,
        remarks: doc.remarks || '',
      };
    } else {
      this.ambulance = null;
      const t = await this.toastCtrl.create({
        message: 'Ambulance not found or unavailable.',
        duration: 2000, color: 'warning'
      });
      t.present();
    }
  } catch (err: any) {
    if (err.code === 'permission-denied') {
      const t = await this.toastCtrl.create({
        message: 'This ambulance is not available to view.',
        duration: 2000, color: 'warning'
      });
      t.present();
    } else {
      console.error('Error loading ambulance:', err);
    }
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

    if (
      this.platform.is('hybrid') ||
      this.platform.is('ios') ||
      this.platform.is('android')
    ) {
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
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      '_blank'
    );
  }

  saveAmbulance(ambulance: Ambulance) {
    console.log('Ambulance saved/shared:', ambulance);
    alert('Saved/Shared successfully!');
  }

  async reportIssue() {
    const alert = await this.alertCtrl.create({
      header: 'Report Ambulance',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Enter reason for reporting',
        },
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
              position: 'bottom',
            });
            toast.present();
          },
        },
      ],
    });
    await alert.present();
  }
}
