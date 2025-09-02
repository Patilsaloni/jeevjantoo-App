import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Needed for ngModel
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule], // ✅ Added FormsModule
})
export class SigninPage implements OnInit {
  loginMode: string = 'phone'; // Default: Phone login
  phoneForm: FormGroup; // ✅ renamed to phoneForm
  emailForm: FormGroup;
  otpSent = false;

  constructor(private fb: FormBuilder, private router: Router) {
    // 📌 Phone login form
    this.phoneForm = this.fb.group({
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{10}$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      otp: [''],
    });

    // 📌 Email login form
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  // 📌 Send OTP
  onSendOtp() {
    if (this.phoneForm.get('phone')?.valid) {
      console.log('Sending OTP to:', this.phoneForm.value.phone);
      this.otpSent = true;

      this.phoneForm.get('otp')?.setValidators([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^\d{6}$/),
      ]);
      this.phoneForm.get('otp')?.updateValueAndValidity();

      // 🔹 TODO: Call backend API to send OTP
    }
  }

  // 📌 Phone login
  onPhoneLogin() {
    if (this.phoneForm.valid && this.otpSent) {
      console.log('Signing in with phone:', this.phoneForm.value);
      // 🔹 TODO: Verify OTP API call
    }
  }

  // 📌 Email login
  onEmailLogin() {
    if (this.emailForm.valid) {
      console.log('Signing in with email:', this.emailForm.value);
      // 🔹 TODO: Email/password API call
    }
  }

  navigateToSignUp() {
    this.router.navigate(['/signup'], { replaceUrl: true });
  }

  navigateToForgotPassword(){
    this.router.navigate(['forgot-password'], {replaceUrl: true})
  }

  navigateToDashboard(){
    this.router.navigate(['dashboard'], {replaceUrl: true})
  }
}
