// import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { IonicModule, ToastController, LoadingController, ModalController } from '@ionic/angular';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { FirebaseService } from '../../../services/firebase.service';  // Adjust path if needed
// import { Timestamp } from 'firebase/firestore';

// interface Pet {
//   id: string;
//   petName: string;
//   species: string; // code: dog/cat/bird/fish/rabbit/other
//   gender: 'Male' | 'Female' | 'Unknown';
//   ageYears?: number;
//   ageMonths?: number;
//   ageInMonths: number;
//   breed: string;
//   health?: string | null;
//   temperament?: string | null;
//   location: string;
//   contactName?: string;
//   contactPhone?: string;
//   contactPublic?: boolean;
//   description: string;
//   photos: string[];
//   status: 'Pending' | 'Active' | 'Inactive' | 'Adopted';
//   createdAt: Timestamp;
//   submitterUid: string;
// }

// @Component({
//   selector: 'app-edit-adoption',
//   templateUrl: './edit-adoption.component.html',
//   styleUrls: ['./edit-adoption.component.scss'],  // Create .scss if needed, or reuse from submit-pet
//   standalone: true,
//   imports: [CommonModule, IonicModule, ReactiveFormsModule],
// })
// export class EditAdoptionComponent implements OnInit {
//   @Input() pet!: Pet;  // Passed from modal

//   step = 1;
//   petFormStep1: FormGroup;
//   petFormStep2: FormGroup;

//   speciesOptions = [
//     { code: 'dog', label: 'Dog 🐶' },
//     { code: 'cat', label: 'Cat 🐱' },
//     { code: 'bird', label: 'Bird 🐦' },
//     { code: 'fish', label: 'Fish 🐟' },
//     { code: 'rabbit', label: 'Rabbit 🐰' },
//     { code: 'other', label: 'Other' },
//   ];

//   healthOptions = ['Vaccinated', 'Dewormed', 'Neutered/Spayed'];
//   temperamentOptions = ['Friendly with kids', 'Trained', 'Special needs'];

//   photos: { file: File | null; dataUrl: string }[] = [];
//   imageFileNames: string[] = [];

//   @ViewChild('petImageInput') petImageInput!: ElementRef<HTMLInputElement>;

//   constructor(
//     private firebaseService: FirebaseService,
//     private toastCtrl: ToastController,
//     private loadingCtrl: LoadingController,
//     private fb: FormBuilder,
//     private modalCtrl: ModalController  // For dismissing modal
//   ) {
//     this.petFormStep1 = this.fb.group(
//       {
//         petName: ['', [Validators.required, Validators.minLength(2)]],
//         species: ['', Validators.required],
//         gender: ['', Validators.required],
//         ageYears: [null, [Validators.min(0)]],
//         ageMonths: [null, [Validators.min(0), Validators.max(11)]],
//         breed: ['', [Validators.required, Validators.minLength(2)]],
//         health: [null],
//         temperament: [null],
//         description: ['', [Validators.required, Validators.minLength(10)]],
//       },
//       { validators: this.ageValidator }
//     );

//     this.petFormStep2 = this.fb.group({
//       location: ['', Validators.required],
//       contactName: ['', Validators.minLength(2)],
//       contactPhone: ['', [Validators.pattern(/^\d+$/), Validators.maxLength(10)]],
//       contactPublic: [true],
//     });
//   }

//   ngOnInit() {
//     if (this.pet) {
//       this.petFormStep1.patchValue({
//         petName: this.pet.petName,
//         species: this.pet.species,
//         gender: this.pet.gender,
//         ageYears: this.pet.ageYears,
//         ageMonths: this.pet.ageMonths,
//         breed: this.pet.breed,
//         health: this.pet.health,
//         temperament: this.pet.temperament,
//         description: this.pet.description,
//       });

//       this.petFormStep2.patchValue({
//         location: this.pet.location,
//         contactName: this.pet.contactName,
//         contactPhone: this.pet.contactPhone,
//         contactPublic: this.pet.contactPublic,
//       });

//       // Load existing photos
//       this.photos = this.pet.photos.map(url => ({ file: null, dataUrl: url }));
//       this.updateFileNames();
//     }
//   }

//   get f1() {
//     return this.petFormStep1.controls as any;
//   }
//   get f2() {
//     return this.petFormStep2.controls as any;
//   }

//   private ageValidator(group: AbstractControl): ValidationErrors | null {
//     const yearsCtrl = group.get('ageYears');
//     const monthsCtrl = group.get('ageMonths');
//     const interacted =
//       (!!yearsCtrl && (yearsCtrl.touched || yearsCtrl.dirty)) ||
//       (!!monthsCtrl && (monthsCtrl.touched || monthsCtrl.dirty));
//     if (!interacted) return null;

