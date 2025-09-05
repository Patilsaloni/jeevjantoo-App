// src/app/signup/signup.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from '../../app/services/firebase.service';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase Auth
const app = initializeApp(environment.firebaseConfig);
const auth = getAuth(app);

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class SignupPage implements OnInit {
  step = 1;
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
    this.signupFormStep1 = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });

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

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  goNext() {
    if (this.signupFormStep1.invalid) {
      this.signupFormStep1.markAllAsTouched();
      this.toastCtrl
        .create({ message: 'Please fill all Step 1 fields correctly', duration: 2000, color: 'warning' })
        .then(t => t.present());
      return;
    }
    this.step = 2;
  }

  goBack() {
    this.step = 1;
  }

  // 🔹 Final signup: Firebase Auth + Firestore
  async onSignUp() {
    if (this.signupFormStep2.invalid) {
      this.signupFormStep2.markAllAsTouched();
      this.toastCtrl
        .create({ message: 'Please fill all Step 2 fields correctly', duration: 2000, color: 'warning' })
        .then(t => t.present());
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Creating account...' });
    await loading.present();

    const { email, password, phone, firstName, lastName, gender } = {
      ...this.signupFormStep1.value,
      ...this.signupFormStep2.value,
    };

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2️⃣ Save additional user info in Firestore
      const userData = {
        id: userCredential.user.uid, // Use Firebase Auth UID
        firstname: firstName,
        lastname: lastName,
        email,
        phone,
        gender,
        Adhar: this.signupFormStep2.value.aadhar,
        area: this.signupFormStep2.value.area,
        city: this.signupFormStep2.value.city,
        state: this.signupFormStep2.value.state,
        pincode: this.signupFormStep2.value.pincode,
        status: 'Active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await this.firebaseService.addInformation(userCredential.user.uid, userData, 'user');

      await loading.dismiss();

      this.toastCtrl
        .create({ message: '🎉 Signup successful! Redirecting...', duration: 2000, color: 'success' })
        .then(t => t.present());

      this.signupFormStep1.reset();
      this.signupFormStep2.reset();
      this.step = 1;
      this.router.navigate(['/signin'], { replaceUrl: true });
    } catch (error: any) {
      await loading.dismiss();
      console.error('Signup Error:', error);

      this.toastCtrl
        .create({ message: '❌ Signup failed: ' + error.message, duration: 3000, color: 'danger' })
        .then(t => t.present());
    }
  }

  navigateToSignIn() {
    this.router.navigate(['/signin'], { replaceUrl: true });
  }
}
