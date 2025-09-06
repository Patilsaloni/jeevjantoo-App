import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DirectoryService } from 'src/app/services/directory.service';
import { AdoptionService } from '../services/adoption.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {

  stats = [
    { title: 'Clinics', value: 0 },
    { title: 'NGOs', value: 0 },
    { title: 'Adoptions', value: 0 },
    { title: 'Events', value: 0 }
  ];

  tiles = [
    { label: 'Clinics', icon: 'medkit-outline', route: 'clinics', type: 'Clinics' },
    { label: 'NGOs', icon: 'people-outline', route: 'ngos', type: 'NGOs' },
    { label: 'Ambulance', icon: 'car-outline', route: 'ambulance' },
    { label: 'Boarding', icon: 'home-outline', route: 'boarding' },
    { label: 'Govt Helpline', icon: 'call-outline', route: 'ghelpline' },
    { label: 'Feeding', icon: 'restaurant-outline', route: 'feeding' },
    { label: 'Insurance', icon: 'shield-checkmark-outline', route: 'insurance' },
    { label: 'Adoption', icon: 'paw-outline', route: 'adoptions' }
  ];

  // Variables for HTML use
  categories = [
  { name: 'Dogs', icon: 'paw-outline', route: 'dogs', imageUrl: 'assets/img/dogs.jpg' },
  { name: 'Cats', icon: 'paw-outline', route: 'cats', imageUrl: 'assets/img/cats.jpg' },
  { name: 'Birds', icon: 'paw-outline', route: 'birds', imageUrl: 'assets/img/birds.jpg' },
  { name: 'Rabbits', icon: 'paw-outline', route: 'rabbits', imageUrl: 'assets/img/rabbits.jpg' },
  { name: 'Small Pets', icon: 'paw-outline', route: 'small-pets', imageUrl: 'assets/img/hamster.jpg' }
];


  featuredPets = [
    { id: 1, name: 'Buddy', breed: 'Golden Retriever', age: '2 years', photos: ['assets/img/buddy.jpg'] },
    { id: 2, name: 'Lucy', breed: 'Siamese', age: '1 year', photos: ['assets/img/lucy.jpg'] },
    { id: 3, name: 'Max', breed: 'German Shepherd', age: '3 years', photos: ['assets/img/max.jpg'] },
    { id: 4, name: 'Mochi', breed: 'Shiba Inu', age: '1 year', photos: ['assets/img/mochi.jpg'] }
  ];

  adoptionPets = this.featuredPets.slice(0, 3);

  latestAdoptions: any[] = [];
  loadingStats = true;
  loadingAdoptions = true;

  // Ionic ion-slides options
  bannerOptions = {
    slidesPerView: 1,
    loop: true,
    autoplay: true
  };

  tilesOptions = {
    slidesPerView: 2.5,
    spaceBetween: 15,
    freeMode: true
  };

  carouselOptions = {
    slidesPerView: 1.2,
    spaceBetween: 15,
    loop: true,
    centeredSlides: true
  };

  banners = [1, 2, 3]; // banner images
  carouselItems = [1, 2, 3, 4]; // featured carousel images

  constructor(
    private directoryService: DirectoryService,
    private adoptionService: AdoptionService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadLatestAdoptions();
  }

  loadStats() {
    this.loadingStats = true;
    this.directoryService.getCounts().subscribe({
      next: (res: any) => {
        this.stats[0].value = res.clinics ?? 0;
        this.stats[1].value = res.ngos ?? 0;
        this.stats[2].value = res.adoptions ?? 0;
        this.stats[3].value = res.events ?? 0;
        this.loadingStats = false;
      },
      error: (err: any) => {
        console.error('Error loading stats', err);
        this.stats.forEach(stat => stat.value = 0);
        this.loadingStats = false;
      }
    });
  }

  loadLatestAdoptions() {
    this.loadingAdoptions = true;
    this.adoptionService.getAdoptions({ page: 1 }).subscribe({
      next: (res: any) => {
        this.latestAdoptions = res.data
          ? res.data.slice(0, 5).map((pet: any) => ({
              ...pet,
              photos: pet.photos && pet.photos.length ? pet.photos : ['assets/placeholder-pet.jpg'],
              age: pet.age || { value: '-', unit: '' },
              gender: pet.gender || 'Unknown'
            }))
          : [];
        this.loadingAdoptions = false;
      },
      error: (err: any) => {
        console.error('Error loading adoptions', err);
        this.latestAdoptions = [];
        this.loadingAdoptions = false;
      }
    });
  }

  goToDirectory(route: string, type?: string) {
    if (type) {
      this.router.navigate([`/${route}`], { queryParams: { type } });
    } else {
      this.router.navigate([`/${route}`]);
    }
  }

  goToAdoptions() {
    this.router.navigate(['/adoptions']);
  }

  goToAdoptionDetail(pet: any) {
    this.router.navigate([`/adoption-detail/${pet.id}`]);
  }

  goToTab(tab: string) {
    this.router.navigate([`/${tab}`]);
  }
}
