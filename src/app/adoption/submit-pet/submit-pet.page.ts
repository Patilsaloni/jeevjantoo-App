// import { Component, ViewChild, ElementRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { FirebaseService } from '../../services/firebase.service';
// import { Router } from '@angular/router';
// import { serverTimestamp, Timestamp } from 'firebase/firestore';

// interface Pet {
//   id: string;
//   petName: string;
//   species: string;
//   age: number;
//   breed: string;
//   location: string;
//   description: string;
//   contactName: string;
//   contactPhone: string;
//   photos: string[];
//   status: 'Pending' | 'Active' | 'Inactive' | 'Adopted';
//   createdAt: Timestamp;
// }

// @Component({
//   selector: 'app-submit-pet',
//   templateUrl: './submit-pet.page.html',
//   styleUrls: ['./submit-pet.page.scss'],
//   standalone: true,
//   imports: [CommonModule, IonicModule, ReactiveFormsModule],
// })
// export class SubmitPetPage {
//   step = 1;
//   petFormStep1: FormGroup;
//   petFormStep2: FormGroup;
//   photos: File[] = [];
//   imageFileNames: string[] = [];

//   @ViewChild('petImageInput') petImageInput!: ElementRef<HTMLInputElement>;

//   constructor(
//     private firebaseService: FirebaseService,
//     private toastCtrl: ToastController,
//     private loadingCtrl: LoadingController,
//     private router: Router,
//     private fb: FormBuilder
//   ) {
//     // Step 1 form
//     this.petFormStep1 = this.fb.group({
//       petName: ['', [Validators.required, Validators.minLength(2)]],
//       species: ['', Validators.required],
//       age: ['', [Validators.required, Validators.min(0)]],
//       breed: ['', [Validators.required, Validators.minLength(2)]],
//       description: ['', [Validators.required, Validators.minLength(10)]],
//     });

//     // Step 2 form
//     this.petFormStep2 = this.fb.group({
//       location: [''],
//       contactName: ['', Validators.minLength(2)],
//       contactPhone: ['', [Validators.pattern(/^\+?[\d\s-]{10,}$/)]],
//     });
//   }

//   // Trigger file input
//   triggerFileInput() {
//     this.petImageInput.nativeElement.click();
//   }

//   // Handle multiple files
//   onFileChange(event: any) {
//     if (event.target.files && event.target.files.length > 0) {
//       this.photos = Array.from(event.target.files);
//       this.imageFileNames = this.photos.map(file => file.name);
//     }
//   }

//   goNext() {
//     if (this.petFormStep1.invalid) {
//       this.petFormStep1.markAllAsTouched();
//       this.showToast('Please fill all required fields correctly.', 'danger');
//       return;
//     }
//     this.step = 2;
//   }

//   goBack() {
//     this.step = 1;
//   }

//   async submitPet() {
//     if (!this.firebaseService.getCurrentUser()) {
//       await this.showToast('Please sign in to submit a pet.', 'danger');
//       this.router.navigate(['/signin']);
//       return;
//     }

//     const loading = await this.loadingCtrl.create({
//       message: 'Submitting pet...',
//       spinner: 'crescent',
//     });
//     await loading.present();

//     try {
//       const docID = this.petFormStep1.value.petName + '_' + Date.now();
//       const photoUrls: string[] = [];

//       // Upload all photos to Firebase Storage
//       if (this.photos.length > 0) {
//         for (const [index, photo] of this.photos.entries()) {
//           const ext = photo.name.split('.').pop() || 'png';
//           const path = `pet-photos/${docID}/photo-${index + 1}.${ext}`;
//           const url = await this.firebaseService.uploadFile(photo, path);
//           photoUrls.push(url);
//         }
//       }

