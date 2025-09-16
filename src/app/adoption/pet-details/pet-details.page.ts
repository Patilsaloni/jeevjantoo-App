import { Component,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-pet-details',
  templateUrl: './pet-details.page.html',
  styleUrls: ['./pet-details.page.scss'],
  standalone: true,
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PetDetailsPage {
  pet = {
    name: 'Sparky',
    breed: 'Golden Retriever',
    age: '8 months old',
    gender: 'Male',
    favorite: false,
    distance: '2.5 km',
    gallery: [
      'assets/img/dog1.jpg',
      'assets/img/dog2.jpg',
      'assets/img/dog3.jpg',
      'assets/img/dog4.jpg',
    ],
    about: `She is shy at first, but will warm up when she's comfortable. She is not a ranch dog that guards animals and property as she would rather be with her people, but she is comfortable around animals. She plays well with other dogs.`
  };
  selectedImage = 0;

  toggleFavorite() {
    this.pet.favorite = !this.pet.favorite;
  }
}
