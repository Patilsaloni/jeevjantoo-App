import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

interface Pet {
  id: string;
  petName: string;
  species: string;
  age: number;
  breed: string;
  location: string;
  description: string;
  contactName: string;
  contactPhone: string;
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
    // Step 1 form
    this.petFormStep1 = this.fb.group({
      petName: ['', [Validators.required, Validators.minLength(2)]],
      species: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      breed: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });

    // Step 2 form
    this.petFormStep2 = this.fb.group({
      location: [''],
      contactName: ['', Validators.minLength(2)],
      contactPhone: ['', [Validators.pattern(/^\+?[\d\s-]{10,}$/)]],
    });
  }

  // Trigger file input
  triggerFileInput() {
    this.petImageInput.nativeElement.click();
  }

  // Handle multiple files
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.photos = Array.from(event.target.files);
      this.imageFileNames = this.photos.map(file => file.name);
    }
  }

  goNext() {
    if (this.petFormStep1.invalid) {
      this.petFormStep1.markAllAsTouched();
      this.showToast('Please fill all required fields correctly.', 'danger');
      return;
    }
    this.step = 2;
  }

  goBack() {
    this.step = 1;
  }

  async submitPet() {
    if (!this.firebaseService.getCurrentUser()) {
      await this.showToast('Please sign in to submit a pet.', 'danger');
      this.router.navigate(['/signin']);
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Submitting pet...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const docID = this.petFormStep1.value.petName + '_' + Date.now();
      const photoUrls: string[] = [];

      // Upload all photos to Firebase Storage
      if (this.photos.length > 0) {
        for (const [index, photo] of this.photos.entries()) {
          const ext = photo.name.split('.').pop() || 'png';
          const path = `pet-photos/${docID}/photo-${index + 1}.${ext}`;
          const url = await this.firebaseService.uploadFile(photo, path);
          photoUrls.push(url);
        }
      }

      // Prepare Pet object
      const petData: Pet = {
        id: docID,
        petName: this.petFormStep1.value.petName,
        species: this.petFormStep1.value.species,
        age: Number(this.petFormStep1.value.age),
        breed: this.petFormStep1.value.breed,
        description: this.petFormStep1.value.description,
        location: this.petFormStep2.value.location,
        contactName: this.petFormStep2.value.contactName,
        contactPhone: this.petFormStep2.value.contactPhone,
        photos: photoUrls,
        status: 'Pending',
        createdAt: serverTimestamp() as Timestamp,
      };

      // Submit to Firestore
      await this.firebaseService.submitPet(petData);

      await this.showToast('Pet submitted successfully! Pending approval.', 'success');
      this.petFormStep1.reset();
      this.petFormStep2.reset();
      this.photos = [];
      this.imageFileNames = [];
      this.step = 1;
      this.router.navigate(['/tabs/adoption']);
    } catch (error: any) {
      console.error('Error submitting pet:', error);
      const errorMessage =
        error.code === 'storage/unauthorized'
          ? 'Permission denied. Please check Storage rules or sign in.'
          : 'Failed to submit pet. Please try again later.';
      await this.showToast(errorMessage, 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  navigateToAdoption() {
    this.router.navigate(['/tabs/adoption']);
  }
}
