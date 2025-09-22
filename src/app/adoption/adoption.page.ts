import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router'; // ⬅️ added ActivatedRoute
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
  // --- UI state used by HTML ---
  searchText = '';
  selectedFilter: string = 'All';

  // --- data ---
  pets: Pet[] = [];

  // Filter modal state
  filters = {
    species: [] as string[],
    gender: [] as string[],
    city: '',
    area: '',
    vaccinated: false,
  };

  // Category icons for horizontally scrollable list
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
    private route: ActivatedRoute, // ⬅️ inject current route
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.loadPets();
  }

  // -----------------------------
  // Load / Refresh
  // -----------------------------
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
          // safe defaults to avoid undefined in template
          petName: p.petName || 'Unnamed',
          species: (p.species || p.category || '').toLowerCase(),
          breed: p.breed || 'Mixed',
          age: typeof p.age === 'number' ? p.age : (Number(p.age) || 0),
          gender: p.gender || 'Unknown',
          location: p.location || '',
          favorite: favoriteIds.has(p.id),
          image,
        } as Pet;
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

  // -----------------------------
  // Filters / Search
  // -----------------------------
  applyFilter(cat: string) {
    this.selectedFilter = cat;
  }

  filteredPets(): Pet[] {
    let list = [...this.pets];

    // Category chip (species)
    if (this.selectedFilter !== 'All') {
      const sel = this.selectedFilter.toLowerCase();
      list = list.filter(p => (p.species || '').toLowerCase() === sel);
    }

    // Modal filters
    const { species, gender, city, area, vaccinated } = this.filters;
    if (species.length) list = list.filter(p => !!p.species && species.includes(p.species));
    if (gender.length)  list = list.filter(p => !!p.gender && gender.includes(p.gender));
    if (city)           list = list.filter(p => !!p.location && p.location === city);
    if (area)           list = list.filter((p: any) => !!p.area && p.area === area);
    if (vaccinated)     list = list.filter((p: any) => p.vaccinated === true);

    // Search
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

  // -----------------------------
  // Actions
  // -----------------------------
  openPetDetails(pet: Pet) {
    // ✅ relative navigation -> resolves to /tabs/adoption/pet-details/:id
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
    // optional: also use relative navigation
    this.router.navigate(['submit-pet'], { relativeTo: this.route });
    // or keep your absolute version:
    // this.router.navigate(['/tabs/adoption/submit-pet']);
  }

  // -----------------------------
  // Modal
  // -----------------------------
  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps: { filters: { ...this.filters } },
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data) this.filters = { ...data };
    });

    await modal.present();
  }

  // -----------------------------
  // UI helper
  // -----------------------------
  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await toast.present();
  }
}
