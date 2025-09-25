import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule, Location } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-ngos-details',
  templateUrl: './ngos-details.page.html',
  styleUrls: ['./ngos-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgosDetailsPage implements OnInit {
  ngo: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private location: Location,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) await this.loadNGO(id);
  }

  goBack() {
    this.location.back();
  }

 async loadNGO(id: string) {
  this.loading = true;
  try {
    const doc = await this.firebaseService.getDocument('ngos', id);
    this.ngo = doc ?? null;
    if (!this.ngo) {
      const t = await this.toastCtrl.create({
        message: 'NGO not found or unavailable.',
        duration: 2000, color: 'warning'
      });
      t.present();
    }
  } catch (err: any) {
    if (err.code === 'permission-denied') {
      const t = await this.toastCtrl.create({
        message: 'This NGO is not available to view.',
        duration: 2000, color: 'warning'
      });
      t.present();
    } else {
      console.error('Error loading NGO:', err);
    }
    this.ngo = null;
  } finally {
    this.loading = false;
  }
}


  callNGO() {
    if (this.ngo?.contact) {
      window.open(`tel:${this.ngo.contact}`, '_system');
    } else {
      alert('Contact not available');
    }
  }

  openWhatsApp() {
    if (this.ngo?.contact) {
      const phone = this.ngo.contact.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_blank');
    } else {
      alert('WhatsApp not available');
    }
  }

  openMap() {
    if (this.ngo?.lat && this.ngo?.lng) {
      const url = `https://www.google.com/maps?q=${this.ngo.lat},${this.ngo.lng}`;
      window.open(url, '_blank');
    } else {
      alert('Location not available');
    }
  }

  saveNGO() {
    // later integrate Firebase/local storage
    alert('Saved to favorites');
  }

  shareNGO() {
    if (navigator.share && this.ngo) {
      navigator.share({
        title: this.ngo.name,
        text: `Check out ${this.ngo.name}`,
        url: window.location.href,
      });
    } else {
      alert('Share not supported on this device');
    }
  }

  async reportNGO() {
    const alert = await this.alertCtrl.create({
      header: 'Report NGO',
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
            console.log(`Report submitted for ${this.ngo.name}:`, data.reason);
            const toast = await this.toastCtrl.create({
              message: 'Report submitted successfully!',
              duration: 1500,
              color: 'warning',
              position: 'bottom',
            });
            await toast.present();
          },
        },
      ],
    });
    await alert.present();
  }
}
