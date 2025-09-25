// import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { IonicModule } from '@ionic/angular';
// import { CommonModule, Location } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { FirebaseService } from 'src/app/services/firebase.service';
// import { AlertController, ToastController } from '@ionic/angular';

// @Component({
//   selector: 'app-abc-details',
//   templateUrl: './abc-details.page.html',
//   styleUrls: ['./abc-details.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
// export class AbcDetailsPage implements OnInit {
//   abcId: string | null = null;
//   abc: any = null;
//   loading = true;

//   constructor(
//     private route: ActivatedRoute,
//     private firebaseService: FirebaseService,
//     private alertCtrl: AlertController,
//     private toastCtrl: ToastController,
//     private location: Location
//   ) {}

//   ngOnInit() {
//     this.abcId = this.route.snapshot.paramMap.get('id');
//     if (this.abcId) this.loadAbc(this.abcId);
//   }

//   goBack() {
//     this.location.back();
//   }

//   async loadAbc(id: string) {
//     this.loading = true;
//     try {
//       const abcs = await this.firebaseService.getInformation('abcs');
//       this.abc = abcs.find((a: any) => a.id === id);

//       if (!this.abc) alert('Record not found');
//     } catch (err) {
//       console.error('Error loading ABC:', err);
//       this.abc = null;
//     } finally {
//       this.loading = false;
//     }
//   }

//   callPerson() {
//     if (this.abc?.contactNumber) {
//       window.open(`tel:${this.abc.contactNumber}`, '_system');
//     } else {
//       alert('Contact not available');
//     }
//   }

//   whatsappPerson() {
//     if (this.abc?.contactNumber) {
//       const phone = this.abc.contactNumber.replace(/\D/g, '');
//       window.open(`https://wa.me/${phone}`, '_blank');
//     } else alert('WhatsApp not available');
//   }

//   openMap() {
//     if (this.abc?.lat && this.abc?.lng) {
//       window.open(
//         `https://www.google.com/maps/search/?api=1&query=${this.abc.lat},${this.abc.lng}`,
//         '_blank'
//       );
//     } else if (this.abc?.location) {
//       window.open(
//         `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//           this.abc.location
//         )}`,
//         '_blank'
//       );
//     } else {
//       alert('Location not available');
//     }
//   }

//   saveRecord() {
//     alert('Saved to favorites');
//   }

//   shareRecord() {
//     if (navigator.share) {
//       navigator
//         .share({
//           title: this.abc.name,
//           text: `Check out this record: ${this.abc.name} in ${this.abc.city}`,
//           url: window.location.href,
//         })
//         .catch((err) => console.error('Error sharing', err));
//     } else {
//       alert('Sharing not supported on this device');
//     }
//   }

//   async report() {
//     const alert = await this.alertCtrl.create({
//       header: 'Report',
//       inputs: [
//         {
//           name: 'reason',
//           type: 'text',
//           placeholder: 'Enter reason for reporting',
//         },
//       ],
//       buttons: [
//         { text: 'Cancel', role: 'cancel' },
//         {
//           text: 'Submit',
//           handler: async (data) => {
//             console.log('Report submitted:', data.reason);
//             const toast = await this.toastCtrl.create({
//               message: 'Report submitted successfully!',
//               duration: 1500,
//               color: 'warning',
//               position: 'bottom',
//             });
//             toast.present();
//           },
//         },
//       ],
//     });
//     await alert.present();
//   }
// }



import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-abc-details',
  templateUrl: './abc-details.page.html',
  styleUrls: ['./abc-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AbcDetailsPage implements OnInit {
  abcId: string | null = null;
  abc: any = null;
  loading = true;
  saved = false;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private location: Location
  ) {}

  ngOnInit() {
    this.abcId = this.route.snapshot.paramMap.get('id');
    if (this.abcId) {
      this.loadAbc(this.abcId);
      this.checkFavorite(this.abcId);
    }
  }

  async checkFavorite(id: string) {
    try {
      this.saved = await this.firebaseService.isFavorite('abc', id);
    } catch (err: any) {
      console.error('Error checking favorite for abcs collection:', err);
      this.saved = false;
      const toast = await this.toastCtrl.create({
        message: 'Unable to check favorite status for this ABC record',
        duration: 1500,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();
    }
  }

  goBack() {
    this.location.back();
  }

 async loadAbc(id: string) {
  this.loading = true;
  try {
    const doc = await this.firebaseService.getDocument('abcs', id);
    this.abc = doc ?? null;
    if (!this.abc) {
      const t = await this.toastCtrl.create({
        message: 'ABC record not found or unavailable.',
        duration: 2000, color: 'warning'
      });
      t.present();
    }
  } catch (err: any) {
    if (err.code === 'permission-denied') {
      const t = await this.toastCtrl.create({
        message: 'This ABC record is not available to view.',
        duration: 2000, color: 'warning'
      });
      t.present();
    } else {
      console.error('Error loading ABC:', err);
    }
    this.abc = null;
  } finally {
    this.loading = false;
  }
}


  callPerson() {
    if (this.abc?.contactNumber) {
      window.open(`tel:${this.abc.contactNumber}`, '_system');
    } else {
      alert('Contact not available');
    }
  }

  whatsappPerson() {
    if (this.abc?.contactNumber) {
      const phone = this.abc.contactNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_blank');
    } else alert('WhatsApp not available');
  }

  openMap() {
    if (this.abc?.lat && this.abc?.lng) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${this.abc.lat},${this.abc.lng}`,
        '_blank'
      );
    } else if (this.abc?.location) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          this.abc.location
        )}`,
        '_blank'
      );
    } else {
      alert('Location not available');
    }
  }

  async saveRecord() {
    if (!this.abc) return;
    try {
      await this.firebaseService.setFavorite('abc', this.abc.id, !this.saved);
      this.saved = !this.saved;
      const message = this.saved ? 'Saved to favorites' : 'Removed from favorites';
      const toast = await this.toastCtrl.create({
        message,
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();
    } catch (err: any) {
      console.error('Error saving favorite for abcs collection:', err);
      let errorMessage = 'Failed to update favorites';
      if (err.message.includes('Pet not found')) {
        errorMessage = 'Cannot save this ABC record as a favorite. Please try again later.';
      }
      const toast = await this.toastCtrl.create({
        message: errorMessage,
        duration: 1500,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }

  shareRecord() {
    if (navigator.share) {
      navigator
        .share({
          title: this.abc.name,
          text: `Check out this record: ${this.abc.name} in ${this.abc.city}`,
          url: window.location.href,
        })
        .catch((err) => console.error('Error sharing', err));
    } else {
      alert('Sharing not supported on this device');
    }
  }

  async report() {
    const alert = await this.alertCtrl.create({
      header: 'Report',
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