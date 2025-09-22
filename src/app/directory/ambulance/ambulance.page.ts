// // import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// // import { IonicModule } from '@ionic/angular';
// // import { CommonModule } from '@angular/common';
// // import { FirebaseService } from 'src/app/services/firebase.service';
// // import { Router } from '@angular/router';

// // interface Ambulance {
// //   id: string;
// //   name: string;
// //   contact: string;
// //   status: string;
// //   vehicle_number: string;
// //   governing_body: string;
// //   area: string;
// //   lat?: number;
// //   lng?: number;
// //    expanded?: boolean;
// //   variant?: string;
// // }

// // @Component({
// //   selector: 'app-ambulance',
// //   templateUrl: './ambulance.page.html',
// //   styleUrls: ['./ambulance.page.scss'],
// //   standalone: true,
// //   imports: [IonicModule, CommonModule],
// //   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// // })
// // export class AmbulancePage implements OnInit {
// //   ambulances: Ambulance[] = [];
// //   loading = true;

// //   constructor(private firebaseService: FirebaseService, private router: Router) {}

// //   ngOnInit() {
// //     this.loadAmbulances();
// //   }

// //   async loadAmbulances() {
// //     this.loading = true;
// //     try {
// //       // 🔹 Make sure the collection name matches the one in admin
// //       const res = await this.firebaseService.getInformation('ambulance'); 
// //       this.ambulances = res
// //         .filter((amb: any) => amb.status?.toLowerCase() === 'active')
// //         .map((amb: any) => ({
// //           id: amb.id,
// //           name: amb.name || 'Unknown',
// //           contact: amb.contact || 'N/A',
// //           status: amb.status || 'inactive',
// //           vehicle_number: amb.vehicleNumber || 'N/A',
// //           governing_body: amb.govtBody || 'N/A',
// //           area: amb.area || 'N/A',
// //           lat: amb.lat,
// //           lng: amb.lng,
// //             expanded: false,
// //           variant: ['a', 'b', 'c', 'd', 'e'][res.indexOf(amb) % 5]
// //         }));
// //     } catch (err) {
// //       console.error('Failed to load ambulances:', err);
// //       this.ambulances = [];
// //     } finally {
// //       this.loading = false;
// //     }
// //   }

// //   trackAmbulance(amb: Ambulance) {
// //     if (amb.lat == null || amb.lng == null) {
// //       alert('Location not available');
// //       return;
// //     }
// //     const query = `${amb.lat},${amb.lng}`;
// //     window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
// //   }
// //   saveAmbulance(amb: any) {
// //   console.log('Ambulance saved:', amb);
// // }

// // viewDetails(amb: Ambulance) {
// //   this.router.navigate([`/tabs/directory/ambulance/${amb.id}`]);
// // }

// // }



// import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { IonicModule, ModalController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { FirebaseService } from 'src/app/services/firebase.service';
// import { Router } from '@angular/router';
// import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

// interface Ambulance {
//   id: string;
//   name: string;
//   contact: string;
//   status: string;
//   vehicle_number: string;
//   governing_body: string;
//   area: string;
//   lat?: number;
//   lng?: number;
//   expanded?: boolean;
//   variant?: string;
// }

// @Component({
//   selector: 'app-ambulance',
//   templateUrl: './ambulance.page.html',
//   styleUrls: ['./ambulance.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
// export class AmbulancePage implements OnInit {
//   ambulances: Ambulance[] = [];
//   filteredAmbulances: Ambulance[] = [];
//   loading = true;
//   searchTerm: string = '';
//   filters = {
//     area: '',
//     status: ''
//   };
//   areas: string[] = [];
//   statuses: string[] = ['Active', 'Inactive'];

//   constructor(
//     private firebaseService: FirebaseService,
//     private router: Router,
//     private modalController: ModalController
//   ) {}

//   ngOnInit() {
//     this.loadAmbulances();
//   }

