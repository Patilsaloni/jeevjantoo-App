import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from '../../app/services/firebase.service';
import { Pet } from '../models/pet.model';

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.page.html',
  styleUrls: ['./adoption.page.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, CommonModule],
})
export class AdoptionPage implements OnInit {
  searchText: string = '';
  filters: string[] = ['All', 'Dog', 'Cat', 'Other'];
  selectedFilter: string = 'All';
  pets: Pet[] = [];

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
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
        favorite: favoriteIds.includes(p.id),
        // ✅ use first photo from array or fallback
        image: Array.isArray(p.photos) && p.photos.length > 0 
          ? p.photos[0] 
          : 'assets/default-pet.jpg'
      }));
    } catch (err) {
      console.error(err);
      this.showToast('Failed to load pets.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  applyFilter(cat: string) {
    this.selectedFilter = cat;
  }

  filteredPets(): Pet[] {
    return this.pets.filter(
      pet =>
        (this.selectedFilter === 'All' || pet.species === this.selectedFilter) &&
        pet.petName.toLowerCase().includes(this.searchText.toLowerCase())
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
    } catch (err) {
      console.error(err);
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
}
