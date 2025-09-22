// // import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// // import { IonicModule } from '@ionic/angular';
// // import { CommonModule } from '@angular/common';
// // import { FirebaseService } from 'src/app/services/firebase.service';
// // import { GoogleMapsModule } from '@angular/google-maps';
// // import { Router } from '@angular/router'; // <-- Import Router

// // @Component({
// //   selector: 'app-events',
// //   templateUrl: './events.page.html',
// //   styleUrls: ['./events.page.scss'],
// //   standalone: true,
// //   imports: [IonicModule, CommonModule, GoogleMapsModule],
// //   schemas: [CUSTOM_ELEMENTS_SCHEMA]
// // })
// // export class EventsPage implements OnInit {
// //   events: any[] = [];
// //   filteredEvents: any[] = [];
// //   loading = true;
// //   isMapView = false;

// //   defaultLat = 22.7196;
// //   defaultLng = 75.8577;

// //   constructor(
// //     private firebaseService: FirebaseService,
// //     private router: Router // <-- Inject Router
// //   ) {}

// //   ngOnInit() {
// //     this.loadEvents();
// //   }

// //   async loadEvents() {
// //     this.loading = true;
// //     try {
// //       this.events = await this.firebaseService.getInformation('events');

// //       this.events.forEach((ev,index) => {
// //         const lat = parseFloat(ev.lat);
// //         const lng = parseFloat(ev.lng);
// //         ev.hasLocation = !isNaN(lat) && !isNaN(lng);
// //         ev.lat = lat;
// //         ev.lng = lng;
// //          ev.expanded = false;
// //         ev.variant = ['a', 'b', 'c', 'd', 'e'][index % 5];
// //       });

// //       this.filteredEvents = this.events;
// //     } catch (error) {
// //       console.error('Error loading events:', error);
// //       this.events = [];
// //       this.filteredEvents = [];
// //     } finally {
// //       this.loading = false;
// //     }
// //   }

// //   toggleMap() {
// //     this.isMapView = !this.isMapView;
// //   }

// //   filterEvents(event?: any) {
// //     const search = event?.target?.value?.toLowerCase() || '';
// //     this.filteredEvents = this.events.filter(ev =>
// //       ev.name?.toLowerCase().includes(search) ||
// //       ev.place?.toLowerCase().includes(search)
// //     );
// //   }

// //   openMap(ev: any) {
// //     if (ev.hasLocation) {
// //       const mapUrl = `https://www.google.com/maps?q=${ev.lat},${ev.lng}`;
// //       window.open(mapUrl, '_blank');
// //     } else {
// //       alert('Location not available for this event');
// //     }
// //   }

// //   viewDetails(ev: any) {
// //   if(ev.id) {
// //     // Include `/tabs` since EventsPage is inside Tabs
// //     this.router.navigate([`/tabs/directory/events/${ev.id}`]);
// //   } else {
// //     alert('Event ID not available!');
// //   }
// // }


// //   convertTo12HourFormat(time: string): string {
// //     if (!time) return '';
// //     const [hours, minutes] = time.split(':');
// //     let h = parseInt(hours, 10);
// //     const ampm = h >= 12 ? 'PM' : 'AM';
// //     if (h > 12) h -= 12;
// //     if (h === 0) h = 12;
// //     return `${h}:${minutes} ${ampm}`;
// //   }
// // }



// import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { IonicModule, ModalController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { FirebaseService } from 'src/app/services/firebase.service';
// import { GoogleMapsModule } from '@angular/google-maps';
// import { Router } from '@angular/router';
// import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

// interface Event {
//   id: string;
//   name: string;
//   place: string;
//   area: string;
//   contactPerson: string;
//   timeFrom: string;
//   timeTo: string;
//   lat: number;
//   lng: number;
//   hasLocation: boolean;
//   expanded?: boolean;
//   variant?: string;
// }

