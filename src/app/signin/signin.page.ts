import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { FirebaseService } from '../../app/services/firebase.service';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

const app = initializeApp(environment.firebaseConfig);
const auth = getAuth(app);

interface User {
  id: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class SigninPage implements OnInit, AfterViewInit, OnDestroy {
  loginMode: 'email' | 'phone' = 'email'; // Toggle between login types
  emailForm: FormGroup;
  phoneForm: FormGroup;
  otpSent = false;
  confirmationResult: any;
  recaptchaVerifier?: RecaptchaVerifier;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController
  ) {
    // Email login form
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Phone login form
    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      otp: ['', Validators.required],
    });
  }

  ngOnInit() {}
  ngAfterViewInit() { setTimeout(() => this.initializeRecaptcha(), 500); }
  ngOnDestroy() { if (window.recaptchaVerifier) { window.recaptchaVerifier.clear(); window.recaptchaVerifier = undefined; } }

  initializeRecaptcha() {
    if (!window.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      window.recaptchaVerifier = this.recaptchaVerifier;
      this.recaptchaVerifier.render();
    }
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    toast.present();
  }

  // ------------------- Email Login -------------------
  async onEmailLogin() {
    if (!this.emailForm.valid) return this.showToast('Enter valid email & password', 'warning');
    try {
      const { email, password } = this.emailForm.value;
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());

      // Fetch Firestore user info
      const users: User[] = await this.firebaseService.getInformation('user');
      const currentUser = users.find(u => u.email === email.trim());

      if (!currentUser) return this.showToast('User data not found in Firestore', 'danger');

      localStorage.setItem('user', JSON.stringify(currentUser));
      this.router.navigate(['/tabs/home']);
    } catch (error: any) {
      console.error('Email login failed:', error);
      this.showToast(error.message || 'Login failed', 'danger');
    }
  }

  // ------------------- Phone OTP Login -------------------
  async onSendOtp() {
    if (!this.phoneForm.get('phone')?.valid) return this.showToast('Enter valid 10-digit phone', 'warning');
    try {
      const phoneNumber = '+91' + this.phoneForm.value.phone;
      this.confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier!);
      this.otpSent = true;
      this.showToast('OTP sent', 'success');
    } catch (error: any) {
      console.error('OTP send failed:', error);
      this.showToast(error.message || 'OTP failed', 'danger');
    }
  }

  async onPhoneLogin() {
    if (!this.phoneForm.valid || !this.otpSent) return this.showToast('Enter valid OTP', 'warning');
    try {
      const result = await this.confirmationResult.confirm(this.phoneForm.value.otp);
      const phone = result.user.phoneNumber;

      // Fetch Firestore user info by phone
      const users: User[] = await this.firebaseService.getInformation('user');
      const currentUser = users.find(u => u.phone === phone);

      if (!currentUser) return this.showToast('User data not found in Firestore', 'danger');

      localStorage.setItem('user', JSON.stringify(currentUser));
      // Inside SigninPage
      this.router.navigate(['/tabs/home']);

    } catch (error: any) {
      console.error('OTP verification failed:', error);
      this.showToast(error.message || 'Invalid OTP', 'danger');
    }
  }

  navigateToSignUp() { this.router.navigate(['/signup']); }
  navigateToForgotPassword() { this.router.navigate(['/forgot-password']); }
}
