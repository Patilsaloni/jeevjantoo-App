import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DashboardPage {
  categories = [
    { name: 'All', icon: 'fa-paw' },
    { name: 'Dogs', icon: 'fa-dog' },
    { name: 'Cats', icon: 'fa-cat' },
    { name: 'Rabbits', icon: 'fa-carrot' },
    { name: 'Birds', icon: 'fa-dove' }
  ];

  pets = [
    { name: 'Buddy', type: 'Dog', age: '2 years', image: 'assets/img/dog.jpg' },
    { name: 'Whiskers', type: 'Cat', age: '1 year', image: 'assets/img/cat.jpg' },
    { name: 'Fluffy', type: 'Rabbit', age: '1.5 years', image: 'assets/img/rabbit.jpg' },
    { name: 'Tweety', type: 'Bird', age: '6 months', image: 'assets/img/bird.jpg' }
  ];

  filteredPets = [...this.pets];

  filterPets(category: string) {
    if (category === 'All') {
      this.filteredPets = [...this.pets];
    } else {
      this.filteredPets = this.pets.filter(pet => pet.type === category);
    }
  }
}