//       // Prepare Pet object
//       const petData: Pet = {
//         id: docID,
//         petName: this.petFormStep1.value.petName,
//         species: this.petFormStep1.value.species,
//         age: Number(this.petFormStep1.value.age),
//         breed: this.petFormStep1.value.breed,
//         description: this.petFormStep1.value.description,
//         location: this.petFormStep2.value.location,
//         contactName: this.petFormStep2.value.contactName,
//         contactPhone: this.petFormStep2.value.contactPhone,
//         photos: photoUrls,
//         status: 'Pending',
//         createdAt: serverTimestamp() as Timestamp,
//       };

//       // Submit to Firestore
//       await this.firebaseService.submitPet(petData);

//       await this.showToast('Pet submitted successfully! Pending approval.', 'success');
//       this.petFormStep1.reset();
//       this.petFormStep2.reset();
//       this.photos = [];
//       this.imageFileNames = [];
//       this.step = 1;
//       this.router.navigate(['/tabs/adoption']);
//     } catch (error: any) {
//       console.error('Error submitting pet:', error);
//       const errorMessage =
//         error.code === 'storage/unauthorized'
//           ? 'Permission denied. Please check Storage rules or sign in.'
//           : 'Failed to submit pet. Please try again later.';
//       await this.showToast(errorMessage, 'danger');
//     } finally {
//       await loading.dismiss();
//     }
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

//   navigateToAdoption() {
//     this.router.navigate(['/tabs/adoption']);
//   }
// }


import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

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
  description: string;
  photos: string[];
  status: 'Pending' | 'Active' | 'Inactive' | 'Adopted';
  createdAt: Timestamp;
}

