// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { IonicModule, ToastController, LoadingController, ModalController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { Router, ActivatedRoute } from '@angular/router'; // ⬅️ added ActivatedRoute
// import { FirebaseService } from '../../app/services/firebase.service';
// import { Pet } from '../models/pet.model';
// import { FilterModalComponent } from '../filter-modal/filter-modal.component';

// @Component({
//   selector: 'app-adoption',
//   templateUrl: './adoption.page.html',
//   styleUrls: ['./adoption.page.scss'],
//   standalone: true,
//   imports: [FormsModule, IonicModule, CommonModule],
// })
// export class AdoptionPage implements OnInit {
//   // --- UI state used by HTML ---
//   searchText = '';
//   selectedFilter: string = 'All';

//   // --- data ---
//   pets: Pet[] = [];

//   // Filter modal state
//   filters = {
//     species: [] as string[],
//     gender: [] as string[],
//     city: '',
//     area: '',
//     vaccinated: false,
//   };

//   // Category icons for horizontally scrollable list
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
//     private route: ActivatedRoute, // ⬅️ inject current route
//     private firebaseService: FirebaseService,
//     private toastCtrl: ToastController,
//     private loadingCtrl: LoadingController,
//     private modalController: ModalController
//   ) {}

//   async ngOnInit() {
//     await this.loadPets();
//   }

//   // -----------------------------
//   // Load / Refresh
//   // -----------------------------
//   async loadPets() {
//     const loading = await this.loadingCtrl.create({ message: 'Loading pets...', spinner: 'crescent' });
//     await loading.present();

//     try {
//       const activePets: any[] = await this.firebaseService.getActivePets();
//       const favoritePets: any[] = await this.firebaseService.getFavoritePets('pet-adoption');
//       const favoriteIds = new Set(favoritePets.map(p => p.id));

//       this.pets = (activePets || []).map((p: any) => {
//         const image =
//           Array.isArray(p.photos) && p.photos.length > 0 ? p.photos[0] :
//           p.image || 'assets/default-pet.jpg';

//         return {
//           ...p,
//           // safe defaults to avoid undefined in template
//           petName: p.petName || 'Unnamed',
//           species: (p.species || p.category || '').toLowerCase(),
//           breed: p.breed || 'Mixed',
//           age: typeof p.age === 'number' ? p.age : (Number(p.age) || 0),
//           gender: p.gender || 'Unknown',
//           location: p.location || '',
//           favorite: favoriteIds.has(p.id),
//           image,
//         } as Pet;
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

//   // -----------------------------
//   // Filters / Search
//   // -----------------------------
//   applyFilter(cat: string) {
//     this.selectedFilter = cat;
//   }

//   filteredPets(): Pet[] {
//     let list = [...this.pets];

//     // Category chip (species)
//     if (this.selectedFilter !== 'All') {
//       const sel = this.selectedFilter.toLowerCase();
//       list = list.filter(p => (p.species || '').toLowerCase() === sel);
//     }

//     // Modal filters
//     const { species, gender, city, area, vaccinated } = this.filters;
//     if (species.length) list = list.filter(p => !!p.species && species.includes(p.species));
//     if (gender.length)  list = list.filter(p => !!p.gender && gender.includes(p.gender));
//     if (city)           list = list.filter(p => !!p.location && p.location === city);
//     if (area)           list = list.filter((p: any) => !!p.area && p.area === area);
//     if (vaccinated)     list = list.filter((p: any) => p.vaccinated === true);

//     // Search
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

//   // -----------------------------
//   // Actions
//   // -----------------------------
//   openPetDetails(pet: Pet) {
//     // ✅ relative navigation -> resolves to /tabs/adoption/pet-details/:id
//     this.router.navigate(['pet-details', pet.id], {
//       relativeTo: this.route,
//       state: { pet },
//     });
//   }

//   onViewDetails(pet: Pet, ev: Event) {
//     ev.stopPropagation();
//     this.openPetDetails(pet);
//   }

//   async toggleFavorite(pet: Pet, event: MouseEvent) {
//     event.stopPropagation();
//     if (!pet.id) return;
//     try {
//       await this.firebaseService.setFavorite('pet-adoption', pet.id, !pet.favorite);
//       pet.favorite = !pet.favorite;
//       this.showToast(pet.favorite ? 'Added to favorites!' : 'Removed from favorites!', 'success');
//     } catch (err) {
//       console.error('Error toggling favorite:', err);
//       this.showToast('Failed to toggle favorite.', 'danger');
//     }
//   }

//   newAdoptionNavigation() {
//     // optional: also use relative navigation
//     this.router.navigate(['submit-pet'], { relativeTo: this.route });
//     // or keep your absolute version:
//     // this.router.navigate(['/tabs/adoption/submit-pet']);
//   }

