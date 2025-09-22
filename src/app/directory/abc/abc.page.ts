// import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { IonicModule } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FirebaseService } from 'src/app/services/firebase.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-abc',
//   templateUrl: './abc.page.html',
//   styleUrls: ['./abc.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA]
// })
// export class AbcPage implements OnInit {
//   abcs: any[] = [];
//   filteredAbcs: any[] = [];
//   loading = true;

//   cities: string[] = [];
//   types: string[] = [];
//   cityFilter: string = '';
//   typeFilter: string = '';
//   searchTerm: string = '';

//   constructor(private firebaseService: FirebaseService, private router: Router) {}

//   ngOnInit() {
//     this.loadAbcs();
//   }

//   async loadAbcs() {
//     this.loading = true;
//     try {
//       this.abcs = await this.firebaseService.getInformation('abcs');
//       this.filteredAbcs = [...this.abcs];

//         const variants = ['a', 'b', 'c', 'd', 'e'];
//       this.abcs.forEach((abc, idx) => {
//         abc.expanded = false;
//         abc.variant = variants[idx % variants.length];
//       });
//       this.filteredAbcs = [...this.abcs];

//       this.cities = Array.from(new Set(this.abcs.map(a => a.city).filter(c => c)));
//       this.types = Array.from(new Set(this.abcs.map(a => a.type).filter(t => t)));

//     } catch (error) {
//       console.error('Error loading ABCs:', error);
//       this.abcs = [];
//       this.filteredAbcs = [];
//     } finally {
//       this.loading = false;
//     }
//   }

//   filterAbcs(event: any) {
//     this.searchTerm = event?.target?.value?.toLowerCase() || '';
//     this.applyFilters();
//   }

//   filterBySelect() {
//     this.applyFilters();
//   }

//   applyFilters() {
//     this.filteredAbcs = this.abcs.filter(a => {
//       const matchesSearch =
//         a.location?.toLowerCase().includes(this.searchTerm) ||
//         a.type?.toLowerCase().includes(this.searchTerm) ||
//         a.personIncharge?.toLowerCase().includes(this.searchTerm);

//       const matchesCity = this.cityFilter ? a.city === this.cityFilter : true;
//       const matchesType = this.typeFilter ? a.type === this.typeFilter : true;

//       return matchesSearch && matchesCity && matchesType;
//     });
//   }

//   // Navigate to ABC Details page
//  viewDetails(abc: any) {
//   this.router.navigate([`/tabs/directory/abc/${abc.id}`]);
// }

//   // Open Google Maps using location string or coordinates
//   openMap(location: string, lat?: number, lng?: number) {
//     if (lat != null && lng != null) {
//       window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
//     } else if (location) {
//       window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
//     } else {
//       alert('Location not available');
//     }
//   }
// }

import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

@Component({
  selector: 'app-abc',
  templateUrl: './abc.page.html',
  styleUrls: ['./abc.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AbcPage implements OnInit {
  abcs: any[] = [];
  filteredAbcs: any[] = [];
  loading = true;
  searchTerm: string = '';
  filters = {
    state: '',
    city: '',
  };
  states: string[] = [];
  cities: string[] = [];
  citiesByState: { [key: string]: string[] } = {};

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadAbcs();
  }

  async loadAbcs() {
    this.loading = true;
    try {
      this.abcs = await this.firebaseService.getInformation('abcs');
      const variants = ['a', 'b', 'c', 'd', 'e'];
<<<<<<< HEAD
      this.abcs.forEach((abc, idx) => {
        abc.expanded = false;
        abc.variant = variants[idx % variants.length];
        abc.title = abc.type; // Set title for search (matches accordion header)
      });
      this.filteredAbcs = [...this.abcs];

<<<<<<< HEAD
      // Populate states and citiesByState
      this.states = Array.from(
        new Set(this.abcs.map((a) => a.state).filter((s) => s))
      ).sort();
      this.updateCitiesByState();
      this.updateCities();
      console.log('Loaded ABCs:', this.abcs);
      console.log('States:', this.states);
=======

        const variants = ['a', 'b', 'c', 'd', 'e'];
=======
>>>>>>> d24e032 (filter and search in directory)
      this.abcs.forEach((abc, idx) => {
        abc.expanded = false;
        abc.variant = variants[idx % variants.length];
        abc.title = abc.type; // Set title for search (matches accordion header)
      });
      this.filteredAbcs = [...this.abcs];

<<<<<<< HEAD
      
      this.cities = Array.from(new Set(this.abcs.map(a => a.city).filter(c => c)));
      this.types = Array.from(new Set(this.abcs.map(a => a.type).filter(t => t)));

>>>>>>> 325d64b (done)
=======
      // Populate states and citiesByState
      this.states = Array.from(
        new Set(this.abcs.map((a) => a.state).filter((s) => s))
      ).sort();
      this.updateCitiesByState();
      this.updateCities();
      console.log('Loaded ABCs:', this.abcs);
      console.log('States:', this.states);
>>>>>>> d24e032 (filter and search in directory)
    } catch (error) {
      console.error('Error loading ABCs:', error);
      this.abcs = [];
      this.filteredAbcs = [];
    } finally {
      this.loading = false;
    }
  }

  filterAbcs(event: any) {
    this.searchTerm = event?.target?.value?.toLowerCase() || '';
    this.applyFilters();
  }

  applyFilters() {
    this.filteredAbcs = this.abcs.filter((a) => {
      const matchesSearch =
        this.searchTerm === '' ||
        a.title?.toLowerCase().includes(this.searchTerm) ||
        a.location?.toLowerCase().includes(this.searchTerm) ||
        a.personIncharge?.toLowerCase().includes(this.searchTerm);

      const matchesState = this.filters.state
        ? a.state === this.filters.state
        : true;
      const matchesCity = this.filters.city
        ? a.city === this.filters.city
        : true;

      return matchesSearch && matchesState && matchesCity;
    });
    console.log('Filtered ABCs:', this.filteredAbcs);
  }

  updateCitiesByState() {
    this.citiesByState = {};
    this.states.forEach((state) => {
      this.citiesByState[state] = Array.from(
        new Set(
          this.abcs
            .filter((a) => a.state === state && a.city)
            .map((a) => a.city)
        )
      ).sort();
    });
  }

  updateCities() {
    if (this.filters.state) {
      this.cities = this.citiesByState[this.filters.state] || [];
      if (this.filters.city && !this.cities.includes(this.filters.city)) {
        this.filters.city = '';
      }
    } else {
      this.cities = Array.from(
        new Set(this.abcs.map((a) => a.city).filter((c) => c))
      ).sort();
    }
    console.log('Cities for state', this.filters.state, ':', this.cities);
  }

  async openFilterModal() {
    this.updateCitiesByState();
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: 'filter-popup-modal',
      componentProps: {
        filters: { ...this.filters },
        filterType: 'abc',
        filterConfig: [
          {
            key: 'state',
            label: 'State',
            type: 'dropdown',
            options: this.states,
          },
          {
            key: 'city',
            label: 'City',
            type: 'dropdown',
            options: this.citiesByState,
            dependsOn: 'state',
          },
        ],
      },
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.filters = { ...data };
        this.updateCities();
        this.applyFilters();
      }
    });

    await modal.present();
  }

  viewDetails(abc: any) {
    this.router.navigate([`/tabs/directory/abc/${abc.id}`]);
  }

  openMap(location: string, lat?: number, lng?: number) {
    if (lat != null && lng != null) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        '_blank'
      );
    } else if (location) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          location
        )}`,
        '_blank'
      );
    } else {
      alert('Location not available');
    }
  }
}
