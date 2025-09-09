import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // <-- Add this
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule // <-- Needed for *ngIf, *ngFor, etc.
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // <-- Needed for ion-card-footer etc.
})
export class EventDetailsPage implements OnInit {
  eventId: string | null = null;
  event: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (this.eventId) this.loadEvent(this.eventId);
  }

  async loadEvent(id: string) {
    this.loading = true;
    try {
      const events = await this.firebaseService.getInformation('events');
      this.event = events.find((ev: any) => ev.id === id);
      if (!this.event) alert('Event not found');
    } catch (err) {
      console.error(err);
      this.event = null;
    } finally {
      this.loading = false;
    }
  }

  callOrganizer() {
    if (this.event?.contactPerson) window.open(`tel:${this.event.contactPerson}`, '_system');
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

  saveEvent() { alert('Saved to favorites'); }
  shareEvent() { alert('Share functionality'); }
  reportEvent() { alert('Reported to admin'); }

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
