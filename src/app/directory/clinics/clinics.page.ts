<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d24e032 (filter and search in directory)
// // import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// // import { IonicModule, AlertController } from '@ionic/angular';
// // import { CommonModule } from '@angular/common';
// // import { FirebaseService } from 'src/app/services/firebase.service';
// // import { Router } from '@angular/router';
// // import { RouterModule } from '@angular/router';

// // @Component({
// //   selector: 'app-clinics',
// //   templateUrl: './clinics.page.html',
// //   styleUrls: ['./clinics.page.scss'],
// //   standalone: true,
// //   imports: [IonicModule, CommonModule],
// //   schemas: [CUSTOM_ELEMENTS_SCHEMA]
// // })
// // export class ClinicsPage implements OnInit {
// //   clinics: any[] = [];
// //   loading = true;

// //   constructor(
// //     private firebaseService: FirebaseService,
// //     private alertCtrl: AlertController,
// //     private router: Router
// //   ) {}

// //   ngOnInit() {
// //     this.loadClinics();
// //   }

// //   async loadClinics() {
// //     this.loading = true;
// //     try {
// //       this.clinics = await this.firebaseService.getInformation('veterinaryClinic');
// //       // Assign variants for background; cycle or use type for demo
// //       const variants = ['a', 'b', 'c', 'd', 'e'];
// //       this.clinics.forEach((clinic, idx) => {
// //         clinic.expanded = false;
// //         clinic.variant = variants[idx % variants.length];
// //       });
// //     } catch (error) {
// //       console.error('Error loading clinics', error);
// //     } finally {
// //       this.loading = false;
// //     }
// //   }

// //   openMap(clinic: any) {
// //     if (clinic.lat && clinic.lng) {
// //       window.open(`https://www.google.com/maps?q=${clinic.lat},${clinic.lng}`, '_blank');
// //     } else {
// //       alert('Location not available for this clinic');
// //     }
// //   }

// //   formatTiming(timeFrom: string, timeTo: string) {
// //     if (!timeFrom || !timeTo) { return 'Timing not available'; }
// //     return `${timeFrom} - ${timeTo}`;
// //   }

// //   viewDetails(clinic: any) {
// //     this.router.navigate(['tabs/directory/clinics', clinic.id]);
// //   }
// // }


<<<<<<< HEAD
// import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { IonicModule, ModalController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { FirebaseService } from 'src/app/services/firebase.service';
// import { Router } from '@angular/router';
// import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

// interface Clinic {
//   id: string;
//   name: string;
//   type: string;
//   area: string;
//   pincode: string;
//   contact: string;
//   timeFrom: string;
//   timeTo: string;
//   remarks?: string;
//   lat?: number;
//   lng?: number;
//   status?: string;
//   expanded?: boolean;
//   variant?: string;
// }
=======
=======
>>>>>>> d24e032 (filter and search in directory)
// import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { IonicModule, ModalController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { FirebaseService } from 'src/app/services/firebase.service';
// import { Router } from '@angular/router';
// import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

<<<<<<< HEAD
>>>>>>> 325d64b (done)
=======
// interface Clinic {
//   id: string;
//   name: string;
//   type: string;
//   area: string;
//   pincode: string;
//   contact: string;
//   timeFrom: string;
//   timeTo: string;
//   remarks?: string;
//   lat?: number;
//   lng?: number;
//   status?: string;
//   expanded?: boolean;
//   variant?: string;
// }
>>>>>>> d24e032 (filter and search in directory)

// @Component({
//   selector: 'app-clinics',
//   templateUrl: './clinics.page.html',
//   styleUrls: ['./clinics.page.scss'],
//   standalone: true,
<<<<<<< HEAD
<<<<<<< HEAD
//   imports: [IonicModule, CommonModule, FormsModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA]
// })
// export class ClinicsPage implements OnInit {
//   clinics: Clinic[] = [];
//   filteredClinics: Clinic[] = [];
//   loading = true;
//   searchTerm: string = '';
//   filters = { city: '', type: '' };
//   cities: string[] = [];
//   types: string[] = [];

