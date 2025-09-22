import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  searchText: string = '';
  selectedFilter: string = 'All';
  pets: Pet[] = [];
  filters = {
    species: [] as string[],
    gender: [] as string[],
    city: '',
    area: '',
    vaccinated: false
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
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.loadPets();
  }

  async loadPets() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading pets...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const activePets: any[] = await this.firebaseService.getActivePets();
      const favoritePets: any[] = await this.firebaseService.getFavoritePets('pet-adoption');
      const favoriteIds = new Set(favoritePets.map(p => p.id));

      this.pets = (activePets ?? []).map(p => {
        const image =
          Array.isArray(p?.photos) && p.photos.length > 0
            ? p.photos[0]
            : (p?.image || 'assets/default-pet.jpg');

        // Normalize species/category once for consistent filtering & display
        const species = (p?.species ?? p?.category ?? '').toString().toLowerCase();

        return {
          ...p,
          species,                      // keep a normalized species
          category: p?.category ?? species,
          favorite: favoriteIds.has(p?.id),
          image
        } as Pet & { image: string; favorite: boolean; species: string; category?: string };
      });

      console.log('Loaded pets:', this.pets);
    } catch (err) {
      console.error('Error loading pets:', err);
      this.showToast('Failed to load pets.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  applyFilter(cat: string) {
    this.selectedFilter = cat;
    console.log('Selected filter:', this.selectedFilter);
    console.log('Filtered pets:', this.filteredPets());
  }

  filteredPets(): Pet[] {
    const q = this.searchText.trim().toLowerCase();

    return this.pets.filter((pet: any) => {
      // Category filter (species-based)
      const matchesCategory =
        this.selectedFilter === 'All' ||
        (!!pet?.species && pet.species === this.selectedFilter.toLowerCase());

      // Modal filters
      const matchesSpecies =
        this.filters.species.length === 0 ||
        (!!pet?.species && this.filters.species.includes(pet.species));

      const matchesGender =
        this.filters.gender.length === 0 ||
        (!!pet?.gender && this.filters.gender.includes(pet.gender));

      const matchesCity =
        !this.filters.city ||
        (!!pet?.location && pet.location === this.filters.city);

      const matchesArea =
        !this.filters.area ||
        (!!pet?.area && pet.area === this.filters.area);

      const matchesVaccinated =
        this.filters.vaccinated === false ||
        pet?.vaccinated === this.filters.vaccinated;

      // Search text across key fields
      const matchesSearch =
        q === '' ||
        (!!pet?.petName && pet.petName.toLowerCase().includes(q)) ||
        (!!pet?.species && pet.species.toLowerCase().includes(q)) ||
        (!!pet?.category && pet.category.toLowerCase().includes(q)) ||
        (!!pet?.location && pet.location.toLowerCase().includes(q));

      return (
        matchesCategory &&
        matchesSpecies &&
        matchesGender &&
        matchesCity &&
        matchesArea &&
        matchesVaccinated &&
        matchesSearch
      );
    });
  }

  openPetDetails(pet: Pet) {
    if (!pet?.id) return;
    this.router.navigate(['/adoption/pet-details', pet.id]);
  }

  async toggleFavorite(pet: Pet, event: MouseEvent) {
    event.stopPropagation();
    if (!pet?.id) return;

    // Auth guard: favorites require signed-in user
    const user = this.firebaseService.getCurrentUser();
    if (!user) {
      this.showToast('Please sign in to save favorites.', 'danger');
      return;
    }

    // Optimistic UI + rollback on error
    const prev = !!pet.favorite;
    pet.favorite = !prev;

    try {
      await this.firebaseService.setFavorite('pet-adoption', pet.id, !prev);
      this.showToast(pet.favorite ? 'Added to favorites!' : 'Removed from favorites!', 'success');
    } catch (err) {
      console.error('Error toggling favorite:', err);
      pet.favorite = prev; // rollback
      this.showToast('Failed to toggle favorite.', 'danger');
    }
  }

  newAdoptionNavigation() {
    this.router.navigate(['/tabs/adoption/submit-pet']);
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps: {
        filters: { ...this.filters }
      }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.filters = { ...data };
        console.log('Applied filters:', this.filters);
        console.log('Filtered pets:', this.filteredPets());
      }
    });

    await modal.present();
  }
}
