// // import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// // import { FormsModule } from '@angular/forms';
// // import { IonicModule, ToastController, LoadingController, ModalController } from '@ionic/angular';
// // import { CommonModule } from '@angular/common';
// // import { Router, ActivatedRoute } from '@angular/router';
// // import { FirebaseService } from '../../app/services/firebase.service';
// // import { Pet } from '../models/pet.model';
// // import { FilterModalComponent } from '../filter-modal/filter-modal.component';

// // @Component({
// //   selector: 'app-adoption',
// //   templateUrl: './adoption.page.html',
// //   styleUrls: ['./adoption.page.scss'],
// //   standalone: true,
// //   imports: [FormsModule, IonicModule, CommonModule],
// // })
// // export class AdoptionPage implements OnInit {
// //   searchText = '';
// //   selectedFilter: string = 'All';
// //   pets: Pet[] = [];
// //   filters = {
// //     species: [] as string[],
// //     gender: [] as string[],
// //     ageRange: [] as string[],
// //     city: '',
// //     area: '',
// //     vaccinated: false,
// //     dewormed: false,
// //     neutered: false,
// //   };
// //   categoryIcons = [
// //     { name: 'All', icon: 'assets/img/pets2.png' },
// //     { name: 'dog', icon: 'assets/img/dog.jpg' },
// //     { name: 'cat', icon: 'assets/img/cat.jpg' },
// //     { name: 'bird', icon: 'assets/img/bird.jpg' },
// //     { name: 'fish', icon: 'assets/img/fish.jfif' },
// //     { name: 'rabbit', icon: 'assets/img/rabbit.png' }
// //   ];

// //   constructor(
// //     private router: Router,
// //     private route: ActivatedRoute,
// //     private firebaseService: FirebaseService,
// //     private toastCtrl: ToastController,
// //     private loadingCtrl: LoadingController,
// //     private modalController: ModalController,
// //     private cdr: ChangeDetectorRef
// //   ) {}

// //   async ngOnInit() {
// //     await this.loadPets();
// //   }

// //   async loadPets() {
// //     const loading = await this.loadingCtrl.create({ message: 'Loading pets...', spinner: 'crescent' });
// //     await loading.present();

// //     try {
// //       const activePets: any[] = await this.firebaseService.getActivePets();
// //       const favoritePets: any[] = await this.firebaseService.getFavoritePets('pet-adoption');
// //       const favoriteIds = new Set(favoritePets.map(p => p.id));

// //       this.pets = (activePets || []).map((p: any) => {
// //         const image =
// //           Array.isArray(p.photos) && p.photos.length > 0 ? p.photos[0] :
// //           p.image || 'assets/default-pet.jpg';

// //         return {
// //           ...p,
// //           petName: p.petName || 'Unnamed',
// //           species: (p.species || p.category || '').toLowerCase(),
// //           breed: p.breed || 'Mixed',
// //           age: typeof p.age === 'number' ? p.age : (Number(p.age) || 0),
// //           ageRange: p.ageRange || this.calculateAgeRange(p.age, p.species),
// //           gender: (p.gender || 'Unknown').toLowerCase(), // Normalize gender to lowercase
// //           location: p.location || '',
// //           vaccinated: p.vaccinated || false,
// //           dewormed: p.dewormed || false,
// //           neutered: p.neutered || false,
// //           favorite: favoriteIds.has(p.id),
// //           image,
// //         } as Pet;
// //       });
// //       console.log('Loaded pets:', this.pets); // Debugging
// //     } catch (err) {
// //       console.error('Error loading pets:', err);
// //       this.showToast('Failed to load pets.', 'danger');
// //     } finally {
// //       await loading.dismiss();
// //     }
// //   }

// //   private calculateAgeRange(age: number, species: string): string {
// //     if (species === 'dog' || species === 'cat') {
// //       if (age < 1) return species === 'dog' ? 'Puppy' : 'Kitten';
// //       if (age < 3) return 'Young';
// //       if (age < 7) return 'Adult';
// //       return 'Senior';
// //     }
// //     return '';
// //   }

// //   async doRefresh(ev: any) {
// //     await this.loadPets();
// //     ev.target?.complete?.();
// //   }

