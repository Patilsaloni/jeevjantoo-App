import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Pet {
  name: string;
  breed: string;
  age: number;
  category: string;
  image: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class DashboardPage implements OnInit {
  pets: Pet[] = [
    { name: 'Buddy', breed: 'Labrador', age: 2, category: 'dogs', image: 'assets/img/dog.jpg' },
    { name: 'Whiskers', breed: 'Siamese', age: 1, category: 'cats', image: 'assets/img/cat.jpg' },
    { name: 'Polly', breed: 'Parrot', age: 3, category: 'birds', image: 'assets/img/bird.jpg' },
    { name: 'Bunny', breed: 'Rabbit', age: 1, category: 'others', image: 'assets/img/rabbit.jpg' }
  ];

  filteredPets: Pet[] = [...this.pets];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('DashboardPage initialized');
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category && category !== 'all') {
        this.filteredPets = this.pets.filter(pet => pet.category === category);
      } else {
        this.filteredPets = [...this.pets];
      }
    });
  }

  onSegmentChange(event: any) {
    const category = event.detail.value;
    if (category === 'all') {
      this.filteredPets = [...this.pets];
    } else {
      this.filteredPets = this.pets.filter(pet => pet.category === category);
    }
  }
}