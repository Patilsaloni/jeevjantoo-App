// // import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// // import { IonicModule } from '@ionic/angular';
// // import { CommonModule } from '@angular/common';
// // import { FirebaseService } from 'src/app/services/firebase.service';
// // import { Router } from '@angular/router';

// // interface Boarding {
// //   id: string;
// //   name: string;
// //   contact: string;
// //   state: string;
// //   city: string;
// //   area: string;
// //   pincode: string;
// //   timeFrom: string;
// //   timeTo: string;
// //   lat: number;
// //   lng: number;
// //   status: string;
// //    expanded?: boolean;
// //   variant?: string;
// // }

// // @Component({
// //   selector: 'app-boarding',
// //   templateUrl: './boarding.page.html',
// //   styleUrls: ['./boarding.page.scss'],
// //   standalone: true,
// //   imports: [IonicModule, CommonModule],
// //   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// // })
// // export class BoardingPage implements OnInit {

// //   boardingSpas: Boarding[] = [];
// //   loading = true;

// //   constructor(private firebaseService: FirebaseService, private router: Router) {}

// //   ngOnInit() {
// //     this.loadBoardings();
// //   }

// //   async loadBoardings() {
// //     this.loading = true;
// //     try {
// //       const res = await this.firebaseService.getInformation('boardings'); // Firestore collection
// //       this.boardingSpas = res
// //         .filter((b: any) => b.status?.toLowerCase() === 'active')
// //         .map((b: any,index: number) => ({
// //           id: b.id,
// //           name: b.name || 'Unknown',
// //           contact: b.contact || 'N/A',
// //           state: b.state || 'N/A',
// //           city: b.city || 'N/A',
// //           area: b.area || 'N/A',
// //           pincode: b.pincode || 'N/A',
// //           timeFrom: b.timeFrom || 'N/A',
// //           timeTo: b.timeTo || 'N/A',
// //           lat: b.lat ?? 0,
// //           lng: b.lng ?? 0,
// //           status: b.status || 'inactive',
// //           expanded: false,
// //           variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
// //         }));
// //     } catch (err) {
// //       console.error('Failed to load boardings:', err);
// //       this.boardingSpas = [];
// //     } finally {
// //       this.loading = false;
// //     }
// //   }

// //   trackLocation(spa: Boarding) {
// //     if (!spa.lat || !spa.lng) {
// //       alert("Location not available");
// //       return;
// //     }
// //     const url = `https://www.google.com/maps/search/?api=1&query=${spa.lat},${spa.lng}`;
// //     window.open(url, "_blank");
// //   }

// //   viewDetails(spa: Boarding) {
// //   this.router.navigate([`/tabs/directory/boarding/${spa.id}`]);
// // }

// // }


// import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { IonicModule, ModalController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { FirebaseService } from 'src/app/services/firebase.service';
// import { Router } from '@angular/router';
// import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

// interface Boarding {
//   id: string;
//   name: string;
//   contact: string;
//   state: string;
//   city: string;
//   area: string;
//   pincode: string;
//   timeFrom: string;
//   timeTo: string;
//   lat: number;
//   lng: number;
//   status: string;
//   expanded?: boolean;
//   variant?: string;
// }

// @Component({
//   selector: 'app-boarding',
//   templateUrl: './boarding.page.html',
//   styleUrls: ['./boarding.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
// export class BoardingPage implements OnInit {
//   boardingSpas: Boarding[] = [];
//   filteredBoardingSpas: Boarding[] = [];
//   loading = true;
//   searchTerm: string = '';
//   filters = { state: '', city: '' };
//   states: string[] = [];
//   citiesByState: { [key: string]: string[] } = {};

//   constructor(
//     private firebaseService: FirebaseService,
//     private router: Router,
//     private modalController: ModalController
//   ) {}

//   ngOnInit() {
//     this.loadBoardings();
//   }

