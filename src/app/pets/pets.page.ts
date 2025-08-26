import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { register } from 'swiper/element/bundle';

// Register Swiper web components
register();

interface Category {
  id: string;
  name: string;
  image: string;
}

@Component({
  selector: 'app-pets',
  templateUrl: './pets.page.html',
  styleUrls: ['./pets.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PetsPage implements OnInit {
  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10,
    autoplay: { delay: 3000 },
    loop: true,
    pagination: { clickable: true },
    navigation: true,
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  };

  categories: Category[] = [
    { id: 'dogs', name: 'Dogs', image: 'assets/img/dog.jpg' },
    { id: 'cats', name: 'Cats', image: 'assets/img/cat.jpg' },
    { id: 'birds', name: 'Birds', image: 'assets/img/bird.jpg' },
    { id: 'others', name: 'Others', image: 'assets/img/rabbit.jpg' }
  ];

  constructor() {}

  ngOnInit() {
    console.log('PetsPage initialized');
  }
}
