import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, Location } from '@angular/common'; // <-- Add this
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule, // <-- Needed for *ngIf, *ngFor, etc.
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // <-- Needed for ion-card-footer etc.
})
export class EventDetailsPage implements OnInit {
  eventId: string | null = null;
  event: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private location: Location
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (this.eventId) this.loadEvent(this.eventId);
  }

  goBack() {
    this.location.back();
  }

 async loadEvent(id: string) {
  this.loading = true;
  try {
    const ev = await this.firebaseService.getDocument('events', id);
    this.event = ev ?? null;
    if (!this.event) {
      const t = await this.toastCtrl.create({
        message: 'Event not found or unavailable.',
        duration: 2000, color: 'warning'
      });
      t.present();
    }
  } catch (err: any) {
    if (err.code === 'permission-denied') {
      const t = await this.toastCtrl.create({
        message: 'This event is not available to view.',
        duration: 2000, color: 'warning'
      });
      t.present();
    } else {
      console.error('Error loading event:', err);
    }
    this.event = null;
  } finally {
    this.loading = false;
  }
}


  callOrganizer() {
    if (this.event?.contactPerson)
      window.open(`tel:${this.event.contactPerson}`, '_system');
    else alert('Contact not available');
  }

  openWhatsApp() {
    if (this.event?.contactPerson) {
      const phone = this.event.contactPerson.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_blank');
    } else alert('WhatsApp not available');
  }

  openMap() {
    if (this.event?.lat && this.event?.lng) {
      const mapUrl = `https://www.google.com/maps?q=${this.event.lat},${this.event.lng}`;
      window.open(mapUrl, '_blank');
    } else alert('Location not available');
  }

  saveEvent() {
    alert('Saved to favorites');
  }

  shareEvent() {
    if (navigator.share) {
      navigator
        .share({
          title: this.event.name,
          text: `Check out this event : ${this.event.name} in ${this.event.city}`,
          url: window.location.href,
        })
        .catch((err) => console.error('Error sharing', err));
    } else {
      alert('Sharing not supported on this device');
    }
  }

  async reportEvent() {
    const alert = await this.alertCtrl.create({
      header: 'Report Event',
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

  convertTo12HourFormat(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h}:${minutes} ${ampm}`;
  }
}