//     const years = yearsCtrl?.value === '' || yearsCtrl?.value === null ? null : Number(yearsCtrl?.value);
//     const months = monthsCtrl?.value === '' || monthsCtrl?.value === null ? null : Number(monthsCtrl?.value);
//     const bothEmpty = (years === null || isNaN(years)) && (months === null || isNaN(months));
//     if (bothEmpty) return { ageRequired: true };

//     if (
//       (years !== null && (isNaN(years) || years < 0)) ||
//       (months !== null && (isNaN(months) || months < 0))
//     ) {
//       return { ageInvalid: true };
//     }
//     return null;
//   }

//   openInMaps() {
//     const address: string = (this.petFormStep2.value.location || '').trim();
//     if (!address) {
//       this.showToast('Please enter a location first.', 'danger');
//       return;
//     }
//     const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
//     window.open(url, '_blank');
//   }

//   triggerFileInput() {
//     this.petImageInput.nativeElement.click();
//   }

//   onFileChange(event: any) {
//     const files: FileList = event.target.files;
//     if (files && files.length) {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const reader = new FileReader();
//         reader.onload = (e: any) => {
//           this.photos.push({ file, dataUrl: e.target.result });
//           this.updateFileNames();
//         };
//         reader.readAsDataURL(file);
//       }
//       event.target.value = '';
//     }
//   }

//   removePetImage(index: number) {
//     this.photos.splice(index, 1);
//     this.updateFileNames();
//   }

//   updateFileNames() {
//     this.imageFileNames = this.photos.map((p, idx) => p.file ? p.file.name : `Photo ${idx + 1}`);
//   }

//   goNext() {
//     if (this.petFormStep1.invalid) {
//       this.petFormStep1.markAllAsTouched();
//       this.showToast('Please fill all the inputs.', 'danger');
//       return;
//     }
//     this.step = 2;
//   }

//   goBack() {
//     this.step = 1;
//   }

// async updatePet() {
//     if (this.petFormStep1.invalid || this.petFormStep2.invalid) {
//       this.petFormStep1.markAllAsTouched();
//       this.petFormStep2.markAllAsTouched();
//       this.showToast('Please complete the form correctly.', 'danger');
//       return;
//     }

//     const loading = await this.loadingCtrl.create({
//       message: 'Updating pet...',
//       spinner: 'crescent',
//     });
//     await loading.present();

//     try {
//       // Upload new photos only
//       const photoUrls: string[] = [];
//       for (const [index, photo] of this.photos.entries()) {
//         if (photo.file) {
//           const ext = photo.file.name.split('.').pop() || 'png';
//           const path = `pet-photos/${this.pet.id}/photo-${Date.now()}-${index}.${ext}`;  // Unique to avoid overwrite
//           const url = await this.firebaseService.uploadFile(photo.file, path);
//           photoUrls.push(url);
//         } else {
//           photoUrls.push(photo.dataUrl);
//         }
//       }

//       const years = Number(this.petFormStep1.value.ageYears || 0);
//       const months = Number(this.petFormStep1.value.ageMonths || 0);
//       const ageInMonths = (isNaN(years) ? 0 : years * 12) + (isNaN(months) ? 0 : months);

//       const f1v = this.petFormStep1.value;
//       const f2v = this.petFormStep2.value;

//       const petData: Pet = {
//         ...this.pet,  // Preserve unchanged fields like status, createdAt, submitterUid
//         petName: (f1v.petName || '').toString().trim(),
//         species: (f1v.species || '').toString().trim(),
//         gender: (f1v.gender || '').toString().trim() as Pet['gender'],
//         ageYears: f1v.ageYears,
//         ageMonths: f1v.ageMonths,
//         ageInMonths,
//         breed: (f1v.breed || '').toString().trim(),
//         health: f1v.health ? String(f1v.health).trim() : null,
//         temperament: f1v.temperament ? String(f1v.temperament).trim() : null,
//         location: (f2v.location || '').toString().trim(),
//         contactName: f2v.contactName ? String(f2v.contactName).trim() : undefined,
//         contactPhone: f2v.contactPhone ? String(f2v.contactPhone).trim() : undefined,
//         contactPublic: f2v.contactPublic,
//         description: (f1v.description || '').toString().trim(),
//         photos: photoUrls,
//       };

//       await this.firebaseService.updatePet(this.pet.id, petData);  // Assume this method exists in FirebaseService
//       await this.showToast('Pet updated successfully!', 'success');
//       this.modalCtrl.dismiss({ updated: true });
//     } catch (error) {
//       console.error('Error updating pet:', error);
//       await this.showToast('Failed to update pet. Please try again later.', 'danger');
//     } finally {
//       await loading.dismiss();
//     }
//   }

