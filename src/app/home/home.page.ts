// import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { NavController, IonicModule } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { DirectoryService } from 'src/app/services/directory.service';
// import { AdoptionService } from '../services/adoption.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './home.page.html',
//   styleUrls: ['./home.page.scss'],
//   standalone: true,
//   imports: [CommonModule, IonicModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA]
// })
// export class HomePage implements OnInit {

//   stats = [
//     { title: 'Clinics', value: 0 },
//     { title: 'NGOs', value: 0 },
//     { title: 'Adoptions', value: 0 },
//     { title: 'Events', value: 0 }
//   ];

//   tiles = [
//      { label: 'Clinics', svgPath: 'assets/icons/clinic.svg', bgColor: '#fff9db', route: 'clinics', type: 'Clinics' },    // pale yellow
//   { label: 'NGOs', svgPath: 'assets/icons/ngo.svg', bgColor: '#e9f4f0', route: 'ngos', type: 'NGOs' },              // very light teal
//   { label: 'Ambulance', svgPath: 'assets/icons/ambulance.svg', bgColor: '#fff0f0', route: 'ambulance' },             // pale pink
//   { label: 'Boarding', svgPath: 'assets/icons/boarding.svg', bgColor: '#faf5ea', route: 'boarding' },                // very light beige
//   { label: 'Govt Helpline', svgPath: 'assets/icons/helpline.svg', bgColor: '#e2efff', route: 'ghelpline' },           // pale blue
//   { label: 'Feeding', svgPath: 'assets/icons/feeding.svg', bgColor: '#f4f4f4', route: 'feeding' },                    // very light gray
//   { label: 'Insurance', svgPath: 'assets/icons/insurance.svg', bgColor: '#edf5ff', route: 'insurance' }              // soft sky blue
// ];

//   categories = [
//     { name: 'Dogs', icon: 'paw-outline', route: 'dogs', imageUrl: 'assets/img/dogs.jpg' },
//     { name: 'Cats', icon: 'paw-outline', route: 'cats', imageUrl: 'assets/img/cats.jpg' },
//     { name: 'Birds', icon: 'paw-outline', route: 'birds', imageUrl: 'assets/img/birds.jpg' },
//     { name: 'Rabbits', icon: 'paw-outline', route: 'rabbits', imageUrl: 'assets/img/rabbits.jpg' },
//     { name: 'Small Pets', icon: 'paw-outline', route: 'small-pets', imageUrl: 'assets/img/hamster.jpg' }
//   ];

//   featuredPets = [
//     { id: 1, name: 'Buddy', breed: 'Golden Retriever', age: '2 years', photos: ['assets/img/buddy.jpg'] },
//     { id: 2, name: 'Lucy', breed: 'Siamese', age: '1 year', photos: ['assets/img/lucy.jpg'] },
//     { id: 3, name: 'Max', breed: 'German Shepherd', age: '3 years', photos: ['assets/img/max.jpg'] },
//     { id: 4, name: 'Mochi', breed: 'Shiba Inu', age: '1 year', photos: ['assets/img/mochi.jpg'] }
//   ];

//   latestAdoptions: any[] = [];
//   loadingStats = true;
//   loadingAdoptions = true;

//   bannerOptions = { slidesPerView: 1, loop: true, autoplay: true };
//   tilesOptions = { slidesPerView: 2.5, spaceBetween: 15, freeMode: true };
//   carouselOptions = { slidesPerView: 1.2, spaceBetween: 15, loop: true, centeredSlides: true };

//   constructor(
//     private directoryService: DirectoryService,
//     private adoptionService: AdoptionService,
//     private navCtrl: NavController,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.loadLatestAdoptions();
//   }

//   loadLatestAdoptions() {
//     this.loadingAdoptions = true;
//     this.adoptionService.getAdoptions({ page: 1 }).subscribe({
//       next: (res: any) => {
//         this.latestAdoptions = res.data
//           ? res.data.slice(0, 5).map((pet: any) => ({
//               ...pet,
//               photos: pet.photos && pet.photos.length ? pet.photos : ['assets/placeholder-pet.jpg'],
//               age: pet.age || { value: '-', unit: '' },
//               gender: pet.gender || 'Unknown'
//             }))
//           : [];
//         this.loadingAdoptions = false;
//       },
//       error: () => {
//         this.latestAdoptions = [];
//         this.loadingAdoptions = false;
//       }
//     });
//   }

//   // Navigate to a directory page dynamically
//   goToDirectory(route: string, type?: string) {
//     const path = `/tabs/directory/${route}`;
//     if (type) {
//       this.router.navigate([path], { queryParams: { type } });
//     } else {
//       this.router.navigate([path]);
//     }
//   }

//   goToAdoptions() {
//     this.router.navigate(['/tabs/adoptions']);
//   }

//   goToAdoptionDetail(pet: any) {
//     this.router.navigate([`/tabs/adoption-detail/${pet.id}`]);
//   }

//   navigateToDirectory() {
//     this.router.navigate(['/tabs/directory']);
//   }

// }


