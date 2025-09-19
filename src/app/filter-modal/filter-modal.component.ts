import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Filter Pets</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Close</ion-button>
          <ion-button (click)="applyFilters()" color="primary">Apply</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Species Filter (Chips) -->
      <ion-item>
        <ion-label>Species</ion-label>
      </ion-item>
      <ion-chip
        *ngFor="let species of speciesOptions"
        [color]="filters.species.includes(species) ? 'primary' : 'light'"
        (click)="toggleSpecies(species)"
      >
        <ion-label>{{ species | titlecase }}</ion-label>
      </ion-chip>

      <!-- Gender Filter (Chips) -->
      <ion-item>
        <ion-label>Gender</ion-label>
      </ion-item>
      <ion-chip
        *ngFor="let gender of genderOptions"
        [color]="filters.gender.includes(gender) ? 'primary' : 'light'"
        (click)="toggleGender(gender)"
      >
        <ion-label>{{ gender | titlecase }}</ion-label>
      </ion-chip>

      <!-- City/Area Filter (Dropdowns) -->
      <ion-item>
        <ion-label>City</ion-label>
        <ion-select [(ngModel)]="filters.city" (ionChange)="onCityChange($event)" placeholder="Select City">
          <ion-select-option *ngFor="let city of cities" [value]="city">{{ city }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item *ngIf="filters.city && areas[filters.city]?.length">
        <ion-label>Area</ion-label>
        <ion-select [(ngModel)]="filters.area" placeholder="Select Area">
          <ion-select-option *ngFor="let area of areas[filters.city]" [value]="area">{{ area }}</ion-select-option>
        </ion-select>
      </ion-item>

      <!-- Vaccination Filter (Toggle) -->
      <ion-item>
        <ion-label>Vaccinated</ion-label>
        <ion-toggle [(ngModel)]="filters.vaccinated"></ion-toggle>
      </ion-item>
    </ion-content>
  `,
  styles: [`
    ion-chip {
      margin: 8px;
      cursor: pointer;
    }
    ion-item {
      margin-top: 16px;
    }
  `],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FilterModalComponent {
  // Filter options
  speciesOptions = ['dog', 'cat', 'other'];
  genderOptions = ['male', 'female', 'unknown'];
  cities = ['New York', 'Los Angeles', 'Chicago']; // Replace with your city data
  areas: { [key: string]: string[] } = {
    'New York': ['Manhattan', 'Brooklyn', 'Queens'],
    'Los Angeles': ['Downtown', 'Hollywood', 'Santa Monica'],
    'Chicago': ['Loop', 'Lincoln Park', 'Hyde Park']
  }; // Replace with your city/area data

  // Filter state
  filters = {
    species: [] as string[],
    gender: [] as string[],
    city: '',
    area: '',
    vaccinated: false
  };

  constructor(private modalController: ModalController) {}

  toggleSpecies(species: string) {
    const index = this.filters.species.indexOf(species);
    if (index > -1) {
      this.filters.species.splice(index, 1);
    } else {
      this.filters.species.push(species);
    }
  }

  toggleGender(gender: string) {
    const index = this.filters.gender.indexOf(gender);
    if (index > -1) {
      this.filters.gender.splice(index, 1);
    } else {
      this.filters.gender.push(gender);
    }
  }

  onCityChange(event: any) {
    this.filters.area = ''; // Reset area when city changes
  }

  dismiss() {
    this.modalController.dismiss();
  }

  applyFilters() {
    this.modalController.dismiss(this.filters);
  }
}