// @Component({
//   selector: 'app-events',
//   templateUrl: './events.page.html',
//   styleUrls: ['./events.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule, GoogleMapsModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA]
// })
// export class EventsPage implements OnInit {
//   events: Event[] = [];
//   filteredEvents: Event[] = [];
//   loading = true;
//   searchTerm: string = '';
//   filters = { area: '' };
//   areas: string[] = [];
//   isMapView = false;
//   defaultLat = 22.7196;
//   defaultLng = 75.8577;

//   constructor(
//     private firebaseService: FirebaseService,
//     private router: Router,
//     private modalController: ModalController
//   ) {}

//   ngOnInit() {
//     this.loadEvents();
//   }

//   async loadEvents() {
//     this.loading = true;
//     try {
//       const res = await this.firebaseService.getInformation('events');
//       this.events = res.map((ev: any, index: number) => ({
//         id: ev.id,
//         name: ev.name || 'Unknown',
//         place: ev.place || 'N/A',
//         area: ev.area || 'N/A',
//         contactPerson: ev.contactPerson || 'N/A',
//         timeFrom: ev.timeFrom || 'N/A',
//         timeTo: ev.timeTo || 'N/A',
//         lat: parseFloat(ev.lat) || 0,
//         lng: parseFloat(ev.lng) || 0,
//         hasLocation: !isNaN(parseFloat(ev.lat)) && !isNaN(parseFloat(ev.lng)),
//         expanded: false,
//         variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
//       }));
//       this.filteredEvents = [...this.events];
//       this.areas = Array.from(new Set(this.events.map(e => e.area).filter(a => a))).sort();
//       console.log('Loaded Events:', this.events);
//       console.log('Areas:', this.areas);
//     } catch (error) {
//       console.error('Error loading events:', error);
//       this.events = [];
//       this.filteredEvents = [];
//     } finally {
//       this.loading = false;
//     }
//   }

//   toggleMap() {
//     this.isMapView = !this.isMapView;
//   }

//   filterEvents(event: any) {
//     this.searchTerm = event?.target?.value?.toLowerCase() || '';
//     this.applyFilters();
//   }

//   applyFilters() {
//     this.filteredEvents = this.events.filter(e => {
//       const matchesSearch =
//         this.searchTerm === '' ||
//         e.name?.toLowerCase().includes(this.searchTerm) ||
//         e.place?.toLowerCase().includes(this.searchTerm) ||
//         e.area?.toLowerCase().includes(this.searchTerm);
//       const matchesArea = this.filters.area ? e.area === this.filters.area : true;
//       return matchesSearch && matchesArea;
//     });
//     console.log('Filtered Events:', this.filteredEvents);
//   }

//   async openFilterModal() {
//     const modal = await this.modalController.create({
//       component: FilterModalComponent,
//       cssClass: 'filter-popup-modal',
//       componentProps: {
//         filters: { ...this.filters },
//         filterType: 'events',
//         filterConfig: [
//           { key: 'area', label: 'Area', type: 'dropdown', options: this.areas }
//         ]
//       }
//     });
//     modal.onDidDismiss().then(({ data }) => {
//       if (data) {
//         this.filters = { ...data };
//         this.applyFilters();
//       }
//     });
//     await modal.present();
//   }

//   openMap(ev: Event) {
//     if (ev.hasLocation) {
//       const mapUrl = `https://www.google.com/maps?q=${ev.lat},${ev.lng}`;
//       window.open(mapUrl, '_blank');
//     } else {
//       alert('Location not available for this event');
//     }
//   }

//   viewDetails(ev: Event) {
//     if (ev.id) {
//       this.router.navigate([`/tabs/directory/events/${ev.id}`]);
//     } else {
//       alert('Event ID not available!');
//     }
//   }

//   convertTo12HourFormat(time: string): string {
//     if (!time) return '';
//     const [hours, minutes] = time.split(':');
//     let h = parseInt(hours, 10);
//     const ampm = h >= 12 ? 'PM' : 'AM';
//     if (h > 12) h -= 12;
//     if (h === 0) h = 12;
//     return `${h}:${minutes} ${ampm}`;
//   }
// }


import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router } from '@angular/router';
import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