// //   applyFilter(cat: string) {
// //     this.selectedFilter = cat;
// //     this.cdr.detectChanges(); // Force UI update
// //   }

// //   filteredPets(): Pet[] {
// //     let list = [...this.pets];

// //     if (this.selectedFilter !== 'All') {
// //       const sel = this.selectedFilter.toLowerCase();
// //       list = list.filter(p => (p.species || '').toLowerCase() === sel);
// //     }

// //     const { species, gender, ageRange, city, area, vaccinated, dewormed, neutered } = this.filters;
// //     if (species.length) list = list.filter(p => !!p.species && species.includes(p.species.toLowerCase()));
// //     if (gender.length) list = list.filter(p => !!p.gender && gender.includes(p.gender.toLowerCase()));
// //     if (ageRange.length) list = list.filter(p => !!p.ageRange && ageRange.includes(p.ageRange));
// //     if (city) list = list.filter(p => !!p.location && p.location.toLowerCase() === city.toLowerCase());
// //     if (area) list = list.filter((p: any) => !!p.area && p.area.toLowerCase() === area.toLowerCase());
// //     if (vaccinated) list = list.filter((p: any) => p.vaccinated === true);
// //     if (dewormed) list = list.filter((p: any) => p.dewormed === true);
// //     if (neutered) list = list.filter((p: any) => p.neutered === true);

// //     const q = this.searchText.trim().toLowerCase();
// //     if (q) {
// //       list = list.filter(p =>
// //         (p.petName && p.petName.toLowerCase().includes(q)) ||
// //         (p.species && p.species.toLowerCase().includes(q)) ||
// //         (p.breed && p.breed.toLowerCase().includes(q)) ||
// //         (p.gender && p.gender.toLowerCase().includes(q)) ||
// //         (p.location && p.location.toLowerCase().includes(q))
// //       );
// //     }

// //     console.log('Filtered pets:', list, 'Filters:', this.filters); // Debugging
// //     return list;
// //   }

// //   openPetDetails(pet: Pet) {
// //     this.router.navigate(['pet-details', pet.id], {
// //       relativeTo: this.route,
// //       state: { pet },
// //     });
// //   }

// //   onViewDetails(pet: Pet, ev: Event) {
// //     ev.stopPropagation();
// //     this.openPetDetails(pet);
// //   }

// //   async toggleFavorite(pet: Pet, event: MouseEvent) {
// //     event.stopPropagation();
// //     if (!pet.id) return;
// //     try {
// //       await this.firebaseService.setFavorite('pet-adoption', pet.id, !pet.favorite);
// //       pet.favorite = !pet.favorite;
// //       this.showToast(pet.favorite ? 'Added to favorites!' : 'Removed from favorites!', 'success');
// //     } catch (err) {
// //       console.error('Error toggling favorite:', err);
// //       this.showToast('Failed to toggle favorite.', 'danger');
// //     }
// //   }

// //   newAdoptionNavigation() {
// //     this.router.navigate(['submit-pet'], { relativeTo: this.route });
// //   }

// //   async openFilterModal() {
// //   const modal = await this.modalController.create({
// //     component: FilterModalComponent,
// //     componentProps: { 
// //       filterTitle: 'Filter Pets', // Custom title
// //       filterType: 'pet',
// //       filters: { ...this.filters },
// //       filterConfig: [
// //         { key: 'species', label: 'Pet Categories', type: 'chips', options: ['dog', 'cat', 'other'], priority: 1 }, // Main chips
// //         { key: 'ageRange', label: 'Age Range', type: 'chips', options: ['Puppy', 'Kitten', 'Young', 'Adult', 'Senior'], priority: 2 }, // Secondary chips
// //         { key: 'gender', label: 'Gender', type: 'chips', options: ['male', 'female', 'unknown'] },
// //         { key: 'city', label: 'City', type: 'dropdown', options: ['New York', 'Los Angeles', 'Chicago'] },
// //         { 
// //           key: 'area', 
// //           label: 'Area', 
// //           type: 'dropdown', 
// //           dependsOn: 'city',
// //           options: {
// //             'New York': ['Manhattan', 'Brooklyn', 'Queens'],
// //             'Los Angeles': ['Downtown', 'Hollywood', 'Santa Monica'],
// //             'Chicago': ['Loop', 'Lincoln Park', 'Hyde Park']
// //           }
// //         },
// //         { key: 'vaccinated', label: 'Vaccinated', type: 'toggle' },
// //         { key: 'dewormed', label: 'Dewormed', type: 'toggle' },
// //         { key: 'neutered', label: 'Neutered', type: 'toggle' }
// //       ]
// //     },
// //     breakpoints: [0, 0.5, 0.9],  // Add 0.9 or 1 to allow larger size
// //   initialBreakpoint: 0.5,       // Start nearly fully expanded
// //   cssClass: 'bottom-filter-sheet'
// //   });

