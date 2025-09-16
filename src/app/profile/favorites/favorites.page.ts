import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../app/services/firebase.service';
import { Pet } from '../../models/pet.model';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FavoritesPage implements OnInit {
  favoritePets: Pet[] = [];
  filteredFavorites: Pet[] = [];

  searchQuery: string = '';
  selectedFilter: string = 'all';
  viewMode: string = 'list';

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadFavorites();
  }

  async loadFavorites() {
    try {
      // Get favorite pets from Firebase (full pet objects)
      const favPets: Pet[] = await this.firebaseService.getFavoritePets('pet-adoption');

      // Map favorite pets safely
      this.favoritePets = favPets.map(p => ({
        id: p.id,
        petName: p.petName || 'Unknown',
        breed: p.breed || 'Unknown',
        age: p.age || 0,
        gender: p.gender || '',
        image: p.image || 'assets/default-pet.jpg',
        category: p.category || 'Unknown',
        favorite: true,
        contact: p.contact || '',       
        location: p.location || 'Not available',
        remarks: p.remarks || '',
        timings: p.timings || 'Not available',
      }));

      this.applyFilters();
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  }

  applyFilters() {
    this.filteredFavorites = this.favoritePets.filter(pet => {
      const matchesSearch =
        pet.petName.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesFilter =
        this.selectedFilter === 'all' || pet.category === this.selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }

  call(phone?: string) {
    if (phone) window.open(`tel:${phone}`, '_system');
  }

  whatsapp(phone?: string) {
    if (phone) window.open(`https://wa.me/${phone}`, '_system');
  }

  share(pet: Pet) {
    const text = `Check out this ${pet.category}: ${pet.petName}`;
    if (navigator.share) {
      navigator.share({ title: pet.petName, text, url: window.location.href });
    } else {
      alert('Sharing not supported');
    }
  }

  async removeFavorite(pet: Pet) {
    if (!pet) return;

    // Update local array
    this.favoritePets = this.favoritePets.filter(p => p.id !== pet.id);
    this.applyFilters();

    try {
      // Pass full pet object to Firebase
      await this.firebaseService.setFavorite('pet-adoption', pet, false);
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  }
}
