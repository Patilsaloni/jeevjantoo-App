import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PetDetailsPage } from './pet-details/pet-details.page'; // Import PetDetailsPage
import { Router } from '@angular/router';

interface Pet {
  name: string;
  breed: string;
  age: number;
  gender: string;
  image: string | null;
  category: string; // For filtering by category
   favorite?: boolean; // track favorite state
}

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.page.html',
  styleUrls: ['./adoption.page.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, CommonModule], // add PetMapComponent here if needed
})
export class AdoptionPage implements OnInit {
  searchText: string = '';
  filters: string[] = ['All', 'Dogs', 'Cats', 'Birds'];
  selectedFilter: string = 'All';

  pets: Pet[] = [
    {
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'Male',
      image: 'assets/dog.jpg',
      category: 'Dogs',
    },
    {
      name: 'Mittens',
      breed: 'Persian Cat',
      age: 2,
      gender: 'Female',
      image: 'assets/cat.jpg',
      category: 'Cats',
    },
    {
      name: 'Tweety',
      breed: 'Parrot',
      age: 1,
      gender: 'Female',
      image: 'assets/bird.jpg',
      category: 'Birds',
    },
  ];

  // For new pet submission
  pet: Pet = {
    name: '',
    breed: '',
    age: 0,
    gender: '',
    image: null,
    category: 'Dogs',
    
  };

  favorites: Pet[] = []; // bookmarked pets

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('AdoptionPage initialized ✅');
  }

  // Apply category filter
  applyFilter(cat: string) {
    this.selectedFilter = cat;
  }

  // Show category icon
  getCategoryIcon(cat: string): string {
    switch (cat) {
      case 'Dogs':
        return 'assets/icons/dog.png';
      case 'Cats':
        return 'assets/icons/cat.png';
      case 'Birds':
        return 'assets/icons/bird.png';
      default:
        return 'assets/icons/all.png';
    }
  }

  // Filter pets by search + category
  filteredPets(): Pet[] {
    return this.pets.filter(
      (pet) =>
        (this.selectedFilter === 'All' ||
          pet.category === this.selectedFilter) &&
        pet.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Bookmark pet
  bookmarkPet(pet: Pet) {
    if (!this.favorites.includes(pet)) {
      this.favorites.push(pet);
      console.log('Bookmarked pet:', pet);
    } else {
      console.warn('Already bookmarked:', pet.name);
    }
  }

  // Handle image upload
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pet.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Submit new pet
  submitPet() {
    if (this.pet.name.trim() && this.pet.breed.trim()) {
      this.pets.push({ ...this.pet });
      console.log('Pet submitted:', this.pet);

      // Reset form
      this.pet = {
        name: '',
        breed: '',
        age: 0,
        gender: '',
        image: null,
        category: 'Dogs',
      };
    } else {
      console.warn('⚠️ Please fill all required fields');
    }
  }

 openPetDetails(pet: Pet) {
    this.router.navigate(['/adoption/pet-details', pet.name]);
  }

  toggleFavorite(pet: Pet, event: MouseEvent) {
    event.stopPropagation(); // Prevent card click
    pet.favorite = !pet.favorite;
  }

  newAdoptionNavigation() {
    this.router.navigate(['/tabs/adoption/submit-pet']);
  }

  
}
