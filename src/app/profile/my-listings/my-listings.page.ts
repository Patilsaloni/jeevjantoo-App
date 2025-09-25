import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonicModule,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';
import { EditAdoptionComponent } from './edit-adoption/edit-adoption.component'; // Import the new component (adjust path if needed)
interface Pet {
  id: string;
  petName: string;
  species: string; // code: dog/cat/bird/fish/rabbit/other
  gender: 'Male' | 'Female' | 'Unknown';
  ageYears?: number;
  ageMonths?: number;
  ageInMonths: number;
  breed: string;
  health?: string | null;
  temperament?: string | null;
  location: string;
  contactName?: string;
  contactPhone?: string;
  contactPublic?: boolean;
  description: string;
  photos: string[];
  status: 'Pending' | 'Active' | 'Inactive' | 'Adopted';
  createdAt: Timestamp;
  submitterUid: string;
}

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.page.html',
  styleUrls: ['./my-listings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MyListingsPage implements OnInit {
  pets: Pet[] = [];
  openedAccordionId: string | null = null;

  speciesOptions = [
    { code: 'dog', label: 'Dog 🐶' },
    { code: 'cat', label: 'Cat 🐱' },
    { code: 'bird', label: 'Bird 🐦' },
    { code: 'fish', label: 'Fish 🐟' },
    { code: 'rabbit', label: 'Rabbit 🐰' },
    { code: 'other', label: 'Other' },
  ];

  constructor(
    private firebaseService: FirebaseService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading your listings...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const user = this.firebaseService.getCurrentUser();
      if (user) {
        this.pets = await this.firebaseService.getUserPets(user.uid);
      } else {
        console.warn('No user logged in');
        // Optionally redirect to sign-in
      }
    } catch (error) {
      console.error('Error fetching user pets:', error);
    } finally {
      await loading.dismiss();
    }
  }

  toggleAccordion(id: string) {
    this.openedAccordionId = this.openedAccordionId === id ? null : id;
  }
  isAccordionOpen(id: string) {
    return this.openedAccordionId === id;
  }

  // editPet(pet: Pet) {
  //   // Navigate to the edit pet page with pet id as parameter
  //   this.router.navigate(['/edit-pet', pet.id]);
  // }

  async editPet(pet: Pet) {
  if (!pet || !pet.id) {
    console.error('Invalid pet data:', pet);
    return;
  }
  console.log('Pet data being passed to modal:', JSON.stringify(pet, null, 2)); // Detailed debug log
  const modal = await this.modalCtrl.create({
    component: EditAdoptionComponent,
    componentProps: { pet },
  });
  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data?.updated) {
    const user = this.firebaseService.getCurrentUser();
    if (user) {
      this.pets = await this.firebaseService.getUserPets(user.uid);
    }
  }
}

  getSpeciesLabel(code: string): string {
    const option = this.speciesOptions.find((o) => o.code === code);
    return option ? option.label : code;
  }

  getAgeDisplay(pet: Pet): string {
    const years = pet.ageYears || 0;
    const months = pet.ageMonths || 0;
    let display = '';
    if (years > 0) display += `${years} year${years > 1 ? 's' : ''} `;
    if (months > 0) display += `${months} month${months > 1 ? 's' : ''}`;
    return display.trim() || 'Unknown';
  }
}