import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DirectoryService } from 'src/app/services/directory.service';
import { AdoptionService } from '../services/adoption.service';
import { FirebaseService } from 'src/app/services/firebase.service'; // Import FirebaseService
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
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
    { label: 'Clinics', svgPath: 'assets/icons/clinic.svg', bgColor: '#fff9db', route: 'clinics', type: 'Clinics' },
    { label: 'NGOs', svgPath: 'assets/icons/ngo.svg', bgColor: '#e9f4f0', route: 'ngos', type: 'NGOs' },
    { label: 'Ambulance', svgPath: 'assets/icons/ambulance.svg', bgColor: '#fff0f0', route: 'ambulance' },
    { label: 'Boarding', svgPath: 'assets/icons/boarding.svg', bgColor: '#faf5ea', route: 'boarding' },
    { label: 'Govt Helpline', svgPath: 'assets/icons/helpline.svg', bgColor: '#e2efff', route: 'ghelpline' },
    { label: 'Feeding', svgPath: 'assets/icons/feeding.svg', bgColor: '#f4f4f4', route: 'feeding' },
    { label: 'Insurance', svgPath: 'assets/icons/insurance.svg', bgColor: '#edf5ff', route: 'insurance' }
  ];

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

  latestAdoptions: any[] = [];
  loadingStats = true;
  loadingAdoptions = true;

  bannerOptions = { slidesPerView: 1, loop: true, autoplay: true };
  tilesOptions = { slidesPerView: 2.5, spaceBetween: 15, freeMode: true };
  carouselOptions = { slidesPerView: 1.2, spaceBetween: 15, loop: true, centeredSlides: true };

  constructor(
    private directoryService: DirectoryService,
    private adoptionService: AdoptionService,
    private firebaseService: FirebaseService, // Add FirebaseService
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLatestAdoptions();
  }

  async loadLatestAdoptions() {
    this.loadingAdoptions = true;
    try {
      const res = await this.firebaseService.getInformation('pet-adoption');
      this.latestAdoptions = res
        .filter((pet: any) => pet.status?.toLowerCase() === 'active') // Filter by status 'Active'
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)) // Sort by createdAt descending
        .slice(0, 5) // Limit to 5
        .map((pet: any) => {
          // Format age as "X years, Y months" or "Y months" if no years
          let ageDisplay = '';
          const years = Number(pet.ageYears) || 0;
          const months = Number(pet.ageMonths) || 0;
          if (years > 0 && months > 0) {
            ageDisplay = `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
          } else if (years > 0) {
            ageDisplay = `${years} year${years > 1 ? 's' : ''}`;
          } else if (months > 0) {
            ageDisplay = `${months} month${months > 1 ? 's' : ''}`;
          } else {
            ageDisplay = 'Unknown';
          }

          return {
            id: pet.id,
            name: pet.petName || 'Unknown',
            breed: pet.breed || 'Unknown',
            age: ageDisplay,
            photos: pet.photos && pet.photos.length ? pet.photos : ['assets/placeholder-pet.jpg'],
            gender: pet.gender || 'Unknown'
          };
        });
      console.log('Latest adoptions:', this.latestAdoptions); // Debug
      this.loadingAdoptions = false;
    } catch (error) {
      console.error('Error fetching adoptions:', error);
      this.latestAdoptions = [];
      this.loadingAdoptions = false;
    }
  }
  
  // async loadLatestAdoptions() {
  //   this.loadingAdoptions = true;
  //   try {
  //     const res = await this.firebaseService.getInformation('pet-adoption'); // Use FirebaseService
  //     this.latestAdoptions = res
  //       .filter((pet: any) => pet.status?.toLowerCase() === 'pending') // Filter by status 'Pending'
  //       .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)) // Sort by createdAt descending
  //       .slice(0, 5) // Limit to 5
  //       .map((pet: any) => ({
  //         id: pet.id,
  //         name: pet.petName || 'Unknown',
  //         breed: pet.breed || 'Unknown',
  //         age: pet.age ? `${pet.age} years` : 'Unknown',
  //         photos: pet.photos && pet.photos.length ? pet.photos : ['assets/placeholder-pet.jpg'],
  //         gender: pet.gender || 'Unknown'
  //       }));
  //     console.log('Latest adoptions:', this.latestAdoptions); // Debug
  //     this.loadingAdoptions = false;
  //   } catch (error) {
  //     console.error('Error fetching adoptions:', error);
  //     this.latestAdoptions = [];
  //     this.loadingAdoptions = false;
  //   }
  // }

  // Commented-out AdoptionService version (unchanged, kept as fallback)
  // loadLatestAdoptions() {
  //   this.loadingAdoptions = true;
  //   this.adoptionService.getAdoptions({ page: 1 }).subscribe({
  //     next: (res: any) => {
  //       this.latestAdoptions = res.data
  //         ? res.data.slice(0, 5).map((pet: any) => ({
  //             ...pet,
  //             photos: pet.photos && pet.photos.length ? pet.photos : ['assets/placeholder-pet.jpg'],
  //             age: pet.age || { value: '-', unit: '' },
  //             gender: pet.gender || 'Unknown'
  //           }))
  //         : [];
  //       this.loadingAdoptions = false;
  //     },
  //     error: () => {
  //       this.latestAdoptions = [];
  //       this.loadingAdoptions = false;
  //     }
  //   });
  // }

  goToDirectory(route: string, type?: string) {
    const path = `/tabs/directory/${route}`;
    if (type) {
      this.router.navigate([path], { queryParams: { type } });
    } else {
      this.router.navigate([path]);
    }
  }

  goToAdoptions() {
    this.router.navigate(['/tabs/adoptions']);
  }

  goToAdoptionDetail(pet: any) {
    this.router.navigate([`/tabs/adoption-detail/${pet.id}`]);
  }

  navigateToDirectory() {
    this.router.navigate(['/tabs/directory']);
  }
}