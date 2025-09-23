// // import { Component } from '@angular/core';
// // import { IonicModule, ModalController } from '@ionic/angular';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';

// // @Component({
// //   selector: 'app-filter-modal',
// //   template: `
// //     <ion-header>
// //       <ion-toolbar>
// //         <ion-title>Filter Pets</ion-title>
// //         <ion-buttons slot="end">
// //           <ion-button (click)="dismiss()">Close</ion-button>
// //           <ion-button (click)="applyFilters()" color="primary">Apply</ion-button>
// //         </ion-buttons>
// //       </ion-toolbar>
// //     </ion-header>

// //     <ion-content class="ion-padding">
// //       <!-- Species Filter (Chips) -->
// //       <ion-item>
// //         <ion-label>Species</ion-label>
// //       </ion-item>
// //       <ion-chip
// //         *ngFor="let species of speciesOptions"
// //         [color]="filters.species.includes(species) ? 'primary' : 'light'"
// //         (click)="toggleSpecies(species)"
// //       >
// //         <ion-label>{{ species | titlecase }}</ion-label>
// //       </ion-chip>

// //       <!-- Gender Filter (Chips) -->
// //       <ion-item>
// //         <ion-label>Gender</ion-label>
// //       </ion-item>
// //       <ion-chip
// //         *ngFor="let gender of genderOptions"
// //         [color]="filters.gender.includes(gender) ? 'primary' : 'light'"
// //         (click)="toggleGender(gender)"
// //       >
// //         <ion-label>{{ gender | titlecase }}</ion-label>
// //       </ion-chip>

// //       <!-- City/Area Filter (Dropdowns) -->
// //       <ion-item>
// //         <ion-label>City</ion-label>
// //         <ion-select [(ngModel)]="filters.city" (ionChange)="onCityChange($event)" placeholder="Select City">
// //           <ion-select-option *ngFor="let city of cities" [value]="city">{{ city }}</ion-select-option>
// //         </ion-select>
// //       </ion-item>
// //       <ion-item *ngIf="filters.city && areas[filters.city]?.length">
// //         <ion-label>Area</ion-label>
// //         <ion-select [(ngModel)]="filters.area" placeholder="Select Area">
// //           <ion-select-option *ngFor="let area of areas[filters.city]" [value]="area">{{ area }}</ion-select-option>
// //         </ion-select>
// //       </ion-item>

// //       <!-- Vaccination Filter (Toggle) -->
// //       <ion-item>
// //         <ion-label>Vaccinated</ion-label>
// //         <ion-toggle [(ngModel)]="filters.vaccinated"></ion-toggle>
// //       </ion-item>
// //     </ion-content>
// //   `,
// //   styles: [`
// //     ion-chip {
// //       margin: 8px;
// //       cursor: pointer;
// //     }
// //     ion-item {
// //       margin-top: 16px;
// //     }
// //   `],
// //   standalone: true,
// //   imports: [IonicModule, CommonModule, FormsModule],
// // })
// // export class FilterModalComponent {
// //   // Filter options
// //   speciesOptions = ['dog', 'cat', 'other'];
// //   genderOptions = ['male', 'female', 'unknown'];
// //   cities = ['New York', 'Los Angeles', 'Chicago']; // Replace with your city data
// //   areas: { [key: string]: string[] } = {
// //     'New York': ['Manhattan', 'Brooklyn', 'Queens'],
// //     'Los Angeles': ['Downtown', 'Hollywood', 'Santa Monica'],
// //     'Chicago': ['Loop', 'Lincoln Park', 'Hyde Park']
// //   }; // Replace with your city/area data

// //   // Filter state
// //   filters = {
// //     species: [] as string[],
// //     gender: [] as string[],
// //     city: '',
// //     area: '',
// //     vaccinated: false
// //   };

// //   constructor(private modalController: ModalController) {}

