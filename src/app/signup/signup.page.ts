import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseService } from '../../app/services/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class SignupPage implements OnInit {
  step = 1; // Track current step
  signupFormStep1!: FormGroup;
  signupFormStep2!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    // Step 1: Basic Info
    this.signupFormStep1 = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });

    // Step 2: Address & Security
    this.signupFormStep2 = this.fb.group(
      {
        aadhar: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
        area: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Password match validator
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // Navigate between steps
  goNext() {
    if (this.signupFormStep1.valid) {
      this.step = 2;
    } else {
      this.toastCtrl
        .create({ message: 'Please fill all Step 1 fields correctly', duration: 2000, color: 'warning' })
        .then(t => t.present());
    }
  }

  goBack() {
    this.step = 1;
  }

  // Final Signup
  async onSignUp() {
    if (!this.signupFormStep2.valid) {
      this.toastCtrl
        .create({ message: 'Please fill all Step 2 fields correctly', duration: 2000, color: 'warning' })
        .then(t => t.present());
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Creating account...' });
    await loading.present();

    const userData = {
      ...this.signupFormStep1.value,
      ...this.signupFormStep2.value,
      status: 'Active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const docID = uuidv4();

    try {
      await this.firebaseService.addInformation(docID, userData, 'user');
      await loading.dismiss();

      this.toastCtrl
        .create({ message: '🎉 Signup successful! Redirecting...', duration: 2000, color: 'success' })
        .then(t => t.present());

      this.signupFormStep1.reset();
      this.signupFormStep2.reset();
      this.step = 1;
      this.router.navigate(['/signin'], { replaceUrl: true });
    } catch (error) {
      await loading.dismiss();
      console.error('Firebase Error:', error);

      this.toastCtrl
        .create({ message: '❌ Signup failed. Try again.', duration: 3000, color: 'danger' })
        .then(t => t.present());
    }
  }

  navigateToSignIn() {
    this.router.navigate(['/signin'], { replaceUrl: true });
  }
}