// //   modal.onDidDismiss().then(({ data }) => {
// //     if (data) {
// //       this.filters = { ...data };
// //       this.cdr.detectChanges();
// //     }
// //   });

// //   await modal.present();
// // }

// //   private async showToast(message: string, color: 'success' | 'danger') {
// //     const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
// //     await toast.present();
// //   }
// // }


// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { IonicModule, ToastController, LoadingController, ModalController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { Router, ActivatedRoute } from '@angular/router';
// import { FirebaseService } from '../../app/services/firebase.service';
// import { Pet as BasePet } from '../models/pet.model';  // keep your shared model
// import { FilterModalComponent } from '../filter-modal/filter-modal.component';

// type PetVM = BasePet & {
//   // UI-computed / display fields
//   displayAge: string;        // "1y 3m", "7m", etc.
//   ageInMonths: number;       // canonical age number
//   image: string;             // first photo or fallback
//   favorite: boolean;         // heart state
//   // optional fields that filters might read
//   vaccinated?: boolean;
//   dewormed?: boolean;
//   neutered?: boolean;
//   ageRange?: string;
// };

// @Component({
//   selector: 'app-adoption',
//   templateUrl: './adoption.page.html',
//   styleUrls: ['./adoption.page.scss'],
//   standalone: true,
//   imports: [FormsModule, IonicModule, CommonModule],
// })
// export class AdoptionPage implements OnInit {
//   searchText = '';
//   selectedFilter: string = 'All';
//   pets: PetVM[] = [];

//   filters = {
//     species: [] as string[],
//     gender: [] as string[],
//     ageRange: [] as string[],
//     city: '',
//     area: '',
//     vaccinated: false,
//     dewormed: false,
//     neutered: false,
//   };

//   categoryIcons = [
//     { name: 'All', icon: 'assets/img/pets2.png' },
//     { name: 'dog', icon: 'assets/img/dog.jpg' },
//     { name: 'cat', icon: 'assets/img/cat.jpg' },
//     { name: 'bird', icon: 'assets/img/bird.jpg' },
//     { name: 'fish', icon: 'assets/img/fish.jfif' },
//     { name: 'rabbit', icon: 'assets/img/rabbit.png' }
//   ];

//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     private firebaseService: FirebaseService,
//     private toastCtrl: ToastController,
//     private loadingCtrl: LoadingController,
//     private modalController: ModalController,
//     private cdr: ChangeDetectorRef
//   ) {}

//   async ngOnInit() {
//     await this.loadPets();
//   }

//   private normalizeSpeciesCode(val: any): string {
//     const s = String(val || '').toLowerCase();
//     if (s.includes('dog')) return 'dog';
//     if (s.includes('cat')) return 'cat';
//     if (s.includes('bird')) return 'bird';
//     if (s.includes('fish')) return 'fish';
//     if (s.includes('rabbit')) return 'rabbit';
//     return 'other';
//   }

//   private toDisplayAge(p: any): { months: number; text: string } {
//     const m =
//       typeof p?.ageInMonths === 'number' ? p.ageInMonths :
//       (Number(p?.ageYears) || 0) * 12 + (Number(p?.ageMonths) || 0);

//     const months = Math.max(0, Math.floor(m));
//     const y = Math.floor(months / 12);
//     const mm = months % 12;
//     const text = y > 0 ? (mm > 0 ? `${y}y ${mm}m` : `${y}y`) : `${mm}m`;
//     return { months, text };
//   }