// //   toggleSpecies(species: string) {
// //     const index = this.filters.species.indexOf(species);
// //     if (index > -1) {
// //       this.filters.species.splice(index, 1);
// //     } else {
// //       this.filters.species.push(species);
// //     }
// //   }

// //   toggleGender(gender: string) {
// //     const index = this.filters.gender.indexOf(gender);
// //     if (index > -1) {
// //       this.filters.gender.splice(index, 1);
// //     } else {
// //       this.filters.gender.push(gender);
// //     }
// //   }

// //   onCityChange(event: any) {
// //     this.filters.area = ''; // Reset area when city changes
// //   }

// //   dismiss() {
// //     this.modalController.dismiss();
// //   }

// //   applyFilters() {
// //     this.modalController.dismiss(this.filters);
// //   }
// // }


// import { Component, Input } from '@angular/core';
// import { IonicModule, ModalController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-filter-modal',
//   template: `
//     <ion-header>
//       <ion-toolbar>
//         <ion-title>Filter {{ filterType | titlecase }}</ion-title>
//         <ion-buttons slot="end">
//           <ion-button (click)="dismiss()">Close</ion-button>
//           <ion-button (click)="applyFilters()" color="primary">Apply</ion-button>
//         </ion-buttons>
//       </ion-toolbar>
//     </ion-header>

//     <ion-content class="ion-padding">
//       <ng-container *ngFor="let field of filterConfig">
//         <!-- Dropdown Field -->
//         <ion-item *ngIf="field.type === 'dropdown'">
//           <ion-label position="stacked">{{ field.label }}</ion-label>
//           <ion-select
//             [(ngModel)]="filters[field.key]"
//             (ionChange)="onFieldChange(field.key)"
//             [placeholder]="'Select ' + field.label"
//             [disabled]="isDisabled(field)"
//           >
//             <ion-select-option value="">{{ 'All ' + field.label + 's' }}</ion-select-option>
//             <ion-select-option *ngFor="let option of getOptions(field)" [value]="option">
//               {{ option }}
//             </ion-select-option>
//           </ion-select>
//         </ion-item>

//         <!-- Chips Field -->
//         <ng-container *ngIf="field.type === 'chips'">
//           <ion-item>
//             <ion-label position="stacked">{{ field.label }}</ion-label>
//           </ion-item>
//           <ion-chip
//             *ngFor="let option of getOptions(field)"
//             [color]="isChipSelected(field.key, option) ? 'primary' : 'light'"
//             (click)="toggleChip(field.key, option)"
//           >
//             <ion-label>{{ option | titlecase }}</ion-label>
//           </ion-chip>
//         </ng-container>

//         <!-- Toggle Field -->
//         <ion-item *ngIf="field.type === 'toggle'">
//           <ion-label>{{ field.label }}</ion-label>
//           <ion-toggle [(ngModel)]="filters[field.key]"></ion-toggle>
//         </ion-item>
//       </ng-container>
//     </ion-content>
//   `,
//   styleUrls: ['./filter-modal.component.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule]
// })
// export class FilterModalComponent {
//   @Input() filterType: string = 'pet';
//   @Input() filters: { [key: string]: string | string[] | boolean } = {};
//   @Input() filterConfig: Array<{
//     key: string;
//     label: string;
//     type: 'dropdown' | 'chips' | 'toggle';
//     options?: string[] | { [key: string]: string[] };
//     dependsOn?: string;
//   }> = [];

//   constructor(private modalController: ModalController) {}

//   isDisabled(field: { dependsOn?: string }): boolean {
//     if (!field.dependsOn) return false;
//     const value = this.filters[field.dependsOn];
//     return !value || (Array.isArray(value) && value.length === 0);
//   }

//   getOptions(field: { key: string; options?: string[] | { [key: string]: string[] }; dependsOn?: string }): string[] {
//     if (!field.options) return [];
//     if (field.dependsOn && this.filters[field.dependsOn]) {
//       const optionsObj = field.options as { [key: string]: string[] };
//       return optionsObj[String(this.filters[field.dependsOn])] || [];
//     }
//     return (field.options as string[]) || [];
//   }

