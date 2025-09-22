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
  selectedFilter: string = 'all'; // all | clinic | ngo | event (or species/category)
  viewMode: string = 'list';      // list | map

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadFavorites();
  }

  // (optional) refresh whenever page re-enters
  async ionViewWillEnter() {
    await this.loadFavorites();
  }

  async loadFavorites() {
    try {
      const favPets: any[] = await this.firebaseService.getFavoritePets('pet-adoption');

      // Normalize + safe mapping
      this.favoritePets = favPets.map((p: any) => ({
        id: p.id,
        petName: p.petName || 'Unknown',
        breed: p.breed || 'Unknown',
        age: typeof p.age === 'number' ? p.age : 0,
        gender: p.gender || '',
        image: p.image || 'assets/default-pet.jpg',
        // normalize category/species naming for UI filters
        category: (p.category || p.species || 'unknown').toString().toLowerCase(),
        favorite: true,
        contact: p.contact || '',
        location: p.location || 'Not available',
        remarks: p.remarks || '',
        timings: p.timings || 'Not available',
      })) as Pet[];

      this.applyFilters();
    } catch (err) {
      console.error('Error loading favorites:', err);
      this.favoritePets = [];
      this.filteredFavorites = [];
    }
  }

  applyFilters() {
    const q = this.searchQuery.trim().toLowerCase();
    const selected = (this.selectedFilter || 'all').toLowerCase();

    this.filteredFavorites = this.favoritePets.filter((pet) => {
      const hay = `${pet.petName ?? ''} ${pet.breed ?? ''} ${pet.location ?? ''} ${pet.category ?? ''}`.toLowerCase();
      const matchesSearch = q === '' || hay.includes(q);
      const matchesFilter = selected === 'all' || (pet.category ?? '') === selected;
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
    const text = `Check out this ${pet.category || 'pet'}: ${pet.petName}`;
    if ((navigator as any).share) {
      (navigator as any).share({ title: pet.petName, text, url: window.location.href });
    } else {
      alert('Sharing not supported');
    }
  }

  async removeFavorite(pet: Pet) {
    if (!pet?.id) return;

    // optimistic UI
    const prev = [...this.favoritePets];
    this.favoritePets = this.favoritePets.filter((p) => p.id !== pet.id);
    this.applyFilters();

    try {
      // pass ONLY the id (consistent with service)
      await this.firebaseService.setFavorite('pet-adoption', pet.id, false);
    } catch (err) {
      console.error('Error removing favorite:', err);
      // rollback on failure
      this.favoritePets = prev;
      this.applyFilters();
    }
  }
}
