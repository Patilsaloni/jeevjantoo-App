import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

// Initialize Firebase app
const app = initializeApp(environment.firebaseConfig);
const auth = getAuth(app);

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

  private API_URL = 'http://localhost:3000/api/v1/users'; // 🔹 change to production URL

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    // Email form
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Phone form
    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      otp: ['', Validators.required],
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => this.initializeRecaptcha(), 500);
  }

  ngOnDestroy() {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
  }

  initializeRecaptcha() {
    if (!window.recaptchaVerifier) {
      try {
        this.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => console.log('reCAPTCHA verified successfully'),
          }
        );

        window.recaptchaVerifier = this.recaptchaVerifier;

        this.recaptchaVerifier.render().then((widgetId) => {
          console.log('reCAPTCHA rendered with widgetId:', widgetId);
        });
      } catch (error) {
        console.error('Failed to initialize reCAPTCHA:', error);
      }
    }
  }

  // 🔹 Email login with backend
onEmailLogin() {
  if (this.emailForm.valid) {
    const body = {
      method: 'email',
      email: this.emailForm.value.email,
      password: this.emailForm.value.password
    };

    this.http.post(`${this.API_URL}/login`, body).subscribe({
      next: (res: any) => {
        console.log('Email login success:', res);
        localStorage.setItem('token', res.token); // save JWT
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Email login error:', err);
        alert(err.error?.error || 'Login failed');
      },
    });
  } else {
    alert('Please enter valid email and password');
  }
}


  // 🔹 Send OTP via Firebase
  async onSendOtp() {
    if (!this.phoneForm.get('phone')?.valid) {
      alert('Enter a valid 10-digit phone number');
      return;
    }

    try {
      const phoneNumber = '+91' + this.phoneForm.value.phone;
      const appVerifier = window.recaptchaVerifier;

      if (!appVerifier) {
        alert('reCAPTCHA not initialized. Retrying...');
        this.initializeRecaptcha();
        return;
      }

      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      this.otpSent = true;
      console.log('OTP sent successfully');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP: ' + error.message);
    }
  }

  // 🔹 Verify OTP with Firebase + Backend
async onPhoneLogin() {
  if (!this.phoneForm.valid || !this.otpSent) {
    alert('Please enter a valid OTP');
    return;
  }

  try {
    const result = await this.confirmationResult.confirm(this.phoneForm.value.otp);
    const idToken = await result.user.getIdToken();

    // ✅ send method + idToken to backend
    const body = {
      method: 'phone',
      idToken: idToken
    };

    this.http.post(`${this.API_URL}/login`, body).subscribe({
      next: (res: any) => {
        console.log('Phone login success:', res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Phone login error:', err);
        alert(err.error?.error || 'Invalid OTP');
      },
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    alert('Invalid OTP: ' + error.message);
  }
}


  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
