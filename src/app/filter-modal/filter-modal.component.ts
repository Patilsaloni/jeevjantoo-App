// import { Component, Input } from '@angular/core';
// import { IonicModule, ModalController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-filter-modal',
//   templateUrl: './filter-modal.component.html',
//   styleUrls: ['./filter-modal.component.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule]
// })
// export class FilterModalComponent {
//   @Input() filterTitle: string = 'Filter'; // Dynamic title per page
//   @Input() filterType: string = 'pet';
//   @Input() filters: { [key: string]: string | string[] | boolean } = {};
//   @Input() filterConfig: Array<{
//     key: string;
//     label: string;
//     type: 'dropdown' | 'chips' | 'toggle';
//     options?: string[] | { [key: string]: string[] };
//     dependsOn?: string;
//     priority?: number; // Optional: for ordering main/secondary fields
//   }> = [];

//   // Separate main and secondary chip fields for UI layout
//   get mainChipField() {
//     return this.filterConfig.find(f => f.type === 'chips' && f.priority === 1);
//   }

//   get secondaryChipField() {
//     return this.filterConfig.find(f => f.type === 'chips' && f.priority === 2);
//   }

//   get otherFields() {
//     return this.filterConfig.filter(f => 
//       f.type !== 'chips' || 
//       (f.type === 'chips' && !this.mainChipField?.key && !this.secondaryChipField?.key) ||
//       (f.priority !== 1 && f.priority !== 2)
//     );
//   }

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

//   resetFilters() {
//     this.filters = this.filterConfig.reduce((acc, field) => {
//       acc[field.key] = field.type === 'chips' ? [] : (field.type === 'toggle' ? false : '');
//       return acc;
//     }, {} as { [key: string]: string | string[] | boolean });
//     this.applyFilters();
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
  @Input() filterTitle: string = 'Filter';
  @Input() filterType: string = 'pet';
  @Input() filters: { [key: string]: string | string[] | boolean } = {
    species: [],
    gender: [],
    age: [], // Changed to age
    city: '',
    area: '',
    vaccinated: false,
    dewormed: false,
    neutered: false
  };
  @Input() filterConfig: Array<{
    key: string;
    label: string;
    type: 'dropdown' | 'chips' | 'toggle';
    options?: string[] | { [key: string]: string[] };
    dependsOn?: string;
    priority?: number;
  }> = [];

  get mainChipField() {
    return this.filterConfig.find(f => f.type === 'chips' && f.priority === 1);
  }

  get secondaryChipField() {
    return this.filterConfig.find(f => f.type === 'chips' && f.priority === 2);
  }

  get otherFields() {
    return this.filterConfig.filter(f => 
      f.type !== 'chips' || 
      (!this.mainChipField?.key && !this.secondaryChipField?.key) ||
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