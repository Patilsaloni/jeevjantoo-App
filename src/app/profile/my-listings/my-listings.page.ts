// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   IonicModule,
//   LoadingController,
//   ModalController,
// } from '@ionic/angular';
// import { FirebaseService } from '../../services/firebase.service';
// import { Timestamp } from 'firebase/firestore';
// import { Router } from '@angular/router';
// import { EditAdoptionComponent } from './edit-adoption/edit-adoption.component'; // Import the new component (adjust path if needed)
// interface Pet {
//   id: string;
//   petName: string;
//   species: string; // code: dog/cat/bird/fish/rabbit/other
//   gender: 'Male' | 'Female' | 'Unknown';
//   ageYears?: number;
//   ageMonths?: number;
//   ageInMonths: number;
//   breed: string;
//   health?: string | null;
//   temperament?: string | null;
//   location: string;
//   contactName?: string;
//   contactPhone?: string;
//   contactPublic?: boolean;
//   description: string;
//   photos: string[];
//   status: 'Pending' | 'Active' | 'Inactive' | 'Adopted';
//   createdAt: Timestamp;
//   submitterUid: string;
// }

// @Component({
//   selector: 'app-my-listings',
//   templateUrl: './my-listings.page.html',
//   styleUrls: ['./my-listings.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule],
// })
// export class MyListingsPage implements OnInit {
//   pets: Pet[] = [];
//   openedAccordionId: string | null = null;

//   speciesOptions = [
//     { code: 'dog', label: 'Dog 🐶' },
//     { code: 'cat', label: 'Cat 🐱' },
//     { code: 'bird', label: 'Bird 🐦' },
//     { code: 'fish', label: 'Fish 🐟' },
//     { code: 'rabbit', label: 'Rabbit 🐰' },
//     { code: 'other', label: 'Other' },
//   ];

//   constructor(
//     private firebaseService: FirebaseService,
//     private loadingCtrl: LoadingController,
//     private router: Router,
//     private modalCtrl: ModalController
//   ) {}

//   async ngOnInit() {
//     const loading = await this.loadingCtrl.create({
//       message: 'Loading your listings...',
//       spinner: 'crescent',
//     });
//     await loading.present();

//     try {
//       const user = this.firebaseService.getCurrentUser();
//       if (user) {
//         this.pets = await this.firebaseService.getUserPets(user.uid);
//       } else {
//         console.warn('No user logged in');
//         // Optionally redirect to sign-in
//       }
//     } catch (error) {
//       console.error('Error fetching user pets:', error);
//     } finally {
//       await loading.dismiss();
//     }
//   }

//   toggleAccordion(id: string) {
//     this.openedAccordionId = this.openedAccordionId === id ? null : id;
//   }
//   isAccordionOpen(id: string) {
//     return this.openedAccordionId === id;
//   }

//   // editPet(pet: Pet) {
//   //   // Navigate to the edit pet page with pet id as parameter
//   //   this.router.navigate(['/edit-pet', pet.id]);
//   // }

//   async editPet(pet: Pet) {
//   if (!pet || !pet.id) {
//     console.error('Invalid pet data:', pet);
//     return;
//   }
//   console.log('Pet data being passed to modal:', JSON.stringify(pet, null, 2)); // Detailed debug log
//   const modal = await this.modalCtrl.create({
//     component: EditAdoptionComponent,
//     componentProps: { pet },
//   });
//   await modal.present();

//   const { data } = await modal.onDidDismiss();
//   if (data?.updated) {
//     const user = this.firebaseService.getCurrentUser();
//     if (user) {
//       this.pets = await this.firebaseService.getUserPets(user.uid);
//     }
//   }
// }

//   getSpeciesLabel(code: string): string {
//     const option = this.speciesOptions.find((o) => o.code === code);
//     return option ? option.label : code;
//   }

//   getAgeDisplay(pet: Pet): string {
//     const years = pet.ageYears || 0;
//     const months = pet.ageMonths || 0;
//     let display = '';
//     if (years > 0) display += `${years} year${years > 1 ? 's' : ''} `;
//     if (months > 0) display += `${months} month${months > 1 ? 's' : ''}`;
//     return display.trim() || 'Unknown';
//   }
// }




import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';
import { EditAdoptionComponent } from './edit-adoption/edit-adoption.component';
import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component'; 