//   // -----------------------------
//   // Modal
//   // -----------------------------
//   async openFilterModal() {
//     const modal = await this.modalController.create({
//       component: FilterModalComponent,
//       componentProps: { filters: { ...this.filters } },
//     });

//     modal.onDidDismiss().then(({ data }) => {
//       if (data) this.filters = { ...data };
//     });

//     await modal.present();
//   }

//   // -----------------------------
//   // UI helper
//   // -----------------------------
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
import { Pet } from '../models/pet.model';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

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
  pets: Pet[] = [];
  filters = {
    species: [] as string[],
    gender: [] as string[],
    ageRange: [] as string[],
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
    { name: 'rabbit', icon: 'assets/img/rabbit.png' }
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

  async loadPets() {
    const loading = await this.loadingCtrl.create({ message: 'Loading pets...', spinner: 'crescent' });
    await loading.present();

    try {
      const activePets: any[] = await this.firebaseService.getActivePets();
      const favoritePets: any[] = await this.firebaseService.getFavoritePets('pet-adoption');
      const favoriteIds = new Set(favoritePets.map(p => p.id));

      this.pets = (activePets || []).map((p: any) => {
        const image =
          Array.isArray(p.photos) && p.photos.length > 0 ? p.photos[0] :
          p.image || 'assets/default-pet.jpg';

        return {
          ...p,
          petName: p.petName || 'Unnamed',
          species: (p.species || p.category || '').toLowerCase(),
          breed: p.breed || 'Mixed',
          age: typeof p.age === 'number' ? p.age : (Number(p.age) || 0),
          ageRange: p.ageRange || this.calculateAgeRange(p.age, p.species),
          gender: (p.gender || 'Unknown').toLowerCase(), // Normalize gender to lowercase
          location: p.location || '',
          vaccinated: p.vaccinated || false,
          dewormed: p.dewormed || false,
          neutered: p.neutered || false,
          favorite: favoriteIds.has(p.id),
          image,
        } as Pet;
      });
      console.log('Loaded pets:', this.pets); // Debugging
    } catch (err) {
      console.error('Error loading pets:', err);
      this.showToast('Failed to load pets.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private calculateAgeRange(age: number, species: string): string {
    if (species === 'dog' || species === 'cat') {
      if (age < 1) return species === 'dog' ? 'Puppy' : 'Kitten';
      if (age < 3) return 'Young';
      if (age < 7) return 'Adult';
      return 'Senior';
    }
    return '';
  }

  async doRefresh(ev: any) {
    await this.loadPets();
    ev.target?.complete?.();
  }

  applyFilter(cat: string) {
    this.selectedFilter = cat;
    this.cdr.detectChanges(); // Force UI update
  }

  filteredPets(): Pet[] {
    let list = [...this.pets];

    if (this.selectedFilter !== 'All') {
      const sel = this.selectedFilter.toLowerCase();
      list = list.filter(p => (p.species || '').toLowerCase() === sel);
    }

    const { species, gender, ageRange, city, area, vaccinated, dewormed, neutered } = this.filters;
    if (species.length) list = list.filter(p => !!p.species && species.includes(p.species.toLowerCase()));
    if (gender.length) list = list.filter(p => !!p.gender && gender.includes(p.gender.toLowerCase()));
    if (ageRange.length) list = list.filter(p => !!p.ageRange && ageRange.includes(p.ageRange));
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

    console.log('Filtered pets:', list, 'Filters:', this.filters); // Debugging
    return list;
  }

  openPetDetails(pet: Pet) {
    this.router.navigate(['pet-details', pet.id], {
      relativeTo: this.route,
      state: { pet },
    });
  }

  onViewDetails(pet: Pet, ev: Event) {
    ev.stopPropagation();
    this.openPetDetails(pet);
  }

  async toggleFavorite(pet: Pet, event: MouseEvent) {
    event.stopPropagation();
    if (!pet.id) return;
    try {
      await this.firebaseService.setFavorite('pet-adoption', pet.id, !pet.favorite);
      pet.favorite = !pet.favorite;
      this.showToast(pet.favorite ? 'Added to favorites!' : 'Removed from favorites!', 'success');
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
        filters: { ...this.filters },
        filterType: 'pet',
        filterConfig: [
          { key: 'species', label: 'Species', type: 'chips', options: ['dog', 'cat', 'other'] },
          { key: 'gender', label: 'Gender', type: 'chips', options: ['male', 'female', 'unknown'] },
          { key: 'ageRange', label: 'Age Range', type: 'chips', options: ['Puppy', 'Kitten', 'Young', 'Adult', 'Senior'] },
          { key: 'city', label: 'City', type: 'dropdown', options: ['New York', 'Los Angeles', 'Chicago'] },
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
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.filters = { ...data };
        this.cdr.detectChanges(); // Force UI update after filter changes
      }
    });

    await modal.present();
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await toast.present();
  }
}