//   async loadAmbulances() {
//     this.loading = true;
//     try {
//       const res = await this.firebaseService.getInformation('ambulance');
//       this.ambulances = res
//         .filter((amb: any) => amb.status?.toLowerCase() === 'active')
//         .map((amb: any, idx: number) => ({
//           id: amb.id,
//           name: amb.name || 'Unknown',
//           contact: amb.contact || 'N/A',
//           status: amb.status || 'Inactive',
//           vehicle_number: amb.vehicleNumber || 'N/A',
//           governing_body: amb.govtBody || 'N/A',
//           area: amb.area || 'N/A',
//           lat: amb.lat,
//           lng: amb.lng,
//           expanded: false,
//           variant: ['a', 'b', 'c', 'd', 'e'][idx % 5]
//         }));
//       this.filteredAmbulances = [...this.ambulances];
//       this.areas = Array.from(new Set(this.ambulances.map(a => a.area).filter(a => a))).sort();
//       console.log('Loaded Ambulances:', this.ambulances);
//       console.log('Areas:', this.areas);
//     } catch (err) {
//       console.error('Failed to load ambulances:', err);
//       this.ambulances = [];
//       this.filteredAmbulances = [];
//     } finally {
//       this.loading = false;
//     }
//   }

//   filterAmbulances(event: any) {
//     this.searchTerm = event?.target?.value?.toLowerCase() || '';
//     this.applyFilters();
//   }

//   applyFilters() {
//     this.filteredAmbulances = this.ambulances.filter(a => {
//       const matchesSearch =
//         this.searchTerm === '' ||
//         a.name?.toLowerCase().includes(this.searchTerm) ||
//         a.area?.toLowerCase().includes(this.searchTerm) ||
//         a.governing_body?.toLowerCase().includes(this.searchTerm);

//       const matchesArea = this.filters.area ? a.area === this.filters.area : true;
//       const matchesStatus = this.filters.status ? a.status === this.filters.status : true;

//       return matchesSearch && matchesArea && matchesStatus;
//     });
//     console.log('Filtered Ambulances:', this.filteredAmbulances);
//   }

//   async openFilterModal() {
//     const modal = await this.modalController.create({
//       component: FilterModalComponent,
//       cssClass: 'filter-popup-modal',
//       componentProps: {
//         filters: { ...this.filters },
//         filterType: 'ambulance',
//         filterConfig: [
//           {
//             key: 'area',
//             label: 'Area',
//             type: 'dropdown',
//             options: this.areas
//           },
//           {
//             key: 'status',
//             label: 'Status',
//             type: 'dropdown',
//             options: this.statuses
//           }
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

//   trackAmbulance(amb: Ambulance) {
//     if (amb.lat == null || amb.lng == null) {
//       alert('Location not available');
//       return;
//     }
//     const query = `${amb.lat},${amb.lng}`;
//     window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
//   }

//   saveAmbulance(amb: any) {
//     console.log('Ambulance saved:', amb);
//   }

//   viewDetails(amb: Ambulance) {
//     this.router.navigate([`/tabs/directory/ambulance/${amb.id}`]);
//   }
// }



import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

interface Ambulance {
  id: string;
  name: string;
  contact: string;
  status: string;
  vehicle_number: string;
  governing_body: string;
  area: string;
  lat?: number;
  lng?: number;
<<<<<<< HEAD
<<<<<<< HEAD
  expanded?: boolean;
=======
   expanded?: boolean;
>>>>>>> 325d64b (done)
=======
  expanded?: boolean;
>>>>>>> d24e032 (filter and search in directory)
  variant?: string;
}