interface Pet {
  id: string;
  petName: string;
  species: string;
  gender: 'Male' | 'Female' | 'Unknown';
  ageYears?: number;
  ageMonths?: number;
  ageInMonths: number;
  breed: string;
  health?: string | null;
  temperament?: string | null;
  location: string;
  contactName?: string;
  contactPhone?: string;
  contactPublic?: boolean;
  description: string;
  photos: string[];
  status: 'Pending' | 'Active' | 'Inactive' | 'Adopted';
  createdAt: Timestamp;
  submitterUid: string;
}

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.page.html',
  styleUrls: ['./my-listings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MyListingsPage implements OnInit {
  pets: Pet[] = [];
  openedAccordionId: string | null = null;

  // Filter & Search Fields
  searchText: string = '';
  selectedFilter: string = 'All';
  filters: any = {
    species: [],
    gender: [],
    ageRange: [],
    city: '',
    area: '',
    health: [],
    temperament: [],
    status: [],
  };

  speciesOptions = [
    { code: 'dog', label: 'Dog 🐶' },
    { code: 'cat', label: 'Cat 🐱' },
    { code: 'bird', label: 'Bird 🐦' },
    { code: 'fish', label: 'Fish 🐟' },
    { code: 'rabbit', label: 'Rabbit 🐰' },
    { code: 'other', label: 'Other' },
  ];

  constructor(
    private firebaseService: FirebaseService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadPets();
  }

  async loadPets() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading your listings...',
      spinner: 'crescent',
    });
    await loading.present();
    try {
      const user = this.firebaseService.getCurrentUser();
      if (user) {
        this.pets = await this.firebaseService.getUserPets(user.uid);
      } else {
        console.warn('No user logged in');
        // Optionally redirect to sign-in
      }
    } catch (error) {
      console.error('Error fetching user pets:', error);
    } finally {
      await loading.dismiss();
      this.cdr.detectChanges();
    }
  }

  // Accordion
  toggleAccordion(id: string) {
    this.openedAccordionId = this.openedAccordionId === id ? null : id;
  }
  isAccordionOpen(id: string) {
    return this.openedAccordionId === id;
  }

  // Edit modal
  async editPet(pet: Pet) {
    if (!pet || !pet.id) {
      console.error('Invalid pet data:', pet);
      return;
    }
    const modal = await this.modalCtrl.create({
      component: EditAdoptionComponent,
      componentProps: { pet },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.updated) {
      const user = this.firebaseService.getCurrentUser();
      if (user) {
        this.pets = await this.firebaseService.getUserPets(user.uid);
        this.cdr.detectChanges();
      }
    }
  }

  // Search, category chip, and filter advanced
  applyFilter(cat: string) {
    this.selectedFilter = cat;
    this.cdr.detectChanges();
  }

  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterModalComponent,
      componentProps: {
        filterTitle: 'Filter My Listings',
        filters: { ...this.filters },
        filterType: 'my-pets',
        filterConfig: [
          { key: 'species', label: 'Species', type: 'chips', options: this.speciesOptions.map(o => o.code) },
          { key: 'gender', label: 'Gender', type: 'chips', options: ['male', 'female', 'unknown'] },
          { key: 'ageRange', label: 'Age Range', type: 'chips', options: ['0-1', '1-3', '3-7', '7-12', '12+'] },
          { key: 'status', label: 'Status', type: 'chips', options: ['Pending', 'Active', 'Inactive', 'Adopted'] },
          { key: 'city', label: 'City', type: 'text' },
          { key: 'area', label: 'Area', type: 'text' },
        ],
      },
       breakpoints: [0, 0.5, 0.9],
      initialBreakpoint: 0.5,
      cssClass: 'bottom-filter-sheet'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.filters = { ...data };
      this.cdr.detectChanges();
    }
  }

  // Main filtering logic
  get filteredPets(): Pet[] {
    let list = [...this.pets];

    // Category (species chip)
    if (this.selectedFilter && this.selectedFilter !== 'All') {
      const sel = this.selectedFilter.toLowerCase();
      list = list.filter(p => p.species.toLowerCase() === sel);
    }

    // Advanced Filters
    if (this.filters.species && this.filters.species.length)
      list = list.filter(p => this.filters.species.includes(p.species.toLowerCase()));
    if (this.filters.gender && this.filters.gender.length)
      list = list.filter(p => this.filters.gender.includes((p.gender || '').toLowerCase()));
    if (this.filters.status && this.filters.status.length)
      list = list.filter(p => this.filters.status.includes(p.status));
    // Age range (supports "0-1" = up to 1 year, etc)
    if (this.filters.ageRange && this.filters.ageRange.length) {
      list = list.filter(p => {
        const years = p.ageYears || Math.floor((p.ageInMonths || 0) / 12);
        return this.filters.ageRange.some((range: string) => {
          if (range === '0-1') return years >= 0 && years < 1;
          if (range === '1-3') return years >= 1 && years < 3;
          if (range === '3-7') return years >= 3 && years < 7;
          if (range === '7-12') return years >= 7 && years < 12;
          if (range === '12+') return years >= 12;
          return false;
        });
      });
    }
    if (this.filters.city && this.filters.city.trim())
      list = list.filter(p => p.location?.toLowerCase().includes(this.filters.city.trim().toLowerCase()));
    if (this.filters.area && this.filters.area.trim())
      list = list.filter(p => (p.location || '').toLowerCase().includes(this.filters.area.trim().toLowerCase()));

    // Search Bar
    const q = this.searchText.trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        (p.petName && p.petName.toLowerCase().includes(q)) ||
        (p.species && p.species.toLowerCase().includes(q)) ||
        (p.breed && p.breed.toLowerCase().includes(q)) ||
        (p.gender && p.gender.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return list;
  }

  getSpeciesLabel(code: string): string {
    const option = this.speciesOptions.find((o) => o.code === code);
    return option ? option.label : code;
  }

  getAgeDisplay(pet: Pet): string {
    const years = pet.ageYears || 0;
    const months = pet.ageMonths || 0;
    let display = '';
    if (years > 0) display += `${years} year${years > 1 ? 's' : ''} `;
    if (months > 0) display += `${months} month${months > 1 ? 's' : ''}`;
    return display.trim() || 'Unknown';
  }
}