//   async loadBoardings() {
//     this.loading = true;
//     try {
//       const res = await this.firebaseService.getInformation('boardings');
//       this.boardingSpas = res
//         .filter((b: any) => b.status?.toLowerCase() === 'active')
//         .map((b: any, index: number) => ({
//           id: b.id,
//           name: b.name || 'Unknown',
//           contact: b.contact || 'N/A',
//           state: b.state || 'N/A',
//           city: b.city || 'N/A',
//           area: b.area || 'N/A',
//           pincode: b.pincode || 'N/A',
//           timeFrom: b.timeFrom || 'N/A',
//           timeTo: b.timeTo || 'N/A',
//           lat: b.lat ?? 0,
//           lng: b.lng ?? 0,
//           status: b.status || 'inactive',
//           expanded: false,
//           variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
//         }));
//       this.filteredBoardingSpas = [...this.boardingSpas];
//       this.states = Array.from(new Set(this.boardingSpas.map(b => b.state).filter(s => s))).sort();
//       this.citiesByState = this.boardingSpas.reduce((acc, b) => {
//         if (b.state && b.city) {
//           acc[b.state] = acc[b.state] || [];
//           if (!acc[b.state].includes(b.city)) acc[b.state].push(b.city);
//           acc[b.state].sort();
//         }
//         return acc;
//       }, {} as { [key: string]: string[] });
//       console.log('Loaded Boarding Spas:', this.boardingSpas);
//       console.log('States:', this.states);
//       console.log('Cities by State:', this.citiesByState);
//     } catch (err) {
//       console.error('Failed to load boardings:', err);
//       this.boardingSpas = [];
//       this.filteredBoardingSpas = [];
//     } finally {
//       this.loading = false;
//     }
//   }

//   filterBoardings(event: any) {
//     this.searchTerm = event?.target?.value?.toLowerCase() || '';
//     this.applyFilters();
//   }

//   applyFilters() {
//     this.filteredBoardingSpas = this.boardingSpas.filter(b => {
//       const matchesSearch =
//         this.searchTerm === '' ||
//         b.name?.toLowerCase().includes(this.searchTerm) ||
//         b.area?.toLowerCase().includes(this.searchTerm) ||
//         b.contact?.toLowerCase().includes(this.searchTerm);
//       const matchesState = this.filters.state ? b.state === this.filters.state : true;
//       const matchesCity = this.filters.city ? b.city === this.filters.city : true;
//       return matchesSearch && matchesState && matchesCity;
//     });
//     console.log('Filtered Boarding Spas:', this.filteredBoardingSpas);
//   }

//   async openFilterModal() {
//     const modal = await this.modalController.create({
//       component: FilterModalComponent,
//       cssClass: 'filter-popup-modal',
//       componentProps: {
//         filters: { ...this.filters },
//         filterType: 'boarding',
//         filterConfig: [
//           { key: 'state', label: 'State', type: 'dropdown', options: this.states },
//           { key: 'city', label: 'City', type: 'dropdown', options: this.citiesByState, dependsOn: 'state' }
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

//   trackLocation(spa: Boarding) {
//     if (!spa.lat || !spa.lng) {
//       alert('Location not available');
//       return;
//     }
//     const url = `https://www.google.com/maps/search/?api=1&query=${spa.lat},${spa.lng}`;
//     window.open(url, '_blank');
//   }

//   viewDetails(spa: Boarding) {
//     this.router.navigate([`/tabs/directory/boarding/${spa.id}`]);
//   }
// }


import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

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
  lat: number;
  lng: number;
  status: string;
<<<<<<< HEAD
  expanded?: boolean;
=======
   expanded?: boolean;
>>>>>>> 325d64b (done)
  variant?: string;
}