//   isChipSelected(key: string, option: string): boolean {
//     const chips = this.filters[key] as string[] | undefined;
//     return chips?.includes(option) ?? false;
//   }

//   onFieldChange(key: string) {
//     const field = this.filterConfig.find(f => f.key === key);
//     if (field?.dependsOn) {
//       const dependentFields = this.filterConfig.filter(f => f.dependsOn === key);
//       dependentFields.forEach(f => {
//         this.filters[f.key] = f.type === 'chips' ? [] : '';
//       });
//     }
//   }

//   toggleChip(key: string, option: string) {
//     if (!this.filters[key]) this.filters[key] = [];
//     const chips = this.filters[key] as string[];
//     const index = chips.indexOf(option);
//     if (index > -1) {
//       chips.splice(index, 1);
//     } else {
//       chips.push(option);
//     }
//   }

//   dismiss() {
//     this.modalController.dismiss();
//   }

//   applyFilters() {
//     this.modalController.dismiss(this.filters);
//   }
// }


import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FilterModalComponent {
  @Input() filterTitle: string = 'Filter'; // Dynamic title per page
  @Input() filterType: string = 'pet';
  @Input() filters: { [key: string]: string | string[] | boolean } = {};
  @Input() filterConfig: Array<{
    key: string;
    label: string;
    type: 'dropdown' | 'chips' | 'toggle';
    options?: string[] | { [key: string]: string[] };
    dependsOn?: string;
    priority?: number; // Optional: for ordering main/secondary fields
  }> = [];

  // Separate main and secondary chip fields for UI layout
  get mainChipField() {
    return this.filterConfig.find(f => f.type === 'chips' && f.priority === 1);
  }

  get secondaryChipField() {
    return this.filterConfig.find(f => f.type === 'chips' && f.priority === 2);
  }

  get otherFields() {
    return this.filterConfig.filter(f => 
      f.type !== 'chips' || 
      (f.type === 'chips' && !this.mainChipField?.key && !this.secondaryChipField?.key) ||
      (f.priority !== 1 && f.priority !== 2)
    );
  }

  constructor(private modalController: ModalController) {}

  isDisabled(field: { dependsOn?: string }): boolean {
    if (!field.dependsOn) return false;
    const value = this.filters[field.dependsOn];
    return !value || (Array.isArray(value) && value.length === 0);
  }

  getOptions(field: { key: string; options?: string[] | { [key: string]: string[] }; dependsOn?: string }): string[] {
    if (!field.options) return [];
    if (field.dependsOn && this.filters[field.dependsOn]) {
      const optionsObj = field.options as { [key: string]: string[] };
      return optionsObj[String(this.filters[field.dependsOn])] || [];
    }
    return (field.options as string[]) || [];
  }

  isChipSelected(key: string, option: string): boolean {
    const chips = this.filters[key] as string[] | undefined;
    return chips?.includes(option) ?? false;
  }

  onFieldChange(key: string) {
    const field = this.filterConfig.find(f => f.key === key);
    if (field?.dependsOn) {
      const dependentFields = this.filterConfig.filter(f => f.dependsOn === key);
      dependentFields.forEach(f => {
        this.filters[f.key] = f.type === 'chips' ? [] : '';
      });
    }
  }

  toggleChip(key: string, option: string) {
    if (!this.filters[key]) this.filters[key] = [];
    const chips = this.filters[key] as string[];
    const index = chips.indexOf(option);
    if (index > -1) {
      chips.splice(index, 1);
    } else {
      chips.push(option);
    }
  }

  resetFilters() {
    this.filters = this.filterConfig.reduce((acc, field) => {
      acc[field.key] = field.type === 'chips' ? [] : (field.type === 'toggle' ? false : '');
      return acc;
    }, {} as { [key: string]: string | string[] | boolean });
    this.applyFilters();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  applyFilters() {
    this.modalController.dismiss(this.filters);
  }
}