//   async loadPets() {
//     const loading = await this.loadingCtrl.create({ message: 'Loading pets...', spinner: 'crescent' });
//     await loading.present();

//     try {
//       const activePets: any[] = await this.firebaseService.getActivePets();
//       const favoritePets: any[] = await this.firebaseService.getFavoritePets('pet-adoption');
//       const favoriteIds = new Set((favoritePets || []).map(p => p.id));

//       this.pets = (activePets || []).map((p: any) => {
//         const image =
//           Array.isArray(p.photos) && p.photos.length > 0 ? p.photos[0] :
//           p.image || 'assets/default-pet.jpg';

//         const speciesCode = this.normalizeSpeciesCode(p.species || p.category);
//         const { months, text } = this.toDisplayAge(p);

//         const vm: PetVM = {
//           ...p,
//           petName: p.petName || 'Unnamed',
//           species: speciesCode,                 // dog/cat/bird/fish/rabbit/other
//           breed: p.breed || 'Mixed',
//           ageInMonths: months,                  // canonical numeric
//           displayAge: text,                     // e.g., "1y 3m" or "7m"
//           gender: (p.gender || 'Unknown').toLowerCase(),
//           location: p.location || '',
//           vaccinated: p.vaccinated || false,
//           dewormed: p.dewormed || false,
//           neutered: p.neutered || false,
//           favorite: favoriteIds.has(p.id),
//           image,
//         };
//         return vm;
//       });
//     } catch (err) {
//       console.error('Error loading pets:', err);
//       this.showToast('Failed to load pets.', 'danger');
//     } finally {
//       await loading.dismiss();
//     }
//   }

//   async doRefresh(ev: any) {
//     await this.loadPets();
//     ev.target?.complete?.();
//   }

//   applyFilter(cat: string) {
//     this.selectedFilter = cat;
//     this.cdr.detectChanges();
//   }

//   filteredPets(): PetVM[] {
//     let list = [...this.pets];

//     if (this.selectedFilter !== 'All') {
//       const sel = this.selectedFilter.toLowerCase();
//       list = list.filter(p => (p.species || '').toLowerCase() === sel);
//     }

//     const { species, gender, ageRange, city, area, vaccinated, dewormed, neutered } = this.filters;
//     if (species.length)   list = list.filter(p => !!p.species && species.includes(p.species.toLowerCase()));
//     if (gender.length)    list = list.filter(p => !!p.gender && gender.includes(p.gender.toLowerCase()));
//     if (ageRange.length)  list = list.filter(p => !!p.ageRange && ageRange.includes(p.ageRange));
//     if (city)             list = list.filter(p => !!p.location && p.location.toLowerCase() === city.toLowerCase());
//     if (area)             list = list.filter((p: any) => !!p.area && p.area.toLowerCase() === area.toLowerCase());
//     if (vaccinated)       list = list.filter((p: any) => p.vaccinated === true);
//     if (dewormed)         list = list.filter((p: any) => p.dewormed === true);
//     if (neutered)         list = list.filter((p: any) => p.neutered === true);

//     const q = this.searchText.trim().toLowerCase();
//     if (q) {
//       list = list.filter(p =>
//         (p.petName && p.petName.toLowerCase().includes(q)) ||
//         (p.species && p.species.toLowerCase().includes(q)) ||
//         (p.breed && p.breed.toLowerCase().includes(q)) ||
//         (p.gender && p.gender.toLowerCase().includes(q)) ||
//         (p.location && p.location.toLowerCase().includes(q))
//       );
//     }
//     return list;
//   }

//   openPetDetails(p: PetVM) {
//     this.router.navigate(['pet-details', (p as any).id], { relativeTo: this.route, state: { pet: p } });
//   }

//   onViewDetails(pet: PetVM, ev: Event) {
//     ev.stopPropagation();
//     this.openPetDetails(pet);
//   }

//   async toggleFavorite(pet: PetVM, event: MouseEvent) {
//     event.stopPropagation();
//     if (!(pet as any).id) return;
//     try {
//       await this.firebaseService.setFavorite('pet-adoption', (pet as any).id, !(pet as any).favorite);
//       (pet as any).favorite = !(pet as any).favorite;
//       this.showToast((pet as any).favorite ? 'Added to favorites!' : 'Removed from favorites!', 'success');
//     } catch (err) {
//       console.error('Error toggling favorite:', err);
//       this.showToast('Failed to toggle favorite.', 'danger');
//     }
//   }