//   constructor(
//     private firebaseService: FirebaseService,
//     private router: Router,
//     private modalController: ModalController
//   ) {}
=======
//   imports: [IonicModule, CommonModule],
=======
//   imports: [IonicModule, CommonModule, FormsModule],
>>>>>>> d24e032 (filter and search in directory)
//   schemas: [CUSTOM_ELEMENTS_SCHEMA]
// })
// export class ClinicsPage implements OnInit {
//   clinics: Clinic[] = [];
//   filteredClinics: Clinic[] = [];
//   loading = true;
//   searchTerm: string = '';
//   filters = { city: '', type: '' };
//   cities: string[] = [];
//   types: string[] = [];

<<<<<<< HEAD
//  constructor(
//   private firebaseService: FirebaseService,
//   private alertCtrl: AlertController,
//   private router: Router
// ) {}
>>>>>>> 325d64b (done)
=======
//   constructor(
//     private firebaseService: FirebaseService,
//     private router: Router,
//     private modalController: ModalController
//   ) {}
>>>>>>> d24e032 (filter and search in directory)

//   ngOnInit() {
//     this.loadClinics();
//   }

//   async loadClinics() {
//     this.loading = true;
//     try {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d24e032 (filter and search in directory)
//       const res = await this.firebaseService.getInformation('veterinaryClinic');
//       this.clinics = res.map((c: any, index: number) => ({
//         id: c.id,
//         name: c.name || 'Unknown',
//         type: c.type || 'N/A',
//         area: c.area || 'N/A',
//         pincode: c.pincode || 'N/A',
//         contact: c.contact || 'N/A',
//         timeFrom: c.timeFrom || 'N/A',
//         timeTo: c.timeTo || 'N/A',
//         remarks: c.remarks,
//         lat: c.lat ? parseFloat(c.lat) : undefined,
//         lng: c.lng ? parseFloat(c.lng) : undefined,
//         status: c.status || 'inactive',
//         expanded: false,
//         variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
//       }));
//       this.filteredClinics = [...this.clinics];
//       // this.cities = Array.from(new Set(this.clinics.map(c => c.city).filter(c => c))).sort();
//       this.types = Array.from(new Set(this.clinics.map(c => c.type).filter(t => t))).sort();
//       console.log('Loaded Clinics:', this.clinics);
//       console.log('Cities:', this.cities);
//       console.log('Types:', this.types);
<<<<<<< HEAD
//     } catch (error) {
//       console.error('Error loading clinics:', error);
//       this.clinics = [];
//       this.filteredClinics = [];
=======
//       this.clinics = await this.firebaseService.getInformation('veterinaryClinic');
      
//       this.clinics.forEach(clinic => {
//         const lat = parseFloat(clinic.lat);
//         const lng = parseFloat(clinic.lng);
//         clinic.hasLocation = !isNaN(lat) && !isNaN(lng);
//         clinic.lat = lat;
//         clinic.lng = lng;
//       });

//     } catch (error) {
//       console.error('Error loading clinics:', error);
//       this.clinics = [];
>>>>>>> 325d64b (done)
=======
//     } catch (error) {
//       console.error('Error loading clinics:', error);
//       this.clinics = [];
//       this.filteredClinics = [];
>>>>>>> d24e032 (filter and search in directory)
//     } finally {
//       this.loading = false;
//     }
//   }

<<<<<<< HEAD
<<<<<<< HEAD
//   filterClinics(event: any) {
//     this.searchTerm = event?.target?.value?.toLowerCase() || '';
//     this.applyFilters();
//   }

