import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface Pet {
  name: string;
  breed: string;
  age: number;
  gender: string;
  image: string | null;
}

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.page.html',
  styleUrls: ['./adoption.page.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, CommonModule]
})
export class AdoptionPage implements OnInit {
  pet: Pet = {
    name: '',
    breed: '',
    age: 0,
    gender: '',
    image: null
  };

  constructor() {}

  ngOnInit() {
    console.log('AdoptionPage initialized');
  }

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

  submitPet() {
    console.log('Pet submitted:', this.pet);
    // Add backend submission logic here
  }
}