//   newAdoptionNavigation() {
//     this.router.navigate(['submit-pet'], { relativeTo: this.route });
//   }

//   // async openFilterModal() {
//   //   const modal = await this.modalController.create({
//   //     component: FilterModalComponent,
//   //     componentProps: { 
//   //       filters: { ...this.filters },
//   //       filterType: 'pet',
//   //       filterConfig: [
//   //         { key: 'species',  label: 'Species',   type: 'chips',    options: ['dog','cat','bird','fish','rabbit','other'] },
//   //         { key: 'gender',   label: 'Gender',    type: 'chips',    options: ['male','female','unknown'] },
//   //         { key: 'ageRange', label: 'Age Range', type: 'chips',    options: ['Puppy','Kitten','Young','Adult','Senior'] },
//   //         { key: 'city',     label: 'City',      type: 'dropdown', options: ['New York', 'Los Angeles', 'Chicago'] },
//   //         { 
//   //           key: 'area', label: 'Area', type: 'dropdown', dependsOn: 'city',
//   //           options: {
//   //             'New York': ['Manhattan', 'Brooklyn', 'Queens'],
//   //             'Los Angeles': ['Downtown', 'Hollywood', 'Santa Monica'],
//   //             'Chicago': ['Loop', 'Lincoln Park', 'Hyde Park']
//   //           }
//   //         },
//   //         { key: 'vaccinated', label: 'Vaccinated', type: 'toggle' },
//   //         { key: 'dewormed',   label: 'Dewormed',   type: 'toggle' },
//   //         { key: 'neutered',   label: 'Neutered',   type: 'toggle' }
//   //       ]
//   //     },
//   //   });

//   //   const { data } = await modal.onDidDismiss();
//   //   if (data) {
//   //     this.filters = { ...data };
//   //     this.cdr.detectChanges();
//   //   }
//   // }

//   async openFilterModal() {
//   const modal = await this.modalController.create({
//     component: FilterModalComponent,
//     componentProps: { 
//       filterTitle: 'Filter Pets', // Custom title
//       filterType: 'pet',
//       filters: { ...this.filters },
//       filterConfig: [
//         { key: 'species', label: 'Pet Categories', type: 'chips', options: ['dog', 'cat', 'other'], priority: 1 }, // Main chips
//         { key: 'ageRange', label: 'Age Range', type: 'chips', options: ['Puppy', 'Kitten', 'Young', 'Adult', 'Senior'], priority: 2 }, // Secondary chips
//         { key: 'gender', label: 'Gender', type: 'chips', options: ['male', 'female', 'unknown'] },
//         { key: 'city', label: 'City', type: 'dropdown', options: ['New York', 'Los Angeles', 'Chicago'] },
//         { 
//           key: 'area', 
//           label: 'Area', 
//           type: 'dropdown', 
//           dependsOn: 'city',
//           options: {
//             'New York': ['Manhattan', 'Brooklyn', 'Queens'],
//             'Los Angeles': ['Downtown', 'Hollywood', 'Santa Monica'],
//             'Chicago': ['Loop', 'Lincoln Park', 'Hyde Park']
//           }
//         },
//         { key: 'vaccinated', label: 'Vaccinated', type: 'toggle' },
//         { key: 'dewormed', label: 'Dewormed', type: 'toggle' },
//         { key: 'neutered', label: 'Neutered', type: 'toggle' }
//       ]
//     },
//     breakpoints: [0, 0.5, 0.9],  // modal snap points for sliding effect
//     initialBreakpoint: 0.5,       // start nearly expanded
//     cssClass: 'bottom-filter-sheet' // custom styling for border-radius and height
//   });

//   modal.onDidDismiss().then(({ data }) => {
//     if (data) {
//       this.filters = { ...data };
//       this.cdr.detectChanges();
//     }
//   });

//   await modal.present();
// }