//   applyFilters() {
//     this.filteredClinics = this.clinics.filter(c => {
//       const matchesSearch =
//         this.searchTerm === '' ||
//         c.name?.toLowerCase().includes(this.searchTerm) ||
//         c.area?.toLowerCase().includes(this.searchTerm) ||
//         c.type?.toLowerCase().includes(this.searchTerm);
//       // const matchesCity = this.filters.city ? c.city === this.filters.city : true;
//       const matchesType = this.filters.type ? c.type === this.filters.type : true;
//       // return matchesSearch && matchesCity && matchesType;
//     });
//     console.log('Filtered Clinics:', this.filteredClinics);
//   }

//   async openFilterModal() {
//     const modal = await this.modalController.create({
//       component: FilterModalComponent,
//       cssClass: 'filter-popup-modal',
//       componentProps: {
//         filters: { ...this.filters },
//         filterType: 'clinics',
//         filterConfig: [
//           { key: 'city', label: 'City', type: 'dropdown', options: this.cities },
//           { key: 'type', label: 'Type', type: 'dropdown', options: this.types }
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

//   formatTiming(timeFrom: string, timeTo: string) {
//     if (!timeFrom || !timeTo) return 'Timing not available';
//     return `${timeFrom} - ${timeTo}`;
//   }

//   openMap(clinic: Clinic) {
//     if (clinic.lat && clinic.lng) {
=======
//   openMap(clinic: any) {
//     if (clinic.hasLocation) {
>>>>>>> 325d64b (done)
//       const mapUrl = `https://www.google.com/maps?q=${clinic.lat},${clinic.lng}`;
//       window.open(mapUrl, '_blank');
//     } else {
//       alert('Location not available for this clinic');
//     }
//   }

<<<<<<< HEAD
//   viewDetails(clinic: Clinic) {
//     this.router.navigate([`/tabs/directory/clinics/${clinic.id}`]);
//   }
=======
//   async openAddClinicPrompt() {
//     const alert = await this.alertCtrl.create({
//       header: 'Add New Clinic',
//       inputs: [
//         { name: 'name', type: 'text', placeholder: 'Clinic Name' },
//         { name: 'type', type: 'text', placeholder: 'Type' },
//         { name: 'city', type: 'text', placeholder: 'City' },
//         { name: 'state', type: 'text', placeholder: 'State' },
//         { name: 'area', type: 'text', placeholder: 'Area' },
//         { name: 'pincode', type: 'text', placeholder: 'Pincode' },
//         { name: 'contact', type: 'text', placeholder: 'Contact' },
//         { name: 'timeFrom', type: 'text', placeholder: 'From Time' },
//         { name: 'timeTo', type: 'text', placeholder: 'To Time' },
//         { name: 'lat', type: 'text', placeholder: 'Latitude' },
//         { name: 'lng', type: 'text', placeholder: 'Longitude' },
//         { name: 'remarks', type: 'text', placeholder: 'Remarks (Optional)' },
//       ],
//       buttons: [
//         { text: 'Cancel', role: 'cancel' },
//         {
//           text: 'Add',
//           handler: (data) => this.addClinic(data)
//         }
//       ]
=======
//   filterClinics(event: any) {
//     this.searchTerm = event?.target?.value?.toLowerCase() || '';
//     this.applyFilters();
//   }

//   applyFilters() {
//     this.filteredClinics = this.clinics.filter(c => {
//       const matchesSearch =
//         this.searchTerm === '' ||
//         c.name?.toLowerCase().includes(this.searchTerm) ||
//         c.area?.toLowerCase().includes(this.searchTerm) ||
//         c.type?.toLowerCase().includes(this.searchTerm);
//       // const matchesCity = this.filters.city ? c.city === this.filters.city : true;
//       const matchesType = this.filters.type ? c.type === this.filters.type : true;
//       // return matchesSearch && matchesCity && matchesType;
>>>>>>> d24e032 (filter and search in directory)
//     });
//     console.log('Filtered Clinics:', this.filteredClinics);
//   }