//   closeModal() {
//     this.modalCtrl.dismiss();
//   }

//   private async showToast(message: string, color: 'success' | 'danger') {
//     const toast = await this.toastCtrl.create({
//       message,
//       duration: 2000,
//       color,
//       position: 'bottom',
//     });
//     await toast.present();
//   }
// }


import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { Timestamp } from 'firebase/firestore';

interface Pet {
  id: string;
  petName: string;
  species: string;
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
  selector: 'app-edit-adoption',
  templateUrl: './edit-adoption.component.html',
  styleUrls: ['./edit-adoption.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class EditAdoptionComponent implements OnInit {
  @Input() pet!: Pet;
  @ViewChild('petImageInput') petImageInput!: ElementRef<HTMLInputElement>;

  step = 1;
  petFormStep1: FormGroup;
  petFormStep2: FormGroup;
  photos: { file: File | null; dataUrl: string }[] = [];
  imageFileNames: string[] = [];

  speciesOptions = [
    { code: 'dog', label: 'Dog 🐶' },
    { code: 'cat', label: 'Cat 🐱' },
    { code: 'bird', label: 'Bird 🐦' },
    { code: 'fish', label: 'Fish 🐟' },
    { code: 'rabbit', label: 'Rabbit 🐰' },
    { code: 'other', label: 'Other' },
  ];
  healthOptions = ['Vaccinated', 'Dewormed', 'Neutered/Spayed'];
  temperamentOptions = ['Friendly with kids', 'Trained', 'Special needs'];

  constructor(
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.petFormStep1 = this.fb.group(
      {
        petName: ['', [Validators.required, Validators.minLength(2)]],
        species: ['', Validators.required],
        gender: ['', Validators.required],
        ageYears: [null, [Validators.min(0)]],
        ageMonths: [null, [Validators.min(0), Validators.max(11)]],
        breed: ['', [Validators.required, Validators.minLength(2)]],
        health: [[]], // Initialize as empty array for multi-select
        temperament: [[]], // Initialize as empty array for multi-select
        description: ['', [Validators.required, Validators.minLength(10)]],
      },
      { validators: this.ageValidator }
    );

    this.petFormStep2 = this.fb.group({
      location: ['', Validators.required],
      contactName: ['', Validators.minLength(2)],
      contactPhone: ['', [Validators.pattern(/^\d+$/), Validators.maxLength(10)]],
      contactPublic: [true],
    });
  }

  ngOnInit() {
    if (!this.pet || !this.pet.id) {
      console.error('No valid pet data received:', this.pet);
      this.showToast('Invalid pet data. Please try again.', 'danger');
      this.modalCtrl.dismiss();
      return;
    }

    console.log('Pet data received:', JSON.stringify(this.pet, null, 2));

    // Process health and temperament to arrays
    const health = this.processHealthOrTemperament(this.pet.health);
    const temperament = this.processHealthOrTemperament(this.pet.temperament);

    // Patch Step 1 form with default values for undefined/null fields
    this.petFormStep1.patchValue({
      petName: this.pet.petName?.trim() || '',
      species: this.pet.species?.trim() || '',
      gender: this.pet.gender || 'Unknown',
      ageYears: this.pet.ageYears ?? null,
      ageMonths: this.pet.ageMonths ?? null,
      breed: this.pet.breed?.trim() || '',
      health: health.length ? health : [],
      temperament: temperament.length ? temperament : [],
      description: this.pet.description?.trim() || '',
    });

    // Patch Step 2 form
    this.petFormStep2.patchValue({
      location: this.pet.location?.trim() || '',
      contactName: this.pet.contactName?.trim() || '',
      contactPhone: this.pet.contactPhone?.trim() || '',
      contactPublic: this.pet.contactPublic ?? true,
    });

    // Load photos
    this.photos = this.pet.photos?.map(url => ({ file: null, dataUrl: url })) || [];
    this.updateFileNames();

    console.log('Form values after patching:', {
      step1: this.petFormStep1.value,
      step2: this.petFormStep2.value,
      photos: this.photos,
    });
  }

  private processHealthOrTemperament(value: string | string[] | null | undefined): string[] {
    if (Array.isArray(value)) {
      return value.map(item => item.trim()).filter(item => item);
    } else if (typeof value === 'string' && value) {
      return value.split(', ').map(item => item.trim()).filter(item => item);
    }
    return [];
  }

  get f1() {
    return this.petFormStep1.controls as {
      petName: AbstractControl;
      species: AbstractControl;
      gender: AbstractControl;
      ageYears: AbstractControl;
      ageMonths: AbstractControl;
      breed: AbstractControl;
      health: AbstractControl;
      temperament: AbstractControl;
      description: AbstractControl;
    };
  }

  get f2() {
    return this.petFormStep2.controls as {
      location: AbstractControl;
      contactName: AbstractControl;
      contactPhone: AbstractControl;
      contactPublic: AbstractControl;
    };
  }

  private ageValidator(group: AbstractControl): ValidationErrors | null {
    const yearsCtrl = group.get('ageYears');
    const monthsCtrl = group.get('ageMonths');
    const interacted = (yearsCtrl?.touched || yearsCtrl?.dirty) || (monthsCtrl?.touched || monthsCtrl?.dirty);
    if (!interacted) return null;

    let years: number | null = null;
    if (yearsCtrl && yearsCtrl.value !== null && yearsCtrl.value !== '') {
      years = Number(yearsCtrl.value);
    }

    let months: number | null = null;
    if (monthsCtrl && monthsCtrl.value !== null && monthsCtrl.value !== '') {
      months = Number(monthsCtrl.value);
    }

    if ((years === null || isNaN(years)) && (months === null || isNaN(months))) return { ageRequired: true };
    if ((years !== null && (isNaN(years) || years < 0)) || (months !== null && (isNaN(months) || months < 0))) return { ageInvalid: true };
    return null;
  }

  openInMaps() {
    const address = (this.petFormStep2.value.location || '').trim();
    if (!address) {
      this.showToast('Please enter a location first.', 'danger');
      return;
    }
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  }

  triggerFileInput() {
    this.petImageInput.nativeElement.click();
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photos.push({ file, dataUrl: e.target.result });
          this.updateFileNames();
        };
        reader.readAsDataURL(file);
      }
      event.target.value = '';
    }
  }

  removePetImage(index: number) {
    this.photos.splice(index, 1);
    this.updateFileNames();
  }

  updateFileNames() {
    this.imageFileNames = this.photos.map((p, idx) => p.file ? p.file.name : `Photo ${idx + 1}`);
  }

  goNext() {
    if (this.petFormStep1.invalid) {
      this.petFormStep1.markAllAsTouched();
      this.showToast('Please fill all the inputs.', 'danger');
      return;
    }
    this.step = 2;
  }

  goBack() {
    this.step = 1;
  }

  async updatePet() {
    if (this.petFormStep1.invalid || this.petFormStep2.invalid) {
      this.petFormStep1.markAllAsTouched();
      this.petFormStep2.markAllAsTouched();
      this.showToast('Please complete the form correctly.', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Updating pet...', spinner: 'crescent' });
    await loading.present();

    try {
      const photoUrls: string[] = [];
      for (const [index, photo] of this.photos.entries()) {
        if (photo.file) {
          const ext = photo.file.name.split('.').pop() || 'png';
          const path = `pet-photos/${this.pet.id}/photo-${Date.now()}-${index}.${ext}`;
          const url = await this.firebaseService.uploadFile(photo.file, path);
          photoUrls.push(url);
        } else {
          photoUrls.push(photo.dataUrl);
        }
      }

      const years = Number(this.petFormStep1.value.ageYears || 0);
      const months = Number(this.petFormStep1.value.ageMonths || 0);
      const ageInMonths = (isNaN(years) ? 0 : years * 12) + (isNaN(months) ? 0 : months);

      const f1v = this.petFormStep1.value;
      const f2v = this.petFormStep2.value;

      const petData: Pet = {
        ...this.pet,
        petName: (f1v.petName || '').trim(),
        species: (f1v.species || '').trim(),
        gender: (f1v.gender || 'Unknown') as Pet['gender'],
        ageYears: f1v.ageYears,
        ageMonths: f1v.ageMonths,
        ageInMonths,
        breed: (f1v.breed || '').trim(),
        health: f1v.health.length ? f1v.health.join(', ') : null,
        temperament: f1v.temperament.length ? f1v.temperament.join(', ') : null,
        location: (f2v.location || '').trim(),
        contactName: f2v.contactName?.trim() || undefined,
        contactPhone: f2v.contactPhone?.trim() || undefined,
        contactPublic: f2v.contactPublic,
        description: (f1v.description || '').trim(),
        photos: photoUrls,
      };

      await this.firebaseService.updatePet(this.pet.id, petData);
      await this.showToast('Pet updated successfully!', 'success');
      this.modalCtrl.dismiss({ updated: true });
    } catch (error) {
      console.error('Error updating pet:', error);
      await this.showToast('Failed to update pet. Please try again later.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await toast.present();
  }
}