//   private async showToast(message: string, color: 'success' | 'danger') {
//     const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
//     await toast.present();
//   }
// }


import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../app/services/firebase.service';
import { Pet as BasePet } from '../models/pet.model';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

type PetVM = BasePet & {
  displayAge: string;
  ageInMonths: number;
  image: string;
  favorite: boolean;
  vaccinated?: boolean;
  dewormed?: boolean;
  neutered?: boolean;
};

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.page.html',
  styleUrls: ['./adoption.page.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, CommonModule],
})
export class AdoptionPage implements OnInit {
  searchText = '';
  selectedFilter: string = 'All';
  pets: PetVM[] = [];

  filters = {
    species: [] as string[],
    gender: [] as string[],
    age: [] as string[], // Changed to age
    city: '',
    area: '',
    vaccinated: false,
    dewormed: false,
    neutered: false,
  };

  categoryIcons = [
    { name: 'All', icon: 'assets/img/pets2.png' },
    { name: 'dog', icon: 'assets/img/dog.jpg' },
    { name: 'cat', icon: 'assets/img/cat.jpg' },
    { name: 'bird', icon: 'assets/img/bird.jpg' },
    { name: 'fish', icon: 'assets/img/fish.jfif' },
    { name: 'rabbit', icon: 'assets/img/rabbit.png' },
    { name: 'other', icon: 'assets/img/other.png' }, // Added other
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadPets();
  }

  private normalizeSpeciesCode(val: any): string {
    const s = String(val || '').toLowerCase();
    if (s.includes('dog')) return 'dog';
    if (s.includes('cat')) return 'cat';
    if (s.includes('bird')) return 'bird';
    if (s.includes('fish')) return 'fish';
    if (s.includes('rabbit')) return 'rabbit';
    return 'other';
  }

  private toDisplayAge(p: any): { months: number; text: string } {
    const m =
      typeof p?.ageInMonths === 'number' ? p.ageInMonths :
      (Number(p?.ageYears) || 0) * 12 + (Number(p?.ageMonths) || 0);

    const months = Math.max(0, Math.floor(m));
    const y = Math.floor(months / 12);
    const mm = months % 12;
    const text = y > 0 ? (mm > 0 ? `${y}y ${mm}m` : `${y}y`) : `${mm}m`;
    return { months, text };
  }