//   async openFilterModal() {
//     const modal = await this.modalController.create({
//       component: FilterModalComponent,
//       cssClass: 'filter-popup-modal',
//       componentProps: {
//         filters: { ...this.filters },
//         filterType: 'clinics',
//         filterConfig: [
//           { key: 'city', label: 'City', type: 'dropdown', options: this.cities },
//           { key: 'type', label: 'Type', type: 'dropdown', options: this.types }
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

//   formatTiming(timeFrom: string, timeTo: string) {
//     if (!timeFrom || !timeTo) return 'Timing not available';
//     return `${timeFrom} - ${timeTo}`;
//   }

<<<<<<< HEAD
//   viewDetails(clinic: any) {
//   this.router.navigate([`/tabs/directory/clinics/${clinic.id}`]);
// }
>>>>>>> 325d64b (done)
=======
//   openMap(clinic: Clinic) {
//     if (clinic.lat && clinic.lng) {
//       const mapUrl = `https://www.google.com/maps?q=${clinic.lat},${clinic.lng}`;
//       window.open(mapUrl, '_blank');
//     } else {
//       alert('Location not available for this clinic');
//     }
//   }

//   viewDetails(clinic: Clinic) {
//     this.router.navigate([`/tabs/directory/clinics/${clinic.id}`]);
//   }
>>>>>>> d24e032 (filter and search in directory)
// }


import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d24e032 (filter and search in directory)
import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

