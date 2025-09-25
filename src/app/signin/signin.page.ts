import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut
} from 'firebase/auth';

import { FirebaseService } from '../../app/services/firebase.service';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

interface Profile {
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
  loginMode: 'email' | 'phone' = 'email';
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
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      otp: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Redirect if already logged in
    const user = localStorage.getItem('user');
    if (user) this.router.navigate(['/tabs/home']);
  }

  ngAfterViewInit() {
    setTimeout(() => this.initializeRecaptcha(), 500);
  }

  ngOnDestroy() {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
  }

  private initializeRecaptcha() {
    if (!window.recaptchaVerifier) {
      const auth = getAuth(); // use default app initialized in your service
      this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      window.recaptchaVerifier = this.recaptchaVerifier;
      this.recaptchaVerifier.render();
    }
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    toast.present();
  }

  // ---------------- Email Login ----------------
  async onEmailLogin() {
    if (!this.emailForm.valid) {
      return this.showToast('Enter valid email & password', 'warning');
    }

    try {
      const { email, password } = this.emailForm.value;

      // 1) Sign in (uses the same app/auth as your service)
      const user = await this.firebaseService.signIn(email.trim(), password.trim());

      // 2) Read ONLY my profile: /users/{uid}
      let profile = await this.firebaseService.getDocument('users', user.uid) as Profile | null;

      // 3) If profile missing, create a minimal one now
      if (!profile) {
        await this.firebaseService.addInformation(user.uid, {
          id: user.uid,
          email: user.email || email.trim(),
          createdAt: new Date()
        }, 'users');

        profile = { id: user.uid, email: user.email || email.trim() };
      }

      // 4) Save & go
      localStorage.setItem('user', JSON.stringify(profile));
      localStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/tabs/home']);

    } catch (error: any) {
      console.error('Email login failed:', error);
      this.showToast(error?.message || 'Login failed', 'danger');
    }
  }

  // ---------------- Phone OTP ----------------
  async onSendOtp() {
    if (!this.phoneForm.get('phone')?.valid) {
      return this.showToast('Enter valid 10-digit phone', 'warning');
    }

    try {
      const auth = getAuth(); // same default app
      const phoneNumber = '+91' + this.phoneForm.value.phone;
      this.confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier!);
      this.otpSent = true;
      this.showToast('OTP sent', 'success');
    } catch (error: any) {
      console.error('OTP send failed:', error);
      this.showToast(error?.message || 'OTP failed', 'danger');
    }
  }

  async onPhoneLogin() {
    if (!this.phoneForm.valid || !this.otpSent) {
      return this.showToast('Enter valid OTP', 'warning');
    }

    try {
      const result = await this.confirmationResult.confirm(this.phoneForm.value.otp);
      const user = result.user;

      // 1) Read ONLY my profile: /users/{uid}
      let profile = await this.firebaseService.getDocument('users', user.uid) as Profile | null;

      // 2) If profile missing, create a minimal one
      if (!profile) {
        await this.firebaseService.addInformation(user.uid, {
          id: user.uid,
          phone: user.phoneNumber,
          createdAt: new Date()
        }, 'users');

        profile = { id: user.uid, phone: user.phoneNumber ?? '' };
      }

      // 3) Save & go
      localStorage.setItem('user', JSON.stringify(profile));
      localStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/tabs/home']);

    } catch (error: any) {
      console.error('OTP verification failed:', error);
      this.showToast(error?.message || 'Invalid OTP', 'danger');
    }
  }

  // ---------------- Logout ----------------
  async logout() {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      this.router.navigate(['/signin']);
    } catch (error) {
      console.error('Logout failed:', error);
      this.showToast('Logout failed', 'danger');
    }
  }

  navigateToSignUp() { this.router.navigate(['/signup']); }
  navigateToForgotPassword() { this.router.navigate(['/forgot-password']); }
}