  async loadPets() {
    const loading = await this.loadingCtrl.create({ message: 'Loading pets...', spinner: 'crescent' });
    await loading.present();

    try {
      const activePets: any[] = await this.firebaseService.getActivePets();
      const favoritePets: any[] = await this.firebaseService.getFavoritePets('pet-adoption');
      const favoriteIds = new Set((favoritePets || []).map(p => p.id));

      this.pets = (activePets || []).map((p: any) => {
        const image =
          Array.isArray(p.photos) && p.photos.length > 0 ? p.photos[0] :
          p.image || 'assets/default-pet.jpg';

        const speciesCode = this.normalizeSpeciesCode(p.species || p.category);
        const { months, text } = this.toDisplayAge(p);

        const vm: PetVM = {
          ...p,
          petName: p.petName || 'Unnamed',
          species: speciesCode,
          breed: p.breed || 'Mixed',
          ageInMonths: months,
          displayAge: text,
          gender: (p.gender || 'Unknown').toLowerCase(),
          location: p.location || '',
          vaccinated: p.vaccinated || false,
          dewormed: p.dewormed || false,
          neutered: p.neutered || false,
          favorite: favoriteIds.has(p.id),
          image,
        };
        return vm;
      });
    } catch (err) {
      console.error('Error loading pets:', err);
      this.showToast('Failed to load pets.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async doRefresh(ev: any) {
    await this.loadPets();
    ev.target?.complete?.();
  }

  applyFilter(cat: string) {
    this.selectedFilter = cat;
    this.cdr.detectChanges();
  }

  filteredPets(): PetVM[] {
    let list = [...this.pets];

    if (this.selectedFilter !== 'All') {
      const sel = this.selectedFilter.toLowerCase();
      list = list.filter(p => (p.species || '').toLowerCase() === sel);
    }

    const { species, gender, age, city, area, vaccinated, dewormed, neutered } = this.filters;
    if (species.length) list = list.filter(p => !!p.species && species.includes(p.species.toLowerCase()));
    if (gender.length) list = list.filter(p => !!p.gender && gender.includes(p.gender.toLowerCase()));
    if (age.length) {
      list = list.filter(p => {
        const ageInYears = p.ageInMonths / 12;
        return age.some(range => {
          if (range === '0-1') return ageInYears >= 0 && ageInYears < 1;
          if (range === '1-3') return ageInYears >= 1 && ageInYears < 3;
          if (range === '3-7') return ageInYears >= 3 && ageInYears < 7;
          if (range === '7-12') return ageInYears >= 7 && ageInYears < 12;
          if (range === '12+') return ageInYears >= 12;
          return false;
        });
      });
    }
    if (city) list = list.filter(p => !!p.location && p.location.toLowerCase() === city.toLowerCase());
    if (area) list = list.filter((p: any) => !!p.area && p.area.toLowerCase() === area.toLowerCase());
    if (vaccinated) list = list.filter((p: any) => p.vaccinated === true);
    if (dewormed) list = list.filter((p: any) => p.dewormed === true);
    if (neutered) list = list.filter((p: any) => p.neutered === true);

    const q = this.searchText.trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        (p.petName && p.petName.toLowerCase().includes(q)) ||
        (p.species && p.species.toLowerCase().includes(q)) ||
        (p.breed && p.breed.toLowerCase().includes(q)) ||
        (p.gender && p.gender.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q))
      );
    }
    return list;
  }

  openPetDetails(p: PetVM) {
    this.router.navigate(['pet-details', (p as any).id], { relativeTo: this.route, state: { pet: p } });
  }

  onViewDetails(pet: PetVM, ev: Event) {
    ev.stopPropagation();
    this.openPetDetails(pet);
  }

  async toggleFavorite(pet: PetVM, event: MouseEvent) {
    event.stopPropagation();
    if (!(pet as any).id) return;
    try {
      await this.firebaseService.setFavorite('pet-adoption', (pet as any).id, !(pet as any).favorite);
      (pet as any).favorite = !(pet as any).favorite;
      this.showToast((pet as any).favorite ? 'Added to favorites!' : 'Removed from favorites!', 'success');
    } catch (err) {
      console.error('Error toggling favorite:', err);
      this.showToast('Failed to toggle favorite.', 'danger');
    }
  }

  newAdoptionNavigation() {
    this.router.navigate(['submit-pet'], { relativeTo: this.route });
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps: { 
        filterTitle: 'Filter Pets',
        filterType: 'pet',
        filters: { ...this.filters },
        filterConfig: [
          { 
            key: 'species', 
            label: 'Pet Categories', 
            type: 'chips', 
            options: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'other'], 
            priority: 1 
          },
          { 
            key: 'age', 
            label: 'Age Range (Years)', 
            type: 'chips', 
            options: ['0-1', '1-3', '3-7', '7-12', '12+'], 
            priority: 2 
          },
          { 
            key: 'gender', 
            label: 'Gender', 
            type: 'chips', 
            options: ['male', 'female', 'unknown'] 
          },
          { 
            key: 'city', 
            label: 'City', 
            type: 'dropdown', 
            options: ['New York', 'Los Angeles', 'Chicago'] 
          },
          { 
            key: 'area', 
            label: 'Area', 
            type: 'dropdown', 
            dependsOn: 'city',
            options: {
              'New York': ['Manhattan', 'Brooklyn', 'Queens'],
              'Los Angeles': ['Downtown', 'Hollywood', 'Santa Monica'],
              'Chicago': ['Loop', 'Lincoln Park', 'Hyde Park']
            }
          },
          { key: 'vaccinated', label: 'Vaccinated', type: 'toggle' },
          { key: 'dewormed', label: 'Dewormed', type: 'toggle' },
          { key: 'neutered', label: 'Neutered', type: 'toggle' }
        ]
      },
      breakpoints: [0, 0.5, 0.9],
      initialBreakpoint: 0.5,
      cssClass: 'bottom-filter-sheet'
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.filters = { ...data };
        this.cdr.detectChanges();
      }
    });

    await modal.present();
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await toast.present();
  }
}