@Component({
  selector: 'app-ambulance',
  templateUrl: './ambulance.page.html',
  styleUrls: ['./ambulance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AmbulancePage implements OnInit {
  ambulances: Ambulance[] = [];
  filteredAmbulances: Ambulance[] = [];
  loading = true;
  searchTerm: string = '';
  filters = {
    area: '',
    status: '',
    vehicle_number: '',
    governing_body: ''
  };
  areas: string[] = [];
  statuses: string[] = ['Active', 'Inactive'];
  vehicleNumbers: string[] = [];
  governingBodies: string[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadAmbulances();
  }

  async loadAmbulances() {
    this.loading = true;
    try {
      const res = await this.firebaseService.getInformation('ambulance');
      this.ambulances = res
        .filter((amb: any) => amb.status?.toLowerCase() === 'active')
        .map((amb: any, idx: number) => ({
          id: amb.id,
          name: amb.name || 'Unknown',
          contact: amb.contact || 'N/A',
          status: amb.status || 'Inactive',
          vehicle_number: amb.vehicleNumber || 'N/A',
          governing_body: amb.govtBody || 'N/A',
          area: amb.area || 'N/A',
          lat: amb.lat,
          lng: amb.lng,
<<<<<<< HEAD
<<<<<<< HEAD
          expanded: false,
          variant: ['a', 'b', 'c', 'd', 'e'][idx % 5]
=======
            expanded: false,
          variant: ['a', 'b', 'c', 'd', 'e'][res.indexOf(amb) % 5]
>>>>>>> 325d64b (done)
=======
          expanded: false,
          variant: ['a', 'b', 'c', 'd', 'e'][idx % 5]
>>>>>>> d24e032 (filter and search in directory)
        }));
      this.filteredAmbulances = [...this.ambulances];
      this.areas = Array.from(new Set(this.ambulances.map(a => a.area).filter(a => a))).sort();
      this.vehicleNumbers = Array.from(new Set(this.ambulances.map(a => a.vehicle_number).filter(v => v))).sort();
      this.governingBodies = Array.from(new Set(this.ambulances.map(a => a.governing_body).filter(g => g))).sort();
      console.log('Loaded Ambulances:', this.ambulances);
      console.log('Areas:', this.areas);
      console.log('Vehicle Numbers:', this.vehicleNumbers);
      console.log('Governing Bodies:', this.governingBodies);
    } catch (err) {
      console.error('Failed to load ambulances:', err);
      this.ambulances = [];
      this.filteredAmbulances = [];
    } finally {
      this.loading = false;
    }
  }

  filterAmbulances(event: any) {
    this.searchTerm = event?.target?.value?.toLowerCase().trim() || '';
    this.applyFilters();
  }

  applyFilters() {
    this.filteredAmbulances = this.ambulances.filter(a => {
      const matchesSearch =
        !this.searchTerm ||
        a.name?.toLowerCase().includes(this.searchTerm) ||
        a.area?.toLowerCase().includes(this.searchTerm) ||
        a.governing_body?.toLowerCase().includes(this.searchTerm) ||
        a.vehicle_number?.toLowerCase().includes(this.searchTerm);
      const matchesArea = this.filters.area ? a.area === this.filters.area : true;
      const matchesStatus = this.filters.status ? a.status === this.filters.status : true;
      const matchesVehicle = this.filters.vehicle_number ? a.vehicle_number === this.filters.vehicle_number : true;
      const matchesAuthority = this.filters.governing_body ? a.governing_body === this.filters.governing_body : true;
      return matchesSearch && matchesArea && matchesStatus && matchesVehicle && matchesAuthority;
    });
    console.log('Filtered Ambulances:', this.filteredAmbulances);
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: 'filter-popup-modal',
      componentProps: {
        filters: { ...this.filters },
        filterType: 'ambulance',
        filterConfig: [
          {
            key: 'area',
            label: 'Location',
            type: 'dropdown',
            options: this.areas
          },
          {
            key: 'status',
            label: 'Status',
            type: 'dropdown',
            options: this.statuses
          },
          {
            key: 'vehicle_number',
            label: 'Vehicle',
            type: 'dropdown',
            options: this.vehicleNumbers
          },
          {
            key: 'governing_body',
            label: 'Authority',
            type: 'dropdown',
            options: this.governingBodies
          }
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

  trackAmbulance(amb: Ambulance) {
    if (amb.lat == null || amb.lng == null) {
      alert('Location not available');
      return;
    }
    const query = `${amb.lat},${amb.lng}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }

  saveAmbulance(amb: any) {
    console.log('Ambulance saved:', amb);
  }

  viewDetails(amb: Ambulance) {
    this.router.navigate([`/tabs/directory/ambulance/${amb.id}`]);
  }
}