import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router'; // <-- Import Router

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, GoogleMapsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventsPage implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  loading = true;
  isMapView = false;

  defaultLat = 22.7196;
  defaultLng = 75.8577;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router // <-- Inject Router
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {
    this.loading = true;
    try {
      this.events = await this.firebaseService.getInformation('events');

      this.events.forEach((ev,index) => {
        const lat = parseFloat(ev.lat);
        const lng = parseFloat(ev.lng);
        ev.hasLocation = !isNaN(lat) && !isNaN(lng);
        ev.lat = lat;
        ev.lng = lng;
         ev.expanded = false;
        ev.variant = ['a', 'b', 'c', 'd', 'e'][index % 5];
      });

      this.filteredEvents = this.events;
    } catch (error) {
      console.error('Error loading events:', error);
      this.events = [];
      this.filteredEvents = [];
    } finally {
      this.loading = false;
    }
  }

  toggleMap() {
    this.isMapView = !this.isMapView;
  }

  filterEvents(event?: any) {
    const search = event?.target?.value?.toLowerCase() || '';
    this.filteredEvents = this.events.filter(ev =>
      ev.name?.toLowerCase().includes(search) ||
      ev.place?.toLowerCase().includes(search)
    );
  }

  openMap(ev: any) {
    if (ev.hasLocation) {
      const mapUrl = `https://www.google.com/maps?q=${ev.lat},${ev.lng}`;
      window.open(mapUrl, '_blank');
    } else {
      alert('Location not available for this event');
    }
  }

  viewDetails(ev: any) {
  if(ev.id) {
    // Include `/tabs` since EventsPage is inside Tabs
    this.router.navigate([`/tabs/directory/events/${ev.id}`]);
  } else {
    alert('Event ID not available!');
  }
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
