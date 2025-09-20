// import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { IonicModule } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { FirebaseService } from 'src/app/services/firebase.service';

// interface NGO {
//   id: string;
//   name: string;
//   individual: string;
//   state: string;
//   city: string;
//   pincode: string;
//   contact: string;
//   status: string;
//   lat: number;
//   lng: number;
//   expanded?: boolean;
//   variant?: string;
// }

// @Component({
//   selector: 'app-ngos',
//   templateUrl: './ngos.page.html',
//   styleUrls: ['./ngos.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
// export class NgosPage implements OnInit {
//   ngos: NGO[] = [];
//   loading = true;

//   constructor(
//     private firebaseService: FirebaseService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.loadNGOs();
//   }

//   async loadNGOs() {
//     this.loading = true;
//     try {
//       const res = await this.firebaseService.getInformation('ngos'); // Firestore collection
//       this.ngos = res
//         .filter((ngo: any) => ngo.status?.toLowerCase() === 'active')
//         .map((ngo: any,index: number) => ({
//           id: ngo.id,
//           name: ngo.name || 'Unknown',
//           individual: ngo.individual || 'N/A',
//           state: ngo.state || 'N/A',
//           city: ngo.city || 'N/A',
//           pincode: ngo.pincode || 'N/A',
//           contact: ngo.contact || 'N/A',
//           status: ngo.status || 'Inactive',
//           lat: ngo.lat ?? 0,
//           lng: ngo.lng ?? 0,
//           expanded: false,
//           variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
//         }));
//     } catch (err) {
//       console.error('Failed to load NGOs:', err);
//       this.ngos = [];
//     } finally {
//       this.loading = false;
//     }
//   }

//   trackNGO(ngo: NGO) {
//     if (!ngo.lat || !ngo.lng) {
//       alert('Location not available for this NGO');
//       return;
//     }
//     const query = encodeURIComponent(`${ngo.lat},${ngo.lng}`);
//     window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
//   }

//   viewDetails(ngo: NGO) {
//     this.router.navigate(['/tabs/directory/ngos/${ev.id}']);
//   }
// }


import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

interface NGO {
  id: string;
  name: string;
  individual: string;
  state: string;
  city: string;
  pincode: string;
  contact: string;
  status: string;
  lat: number;
  lng: number;
  expanded?: boolean;
  variant?: string;
}

@Component({
  selector: 'app-ngos',
  templateUrl: './ngos.page.html',
  styleUrls: ['./ngos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NgosPage implements OnInit {
  ngos: NGO[] = [];
  filteredNGOs: NGO[] = [];
  loading = true;
  searchTerm = '';
  filters = { state: '', city: '' };
  states: string[] = [];
  citiesByState: { [key: string]: string[] } = {};

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadNGOs();
  }

  async loadNGOs() {
    this.loading = true;
    try {
      const res = await this.firebaseService.getInformation('ngos');
      this.ngos = res
        .filter((ngo: any) => ngo.status?.toLowerCase() === 'active')
<<<<<<< HEAD
        .map((ngo: any, index: number) => ({
=======
        .map((ngo: any,index: number) => ({
>>>>>>> 325d64b (done)
          id: ngo.id,
          name: ngo.name || 'Unknown',
          individual: ngo.individual || 'N/A',
          state: ngo.state || 'N/A',
          city: ngo.city || 'N/A',
          pincode: ngo.pincode || 'N/A',
          contact: ngo.contact || 'N/A',
          status: ngo.status || 'inactive',
          lat: ngo.lat ?? 0,
          lng: ngo.lng ?? 0,
          expanded: false,
          variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
        }));
      this.filteredNGOs = [...this.ngos];
      this.states = Array.from(new Set(this.ngos.map(n => n.state).filter(s => s && s !== 'N/A'))).sort();
      this.citiesByState = this.ngos.reduce((acc, n) => {
        if (n.state && n.state !== 'N/A' && n.city && n.city !== 'N/A') {
          acc[n.state] = acc[n.state] || [];
          if (!acc[n.state].includes(n.city)) acc[n.state].push(n.city);
          acc[n.state].sort();
        }
        return acc;
      }, {} as { [key: string]: string[] });
      console.log('Loaded NGOs:', this.ngos);
      console.log('States:', this.states);
      console.log('Cities by State:', this.citiesByState);
    } catch (err) {
      console.error('Failed to load NGOs:', err);
      this.ngos = [];
      this.filteredNGOs = [];
    } finally {
      this.loading = false;
    }
  }

  filterNGOs(event: any) {
    this.searchTerm = event?.target?.value?.toLowerCase() || '';
    this.applyFilters();
  }

  applyFilters() {
    this.filteredNGOs = this.ngos.filter(n => {
      const matchesSearch =
        this.searchTerm === '' ||
        n.name?.toLowerCase().includes(this.searchTerm) ||
        n.city?.toLowerCase().includes(this.searchTerm) ||
        n.contact?.toLowerCase().includes(this.searchTerm);
      const matchesState = this.filters.state ? n.state === this.filters.state : true;
      const matchesCity = this.filters.city ? n.city === this.filters.city : true;
      return matchesSearch && matchesState && matchesCity;
    });
    console.log('Filtered NGOs:', this.filteredNGOs);
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: 'filter-popup-modal',
      componentProps: {
        filters: { ...this.filters },
        filterType: 'ngos',
        filterConfig: [
          { key: 'state', label: 'State', type: 'dropdown', options: this.states },
          { key: 'city', label: 'City', type: 'dropdown', options: this.citiesByState, dependsOn: 'state' }
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

  trackNGO(ngo: NGO) {
    if (!ngo.lat || !ngo.lng) {
      alert('Location not available for this NGO');
      return;
    }
    const query = encodeURIComponent(`${ngo.lat},${ngo.lng}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }

  viewDetails(ngo: NGO) {
    this.router.navigate([`/tabs/directory/ngos/${ngo.id}`]);
  }
}