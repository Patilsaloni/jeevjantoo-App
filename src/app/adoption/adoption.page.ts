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

  // Category icons for horizontally scrollable list
  categoryIcons = [
    { name: 'All', icon: 'assets/img/pets2.png' },
    { name: 'Dog', icon: 'assets/img/dog.jpg' },
    { name: 'Cat', icon: 'assets/img/cat.jpg' },
    { name: 'Bird', icon: 'assets/img/bird.jpg' },
    { name: 'Fish', icon: 'assets/img/fish.jfif' },
    { name: 'Rabbit', icon: 'assets/img/rabbit.png' }
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
      const favoriteIds = favoritePets.map(p => p.id);

      this.pets = activePets.map(p => ({
        ...p,
        favorite: favoriteIds.includes(p.id) || false,
        image: Array.isArray(p.photos) && p.photos.length > 0 
          ? p.photos[0] 
          : p.image || 'assets/default-pet.jpg'
      }));
      console.log('Loaded pets:', this.pets); // Debug: Log pets to verify species/category data
    } catch (err) {
      console.error('Error loading pets:', err);
      this.showToast('Failed to load pets.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  applyFilter(cat: string) {
    this.selectedFilter = cat;
    console.log('Selected filter:', this.selectedFilter); // Debug: Log selected filter
    console.log('Filtered pets:', this.filteredPets()); // Debug: Log filtered results
  }

  filteredPets(): Pet[] {
    return this.pets.filter(
      pet => {
        const matchesCategory = this.selectedFilter === 'All' || (pet.species && pet.species === this.selectedFilter);
        const matchesSearch = this.searchText.trim() === '' ||
          pet.petName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          (pet.species && pet.species.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (pet.category && pet.category.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (pet.location && pet.location.toLowerCase().includes(this.searchText.toLowerCase()));
        return matchesCategory && matchesSearch;
      }
    );
  }

  openPetDetails(pet: Pet) {
    this.router.navigate(['/adoption/pet-details', pet.id]);
  }

  async toggleFavorite(pet: Pet, event: MouseEvent) {
    event.stopPropagation();
    if (!pet.id) return;

    try {
      await this.firebaseService.setFavorite('pet-adoption', pet.id, !pet.favorite);
      pet.favorite = !pet.favorite;
      this.showToast(
        pet.favorite ? 'Added to favorites!' : 'Removed from favorites!',
        'success'
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
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
        // pass any initial data if needed here
      }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        console.log('Filter modal data:', data);
        // Update selectedFilter or other criteria based on modal data if needed
      }
    });

    await modal.present();
  }
}