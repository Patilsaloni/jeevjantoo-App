import { Component, OnInit } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DirectoryService } from 'src/app/services/directory.service';
import { AdoptionService } from '../services/adoption.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class DashboardPage implements OnInit {
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

  latestAdoptions: any[] = [];
  loadingStats = true;
  loadingAdoptions = true;

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
    if(type) {
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
}
