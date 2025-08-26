import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { register } from 'swiper/element/bundle';

// Register Swiper web components
register();

interface Pet {
  name: string;
  breed: string;
  age: number;
  category: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardPage implements OnInit, AfterViewInit {
  @ViewChild('categorySwiper', { static: false }) categorySwiper!: any;

  swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 10,
    pagination: false,
    navigation: false,
    breakpoints: {
      320: { slidesPerView: 2 },
      640: { slidesPerView: 3 },
      1024: { slidesPerView: 5 }
    }
  };

  pets: Pet[] = [
    { name: 'Buddy', breed: 'Labrador', age: 2, category: 'dogs', image: 'assets/img/dog.jpg' },
    { name: 'Whiskers', breed: 'Siamese', age: 1, category: 'cats', image: 'assets/img/cat.jpg' },
    { name: 'Polly', breed: 'Parrot', age: 3, category: 'birds', image: 'assets/img/bird.jpg' },
    { name: 'Bunny', breed: 'Rabbit', age: 1, category: 'others', image: 'assets/img/rabbit.jpg' }
  ];

  categories: Category[] = [
    { id: 'all', name: 'All', icon: 'paw-outline' },
    { id: 'dogs', name: 'Dogs', icon: 'dog-outline' },
    { id: 'cats', name: 'Cats', icon: 'cat-outline' },
    { id: 'birds', name: 'Birds', icon: 'bird-outline' },
    { id: 'others', name: 'Others', icon: 'paw-outline' }
  ];

  filteredPets: Pet[] = [...this.pets];
  activeCategory: string = 'all';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('DashboardPage initialized');
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category && category !== 'all') {
        this.filteredPets = this.pets.filter(pet => pet.category === category);
        this.activeCategory = category;
      } else {
        this.filteredPets = [...this.pets];
        this.activeCategory = 'all';
      }
    });
  }

  ngAfterViewInit() {
    if (this.categorySwiper) {
      Object.assign(this.categorySwiper, this.swiperConfig);
      this.categorySwiper.initialize();
    }
  }

  onCategoryChange(categoryId: string, index: number) {
    this.activeCategory = categoryId;
    if (categoryId === 'all') {
      this.filteredPets = [...this.pets];
    } else {
      this.filteredPets = this.pets.filter(pet => pet.category === categoryId);
    }
    if (this.categorySwiper) {
      this.categorySwiper.slideTo(index);
    }
  }
}