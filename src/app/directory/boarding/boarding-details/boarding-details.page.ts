import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController, ToastController } from '@ionic/angular';

interface Boarding {
  id: string;
  name: string;
  contact: string;
  state: string;
  city: string;
  area: string;
  pincode: string;
  timeFrom: string;
  timeTo: string;
  lat?: number;
  lng?: number;
  remarks?: string;
}

@Component({
  selector: 'app-boarding-details',
  templateUrl: './boarding-details.page.html',
  styleUrls: ['./boarding-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})
export class BoardingDetailsPage implements OnInit {
  boarding: Boarding | null = null;
  loading = true;

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
    if (id) this.loadBoarding(id);
    else this.loading = false;
  }

  async loadBoarding(id: string) {
    this.loading = true;
    try {
      const data: any[] = await this.firebaseService.getInformation('boardings');
      const b = data.find(item => item.id === id);

      if (b) {
        this.boarding = {
          id: b.id,
          name: b.name || 'Unknown',
          contact: b.contact || 'N/A',
          state: b.state || 'N/A',
          city: b.city || 'N/A',
          area: b.area || 'N/A',
          pincode: b.pincode || 'N/A',
          timeFrom: b.timeFrom || 'N/A',
          timeTo: b.timeTo || 'N/A',
          lat: b.lat,
          lng: b.lng,
          remarks: b.remarks || ''
        };
      } else {
        this.boarding = null;
      }
    } catch (err) {
      console.error('Error loading boarding:', err);
      this.boarding = null;
    } finally {
      this.loading = false;
    }
  }

  callBoarding(contact: string) {
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
    if (!lat || !lng) {
      alert('Location not available');
      return;
    }
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  }

  saveBoarding(boarding: Boarding) {
    console.log('Saved/Shared:', boarding);
    alert('Saved successfully!');
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