@Component({
  selector: 'app-boarding',
  templateUrl: './boarding.page.html',
  styleUrls: ['./boarding.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BoardingPage implements OnInit {
  boardingSpas: Boarding[] = [];
  filteredBoardingSpas: Boarding[] = [];
  loading = true;
  searchTerm: string = '';
  filters = { state: '', city: '', area: '', timing: '' };
  states: string[] = [];
  citiesByState: { [key: string]: string[] } = {};
  areas: string[] = [];
  timings: string[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadBoardings();
  }

  async loadBoardings() {
    this.loading = true;
    try {
      const res = await this.firebaseService.getInformation('boardings');
      this.boardingSpas = res
        .filter((b: any) => b.status?.toLowerCase() === 'active')
<<<<<<< HEAD
        .map((b: any, index: number) => ({
=======
        .map((b: any,index: number) => ({
>>>>>>> 325d64b (done)
          id: b.id,
          name: b.name || 'Unknown',
          contact: b.contact || 'N/A',
          state: b.state || 'N/A',
          city: b.city || 'N/A',
          area: b.area || 'N/A',
          pincode: b.pincode || 'N/A',
          timeFrom: b.timeFrom || 'N/A',
          timeTo: b.timeTo || 'N/A',
          lat: b.lat ?? 0,
          lng: b.lng ?? 0,
          status: b.status || 'inactive',
          expanded: false,
          variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
        }));
      this.filteredBoardingSpas = [...this.boardingSpas];
      this.states = Array.from(new Set(this.boardingSpas.map(b => b.state).filter(s => s))).sort();
      this.citiesByState = this.boardingSpas.reduce((acc, b) => {
        if (b.state && b.city) {
          acc[b.state] = acc[b.state] || [];
          if (!acc[b.state].includes(b.city)) acc[b.state].push(b.city);
          acc[b.state].sort();
        }
        return acc;
      }, {} as { [key: string]: string[] });
      this.areas = Array.from(new Set(this.boardingSpas.map(b => b.area).filter(a => a))).sort();
      this.timings = Array.from(
        new Set(
          this.boardingSpas
            .map(b => this.formatTiming(b.timeFrom, b.timeTo))
            .filter(t => t !== 'Timing not available')
        )
      ).sort();
      console.log('Loaded Boarding Spas:', this.boardingSpas);
      console.log('States:', this.states);
      console.log('Cities by State:', this.citiesByState);
      console.log('Areas:', this.areas);
      console.log('Timings:', this.timings);
    } catch (err) {
      console.error('Failed to load boardings:', err);
      this.boardingSpas = [];
      this.filteredBoardingSpas = [];
    } finally {
      this.loading = false;
    }
  }

  filterBoardings(event: any) {
    this.searchTerm = event?.target?.value?.toLowerCase().trim() || '';
    this.applyFilters();
  }

  applyFilters() {
    this.filteredBoardingSpas = this.boardingSpas.filter(b => {
      const matchesSearch =
        !this.searchTerm ||
        b.name?.toLowerCase().includes(this.searchTerm) ||
        b.area?.toLowerCase().includes(this.searchTerm) ||
        b.contact?.toLowerCase().includes(this.searchTerm) ||
        this.formatTiming(b.timeFrom, b.timeTo).toLowerCase().includes(this.searchTerm);
      const matchesState = this.filters.state ? b.state === this.filters.state : true;
      const matchesCity = this.filters.city ? b.city === this.filters.city : true;
      const matchesArea = this.filters.area ? b.area === this.filters.area : true;
      const matchesTiming = this.filters.timing
        ? this.formatTiming(b.timeFrom, b.timeTo) === this.filters.timing
        : true;
      return matchesSearch && matchesState && matchesCity && matchesArea && matchesTiming;
    });
    console.log('Filtered Boarding Spas:', this.filteredBoardingSpas);
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: 'filter-popup-modal',
      componentProps: {
        filters: { ...this.filters },
        filterType: 'boarding',
        filterConfig: [
          { key: 'state', label: 'State', type: 'dropdown', options: this.states },
          { key: 'city', label: 'City', type: 'dropdown', options: this.citiesByState, dependsOn: 'state' },
          { key: 'area', label: 'Area', type: 'dropdown', options: this.areas },
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

  formatTiming(timeFrom: string, timeTo: string) {
    if (!timeFrom || !timeTo || timeFrom === 'N/A' || timeTo === 'N/A') return 'Timing not available';
    return `${timeFrom} - ${timeTo}`;
  }

  trackLocation(spa: Boarding) {
    if (!spa.lat || !spa.lng) {
      alert('Location not available');
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${spa.lat},${spa.lng}`;
    window.open(url, '_blank');
  }

  viewDetails(spa: Boarding) {
    this.router.navigate([`/tabs/directory/boarding/${spa.id}`]);
  }
}