@Component({
  selector: 'app-submit-pet',
  templateUrl: './submit-pet.page.html',
  styleUrls: ['./submit-pet.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class SubmitPetPage {
  step = 1;

  petFormStep1: FormGroup;
  petFormStep2: FormGroup;

  // Canonical species codes (value saved) with emoji labels (for UI)
  speciesOptions = [
    { code: 'dog',    label: 'Dog 🐶' },
    { code: 'cat',    label: 'Cat 🐱' },
    { code: 'bird',   label: 'Bird 🐦' },
    { code: 'fish',   label: 'Fish 🐟' },
    { code: 'rabbit', label: 'Rabbit 🐰' },
    { code: 'other',  label: 'Other' },
  ];

  healthOptions = ['Vaccinated', 'Dewormed', 'Neutered/Spayed'];
  temperamentOptions = ['Friendly with kids', 'Trained', 'Special needs'];

  photos: File[] = [];
  imageFileNames: string[] = [];

  @ViewChild('petImageInput') petImageInput!: ElementRef<HTMLInputElement>;

  constructor(
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.petFormStep1 = this.fb.group(
      {
        petName: ['', [Validators.required, Validators.minLength(2)]],
        species: ['', Validators.required],  // code stored
        gender: ['', Validators.required],

        ageYears: [null, [Validators.min(0)]],
        ageMonths: [null, [Validators.min(0), Validators.max(11)]],

        breed: ['', [Validators.required, Validators.minLength(2)]],
        health: [null],
        temperament: [null],
        description: ['', [Validators.required, Validators.minLength(10)]],
      },
      { validators: this.ageValidator }
    );

    this.petFormStep2 = this.fb.group({
      location: ['', Validators.required],
      contactName: ['', Validators.minLength(2)],
      contactPhone: ['', [Validators.pattern(/^\+?[\d\s-]{10,}$/)]],
    });
  }

  get f1() { return this.petFormStep1.controls as any; }
  get f2() { return this.petFormStep2.controls as any; }

  // Age validator (only after touch)
  private ageValidator(group: AbstractControl): ValidationErrors | null {
    const yearsCtrl = group.get('ageYears');
    const monthsCtrl = group.get('ageMonths');

    const interacted =
      (!!yearsCtrl && (yearsCtrl.touched || yearsCtrl.dirty)) ||
      (!!monthsCtrl && (monthsCtrl.touched || monthsCtrl.dirty));

    if (!interacted) return null;

    const years = yearsCtrl?.value === '' || yearsCtrl?.value === null ? null : Number(yearsCtrl?.value);
    const months = monthsCtrl?.value === '' || monthsCtrl?.value === null ? null : Number(monthsCtrl?.value);

    const bothEmpty = (years === null || isNaN(years)) && (months === null || isNaN(months));
    if (bothEmpty) return { ageRequired: true };

    if ((years !== null && (isNaN(years) || years < 0)) ||
        (months !== null && (isNaN(months) || months < 0))) {
      return { ageInvalid: true };
    }
    return null; // 0..11 for months handled by control validator
  }

  openInMaps() {
    const address: string = (this.petFormStep2.value.location || '').trim();
    if (!address) {
      this.showToast('Please enter a location first.', 'danger');
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  }

  triggerFileInput() { this.petImageInput.nativeElement.click(); }
  onFileChange(event: any) {
    if (event?.target?.files?.length) {
      this.photos = Array.from(event.target.files);
      this.imageFileNames = this.photos.map(f => f.name);
    }
  }

  goNext() {
    if (this.petFormStep1.invalid) {
      this.petFormStep1.markAllAsTouched();
      this.showToast('Please complete Step 1 correctly.', 'danger');
      return;
    }
    this.step = 2;
  }
  goBack() { this.step = 1; }

  async submitPet() {
    if (!this.firebaseService.getCurrentUser()) {
      await this.showToast('Please sign in to submit a pet.', 'danger');
      this.router.navigate(['/signin']);
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Submitting pet...', spinner: 'crescent' });
    await loading.present();

    try {
      const rawName = (this.petFormStep1.value.petName || '').toString().trim();
      const id = rawName + '_' + Date.now();

      // Upload photos
      const photoUrls: string[] = [];
      if (this.photos.length) {
        for (const [index, photo] of this.photos.entries()) {
          const ext = photo.name.split('.').pop() || 'png';
          const path = `pet-photos/${id}/photo-${index + 1}.${ext}`;
          const url = await this.firebaseService.uploadFile(photo, path);
          photoUrls.push(url);
        }
      }

      // Compute ageInMonths
      const years = Number(this.petFormStep1.value.ageYears || 0);
      const months = Number(this.petFormStep1.value.ageMonths || 0);
      const ageInMonths = (isNaN(years) ? 0 : years * 12) + (isNaN(months) ? 0 : months);

      const f1v = this.petFormStep1.value;
      const f2v = this.petFormStep2.value;

      const petData: Pet = {
        id,
        petName: rawName,
        species: (f1v.species || '').toString().trim(), // already code (dog/cat/bird/...)
        gender: (f1v.gender || '').toString().trim() as Pet['gender'],

        ageYears: f1v.ageYears,
        ageMonths: f1v.ageMonths,
        ageInMonths,

        breed: (f1v.breed || '').toString().trim(),

        health: f1v.health ? String(f1v.health).trim() : null,
        temperament: f1v.temperament ? String(f1v.temperament).trim() : null,

        location: (f2v.location || '').toString().trim(),
        contactName: f2v.contactName ? String(f2v.contactName).trim() : undefined,
        contactPhone: f2v.contactPhone ? String(f2v.contactPhone).trim() : undefined,

        description: (f1v.description || '').toString().trim(),
        photos: photoUrls,
        status: 'Pending',
        createdAt: serverTimestamp() as Timestamp,
      };

      await this.firebaseService.submitPet(petData);

      await this.showToast('Pet submitted successfully! Pending approval.', 'success');
      this.petFormStep1.reset({
        gender: '',
        ageYears: null,
        ageMonths: null,
        health: null,
        temperament: null,
      });
      this.petFormStep2.reset();
      this.photos = [];
      this.imageFileNames = [];
      this.step = 1;
      this.router.navigate(['/tabs/adoption']);
    } catch (error) {
      console.error('Error submitting pet:', error);
      await this.showToast('Failed to submit pet. Please try again later.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await toast.present();
  }

  navigateToAdoption() {
    this.router.navigate(['/tabs/adoption']);
  }
}
