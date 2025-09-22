// import { Component, OnInit } from '@angular/core';
// import { IonicModule, ModalController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { FirebaseService } from 'src/app/services/firebase.service';
// import { HelplineDetailModalComponent } from '../ghelpline/ghelpline-details/ghelpline-details.page';

// // ✅ Define interface for helpline
// interface GovtHelpline {
//   id: string;
//   helplineServices: string; // Service name
//   contact: string;
//   govtBody: string;
//   remarks?: string;
//   status: string;
//   state?: string;
//   city?: string;
//   pincode?: string;
//   timeFrom?: string;
//   timeTo?: string;
//   expanded?: boolean;
//   variant?: string;
// }

// @Component({
//   selector: 'app-ghelpline',
//   templateUrl: './ghelpline.page.html',
//   styleUrls: ['./ghelpline.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule]
// })
// export class GhelplinePage implements OnInit {
//   helplines: GovtHelpline[] = [];
//   loading = true;
//   searchTerm = '';
//   selectedCity = '';
//   selectedService = '';

//   constructor(
//     private firebaseService: FirebaseService,
//     private modalCtrl: ModalController
//   ) {}

//   ngOnInit() {
//     this.loadHelplines();
//   }

//   async loadHelplines() {
//     this.loading = true;
//     try {
//       // ✅ Fetch all government helplines from Firestore
//       const res = await this.firebaseService.getInformation('government-helpline');
//   const helplinesData: GovtHelpline[] = res.map((h: any, index: number) => ({
//         ...h,
//         expanded: false,
//         variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
//       })) as GovtHelpline[];
//       // const helplinesData: GovtHelpline[] = res as GovtHelpline[];

//       // ✅ Filter based on status, city, service, search term
//       this.helplines = helplinesData
//         .filter(h => h.status?.toLowerCase() === 'active')
//         .filter(h => !this.selectedCity || (h.city && h.city.toLowerCase() === this.selectedCity.toLowerCase()))
//         .filter(h => !this.selectedService || h.helplineServices.toLowerCase().includes(this.selectedService.toLowerCase()))
//         .filter(h => !this.searchTerm || h.helplineServices.toLowerCase().includes(this.searchTerm.toLowerCase()));

//     } catch (err) {
//       console.error('Failed to load government helplines:', err);
//       this.helplines = [];
//     } finally {
//       this.loading = false;
//     }
//   }

//   // ✅ Open helpline detail modal
//   async openDetails(helpline: GovtHelpline) {
//     const modal = await this.modalCtrl.create({
//       component: HelplineDetailModalComponent,
//       componentProps: { helpline }
//     });
//     await modal.present();
//   }
// }



import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

// ✅ Define interface for helpline
interface GovtHelpline {
  id: string;
  helplineServices: string; // Service name
  contact: string;
  govtBody: string;
  remarks?: string;
  status: string;
  state?: string;
  city?: string;
  pincode?: string;
  timeFrom?: string;
  timeTo?: string;
  expanded?: boolean;
  variant?: string;
}

@Component({
  selector: 'app-ghelpline',
  templateUrl: './ghelpline.page.html',
  styleUrls: ['./ghelpline.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GhelplinePage implements OnInit {
  helplines: GovtHelpline[] = [];
  filteredHelplines: GovtHelpline[] = [];
  loading = true;
  searchTerm = '';
  filters = { state: '', city: '' };
  states: string[] = [];
  citiesByState: { [key: string]: string[] } = {};

  constructor(
    private firebaseService: FirebaseService,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadHelplines();
  }

  async loadHelplines() {
    this.loading = true;
    try {
      const res = await this.firebaseService.getInformation('government-helpline');
      console.log('Raw Firebase Data:', res); // Debug: Log raw data
      this.helplines = res
        .filter((h: any) => h.status?.toLowerCase() === 'active')
        .map((h: any, index: number) => {
          const helpline = {
            id: h.id || 'unknown-' + index,
            helplineServices: String(h.helplineServices || 'Unknown'),
            contact: h.contact != null ? String(h.contact) : 'N/A', // Convert contact to string
            govtBody: String(h.govtBody || 'N/A'),
            remarks: h.remarks != null ? String(h.remarks) : undefined,
            status: String(h.status || 'inactive'),
            state: h.state != null ? String(h.state) : 'N/A',
            city: h.city != null ? String(h.city) : 'N/A',
            pincode: h.pincode != null ? String(h.pincode) : undefined,
            timeFrom: h.timeFrom != null ? String(h.timeFrom) : undefined,
            timeTo: h.timeTo != null ? String(h.timeTo) : undefined,
            expanded: false,
            variant: ['a', 'b', 'c', 'd', 'e'][index % 5],
          };
          console.log('Processed Helpline:', helpline); // Debug: Log each processed helpline
          return helpline;
        });
      this.filteredHelplines = [...this.helplines];
      this.states = Array.from(
        new Set(this.helplines.map(h => h.state).filter((s): s is string => s != null && s !== 'N/A'))
      ).sort();
      this.citiesByState = this.helplines.reduce((acc, h) => {
        if (h.state && h.state !== 'N/A' && h.city && h.city !== 'N/A') {
          acc[h.state] = acc[h.state] || [];
          if (!acc[h.state].includes(h.city)) acc[h.state].push(h.city);
          acc[h.state].sort();
        }
        return acc;
      }, {} as { [key: string]: string[] });
      console.log('Loaded Helplines:', this.helplines);
      console.log('States:', this.states);
      console.log('Cities by State:', this.citiesByState);
      this.applyFilters();
    } catch (err) {
      console.error('Failed to load government helplines:', err);
      this.helplines = [];
      this.filteredHelplines = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  filterHelplines(event: any) {
    this.searchTerm = (event?.target?.value || '').toLowerCase().trim();
    console.log('Search Term:', this.searchTerm); // Debug: Log search term
    this.applyFilters();
  }

  applyFilters() {
    this.filteredHelplines = this.helplines.filter((h) => {
      const searchTerm = this.searchTerm || '';
      const helplineServices = (h.helplineServices || '').toLowerCase();
      const contact = (h.contact || '').toLowerCase();
      const matchesSearch = searchTerm
        ? helplineServices.includes(searchTerm) || contact.includes(searchTerm)
        : true;
      const matchesState = this.filters.state ? h.state === this.filters.state : true;
      const matchesCity = this.filters.city ? h.city === this.filters.city : true;
      console.log('Helpline:', h.id, 'helplineServices:', h.helplineServices, 'contact:', h.contact, 'Matches Search:', matchesSearch, 'Search Term:', searchTerm); // Debug: Log filter details
      return matchesSearch && matchesState && matchesCity;
    });
    console.log('Filtered Helplines Length:', this.filteredHelplines.length, 'Filtered Helplines:', this.filteredHelplines); // Debug: Log filtered results
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterModalComponent,
      cssClass: 'filter-popup-modal',
      componentProps: {
        filters: { ...this.filters },
        filterType: 'ghelpline',
        filterConfig: [
          { key: 'state', label: 'State', type: 'dropdown', options: this.states },
          { key: 'city', label: 'City', type: 'dropdown', options: this.citiesByState, dependsOn: 'state' }
        ]
      }
    });
    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.filters = { ...data };
        console.log('Updated Filters:', this.filters); // Debug: Log filters
        this.applyFilters();
      }
    });
    await modal.present();
  }

  call(contact: string) {
    if (contact && contact !== 'N/A') {
      window.open(`tel:${contact}`, '_system');
    } else {
      console.log('No valid contact number provided');
    }
  }
}