interface Clinic {
  id: string;
  name: string;
  type: string;
  area: string;
  pincode: string;
  contact: string;
  timeFrom: string;
  timeTo: string;
  remarks?: string;
  lat?: number;
  lng?: number;
  status?: string;
  expanded?: boolean;
  variant?: string;
}
<<<<<<< HEAD
=======
import { RouterModule } from '@angular/router';
>>>>>>> 325d64b (done)
=======
>>>>>>> d24e032 (filter and search in directory)

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.page.html',
  styleUrls: ['./clinics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClinicsPage implements OnInit {
  clinics: Clinic[] = [];
  filteredClinics: Clinic[] = [];
  loading = true;
  searchTerm: string = '';
  filters = { city: '', type: '', area: '', timing: '' };
  cities: string[] = [];
  types: string[] = [];
  areas: string[] = [];
  timings: string[] = [];

  constructor(
    private firebaseService: FirebaseService,
<<<<<<< HEAD
<<<<<<< HEAD
    private router: Router,
    private modalController: ModalController
=======
    private alertCtrl: AlertController,
    private router: Router
>>>>>>> 325d64b (done)
=======
    private router: Router,
    private modalController: ModalController
>>>>>>> d24e032 (filter and search in directory)
  ) {}

  ngOnInit() {
    this.loadClinics();
  }

  async loadClinics() {
    this.loading = true;
    try {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d24e032 (filter and search in directory)
      const res = await this.firebaseService.getInformation('veterinaryClinic');
      this.clinics = res.map((c: any, index: number) => ({
        id: c.id,
        name: c.name || 'Unknown',
        type: c.type || 'N/A',
        area: c.area || 'N/A',
        pincode: c.pincode || 'N/A',
        contact: c.contact || 'N/A',
        timeFrom: c.timeFrom || 'N/A',
        timeTo: c.timeTo || 'N/A',
        remarks: c.remarks,
        lat: c.lat ? parseFloat(c.lat) : undefined,
        lng: c.lng ? parseFloat(c.lng) : undefined,
        status: c.status || 'inactive',
        expanded: false,
        variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
      }));
      this.filteredClinics = [...this.clinics];
      // this.cities = Array.from(new Set(this.clinics.map(c => c.city).filter(c => c))).sort();
      this.types = Array.from(new Set(this.clinics.map(c => c.type).filter(t => t))).sort();
      this.areas = Array.from(new Set(this.clinics.map(c => c.area).filter(a => a))).sort();
      this.timings = Array.from(
        new Set(
          this.clinics
            .map(c => this.formatTiming(c.timeFrom, c.timeTo))
            .filter(t => t !== 'Timing not available')
        )
      ).sort();
      console.log('Loaded Clinics:', this.clinics);
      console.log('Cities:', this.cities);
      console.log('Types:', this.types);
      console.log('Areas:', this.areas);
      console.log('Timings:', this.timings);
<<<<<<< HEAD
    } catch (error) {
      console.error('Error loading clinics:', error);
      this.clinics = [];
      this.filteredClinics = [];
=======
      this.clinics = await this.firebaseService.getInformation('veterinaryClinic');
      // Assign variants for background; cycle or use type for demo
      const variants = ['a', 'b', 'c', 'd', 'e'];
      this.clinics.forEach((clinic, idx) => {
        clinic.expanded = false;
        clinic.variant = variants[idx % variants.length];
      });
    } catch (error) {
      console.error('Error loading clinics', error);
>>>>>>> 325d64b (done)
=======
    } catch (error) {
      console.error('Error loading clinics:', error);
      this.clinics = [];
      this.filteredClinics = [];
>>>>>>> d24e032 (filter and search in directory)
    } finally {
      this.loading = false;
    }
  }

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d24e032 (filter and search in directory)
  filterClinics(event: any) {
    this.searchTerm = event?.target?.value?.toLowerCase().trim() || '';
    this.applyFilters();
  }

  applyFilters() {
    this.filteredClinics = this.clinics.filter(c => {
      const matchesSearch =
        !this.searchTerm ||
        c.name?.toLowerCase().includes(this.searchTerm) ||
        c.area?.toLowerCase().includes(this.searchTerm) ||
        c.type?.toLowerCase().includes(this.searchTerm);
      const matchesType = this.filters.type ? c.type === this.filters.type : true;
      const matchesArea = this.filters.area ? c.area === this.filters.area : true;
      const matchesTiming = this.filters.timing
        ? this.formatTiming(c.timeFrom, c.timeTo) === this.filters.timing
        : true;
      return matchesSearch && matchesType && matchesArea && matchesTiming;
    });
    console.log('Filtered Clinics:', this.filteredClinics);
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: 'filter-popup-modal',
      componentProps: {
        filters: { ...this.filters },
        filterType: 'clinics',
        filterConfig: [
          // { key: 'city', label: 'City', type: 'dropdown', options: this.cities },
          { key: 'type', label: 'Type', type: 'dropdown', options: this.types },
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

  openMap(clinic: Clinic) {
<<<<<<< HEAD
    if (clinic.lat && clinic.lng) {
      const mapUrl = `https://www.google.com/maps?q=${clinic.lat},${clinic.lng}`;
      window.open(mapUrl, '_blank');
=======
  openMap(clinic: any) {
    if (clinic.lat && clinic.lng) {
      window.open(`https://www.google.com/maps?q=${clinic.lat},${clinic.lng}`, '_blank');
>>>>>>> 325d64b (done)
=======
    if (clinic.lat && clinic.lng) {
      const mapUrl = `https://www.google.com/maps?q=${clinic.lat},${clinic.lng}`;
      window.open(mapUrl, '_blank');
>>>>>>> d24e032 (filter and search in directory)
    } else {
      alert('Location not available for this clinic');
    }
  }

<<<<<<< HEAD
<<<<<<< HEAD
  viewDetails(clinic: Clinic) {
    this.router.navigate([`/tabs/directory/clinics/${clinic.id}`]);
  }
}
=======
  formatTiming(timeFrom: string, timeTo: string) {
    if (!timeFrom || !timeTo) { return 'Timing not available'; }
    return `${timeFrom} - ${timeTo}`;
  }

  viewDetails(clinic: any) {
    this.router.navigate(['tabs/directory/clinics', clinic.id]);
  }
}
>>>>>>> 325d64b (done)
=======
  viewDetails(clinic: Clinic) {
    this.router.navigate([`/tabs/directory/clinics/${clinic.id}`]);
  }
}
>>>>>>> d24e032 (filter and search in directory)