interface Event {
  id: string;
  name: string;
  place: string;
  area: string;
  contactPerson: string;
  timeFrom: string;
  timeTo: string;
  lat: number;
  lng: number;
  hasLocation: boolean;
  expanded?: boolean;
  variant?: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, GoogleMapsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventsPage implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = true;
  searchTerm: string = '';
  filters = { area: '', place: '', timing: '' };
  areas: string[] = [];
  places: string[] = [];
  timings: string[] = [];
  isMapView = false;
  defaultLat = 22.7196;
  defaultLng = 75.8577;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {
    this.loading = true;
    try {
      const res = await this.firebaseService.getInformation('events');
      this.events = res.map((ev: any, index: number) => ({
        id: ev.id,
        name: ev.name || 'Unknown',
        place: ev.place || 'N/A',
        area: ev.area || 'N/A',
        contactPerson: ev.contactPerson || 'N/A',
        timeFrom: ev.timeFrom || 'N/A',
        timeTo: ev.timeTo || 'N/A',
        lat: parseFloat(ev.lat) || 0,
        lng: parseFloat(ev.lng) || 0,
        hasLocation: !isNaN(parseFloat(ev.lat)) && !isNaN(parseFloat(ev.lng)),
        expanded: false,
        variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
      }));
      this.filteredEvents = [...this.events];
      this.areas = Array.from(new Set(this.events.map(e => e.area).filter(a => a))).sort();
      this.places = Array.from(new Set(this.events.map(e => e.place).filter(p => p))).sort();
      this.timings = Array.from(
        new Set(
          this.events
            .map(e => this.formatTiming(e.timeFrom, e.timeTo))
            .filter(t => t !== 'Timing not available')
        )
      ).sort();
      console.log('Loaded Events:', this.events);
      console.log('Areas:', this.areas);
      console.log('Places:', this.places);
      console.log('Timings:', this.timings);
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

  filterEvents(event: any) {
    this.searchTerm = event?.target?.value?.toLowerCase().trim() || '';
    this.applyFilters();
  }

  applyFilters() {
    this.filteredEvents = this.events.filter(e => {
      const matchesSearch =
        !this.searchTerm ||
        e.name?.toLowerCase().includes(this.searchTerm) ||
        e.place?.toLowerCase().includes(this.searchTerm) ||
        e.area?.toLowerCase().includes(this.searchTerm) ||
        this.formatTiming(e.timeFrom, e.timeTo).toLowerCase().includes(this.searchTerm);
      const matchesArea = this.filters.area ? e.area === this.filters.area : true;
      const matchesPlace = this.filters.place ? e.place === this.filters.place : true;
      const matchesTiming = this.filters.timing
        ? this.formatTiming(e.timeFrom, e.timeTo) === this.filters.timing
        : true;
      return matchesSearch && matchesArea && matchesPlace && matchesTiming;
    });
    console.log('Filtered Events:', this.filteredEvents);
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: 'filter-popup-modal',
      componentProps: {
        filters: { ...this.filters },
        filterType: 'events',
        filterConfig: [
          { key: 'area', label: 'Area', type: 'dropdown', options: this.areas },
          { key: 'place', label: 'Place', type: 'dropdown', options: this.places },
          { key: 'timing', label: 'Timing', type: 'dropdown', options: this.timings }
        ]
      }
    });
    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.filters = { ...data };
        this.applyFilters();
      }
    });
    await modal.present();
  }

  openMap(ev: Event) {
    if (ev.hasLocation) {
      const mapUrl = `https://www.google.com/maps?q=${ev.lat},${ev.lng}`;
      window.open(mapUrl, '_blank');
    } else {
      alert('Location not available for this event');
    }
  }

  viewDetails(ev: Event) {
    if (ev.id) {
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

  formatTiming(timeFrom: string, timeTo: string) {
    if (!timeFrom || !timeTo || timeFrom === 'N/A' || timeTo === 'N/A') return 'Timing not available';
    return `${this.convertTo12HourFormat(timeFrom)} - ${this.convertTo12HourFormat(timeTo)}`;
  }
}