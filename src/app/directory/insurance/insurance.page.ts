// import { Component, OnInit } from '@angular/core';
// import { FirebaseService } from '../../services/firebase.service';
// import { IonicModule, ModalController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { InsuranceDetailsPage  } from '../insurance/insurance-details/insurance-details.page';

// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// @Component({
//   selector: 'app-insurance',
//   templateUrl: './insurance.page.html',
//   styleUrls: ['./insurance.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA]

// })
// export class InsurancePage implements OnInit {
//   insurances: any[] = [];
//   filteredInsurances: any[] = [];
//   loading = true;
// expanded?: boolean;
//   variant?: string;
//   filters = {
//     q: '',
//     city: ''
//   };

//   constructor(
//     private firebaseService: FirebaseService,
//     private modalCtrl: ModalController
//   ) {}

//   async ngOnInit() {
//     await this.loadInsurances();
//   }

//   async loadInsurances() {
//     this.loading = true;
//     try {
//       // this.insurances = await this.firebaseService.getInformation('medical-insurance');
//        this.insurances = (await this.firebaseService.getInformation('medical-insurance')).map((ins: any, index: number) => ({
//         ...ins,
//         expanded: false,
//         variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
//       }));
//       this.applyFilters();
//     } catch (err) {
//       console.error('Error fetching insurance:', err);
//       this.insurances = [];
//       this.filteredInsurances = [];
//     } finally {
//       this.loading = false;
//     }
//   }

//   applyFilters() {
//     this.filteredInsurances = this.insurances.filter(ins => {
//       const matchQuery = this.filters.q
//         ? ins.providerName?.toLowerCase().includes(this.filters.q.toLowerCase())
//         : true;

//       const matchCity = this.filters.city
//         ? ins.city?.toLowerCase().includes(this.filters.city.toLowerCase())
//         : true;

//       return matchQuery && matchCity;
//     });
//   }

//   async openDetail(item: any) {
//     const modal = await this.modalCtrl.create({
//       component: InsuranceDetailsPage ,
//       componentProps: { insurance: item }
//     });
//     await modal.present();
//   }
//   // Add this method inside the InsurancePage class
// openWebsite(url: string) {
//   if (url) {
//     window.open(url, '_blank'); // opens in a new browser tab
//   }
// }

// }



import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InsuranceDetailsPage } from '../insurance/insurance-details/insurance-details.page';
import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

interface Insurance {
  id: string;
  providerName: string;
  coverage: string;
  remarks?: string;
  website: string;
  contact: string;
  city?: string;
  expanded?: boolean;
  variant?: string;
}

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.page.html',
  styleUrls: ['./insurance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InsurancePage implements OnInit {
  insurances: Insurance[] = [];
  filteredInsurances: Insurance[] = [];
  loading = true;
  searchTerm = '';
  filters = { coverage: '', city: '' };
  coverages: string[] = [];
  cities: string[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadInsurances();
  }

  async loadInsurances() {
    this.loading = true;
    try {
      const res = await this.firebaseService.getInformation('medical-insurance');
      this.insurances = res.map((ins: any, index: number) => ({
        id: ins.id,
        providerName: ins.providerName || 'Unknown',
        coverage: ins.coverage || 'N/A',
        remarks: ins.remarks,
        website: ins.website || 'N/A',
        contact: ins.contact || 'N/A',
        city: ins.city || 'N/A',
        expanded: false,
        variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
      }));
      this.filteredInsurances = [...this.insurances];
      this.coverages = Array.from(new Set(this.insurances.map(i => i.coverage).filter(c => c && c !== 'N/A'))).sort();
      // this.cities = Array.from(new Set(this.insurances.map(i => i.city).filter(c => c && c !== 'N/A'))).sort();
      console.log('Loaded Insurances:', this.insurances);
      console.log('Coverages:', this.coverages);
      console.log('Cities:', this.cities);
    } catch (err) {
      console.error('Error fetching insurance:', err);
      this.insurances = [];
      this.filteredInsurances = [];
    } finally {
      this.loading = false;
    }
  }

  filterInsurances(event: any) {
    this.searchTerm = event?.target?.value?.toLowerCase() || '';
    this.applyFilters();
  }

  applyFilters() {
    this.filteredInsurances = this.insurances.filter(ins => {
      const matchesSearch =
        this.searchTerm === '' ||
        ins.providerName?.toLowerCase().includes(this.searchTerm) ||
        ins.coverage?.toLowerCase().includes(this.searchTerm) ||
        ins.contact?.toLowerCase().includes(this.searchTerm);
      const matchesCoverage = this.filters.coverage ? ins.coverage === this.filters.coverage : true;
      const matchesCity = this.filters.city ? ins.city === this.filters.city : true;
      return matchesSearch && matchesCoverage && matchesCity;
    });
    console.log('Filtered Insurances:', this.filteredInsurances);
  }

  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterModalComponent,
      cssClass: 'filter-popup-modal',
      componentProps: {
        filters: { ...this.filters },
        filterType: 'insurance',
        filterConfig: [
          { key: 'coverage', label: 'Coverage', type: 'dropdown', options: this.coverages },
          { key: 'city', label: 'City', type: 'dropdown', options: this.cities }
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

  async openDetail(item: Insurance) {
    const modal = await this.modalCtrl.create({
      component: InsuranceDetailsPage,
      componentProps: { insurance: item }
    });
    await modal.present();
  }

  openWebsite(url: string) {
    if (url && url !== 'N/A') {
      window.open(url, '_blank');
    }
  }
}