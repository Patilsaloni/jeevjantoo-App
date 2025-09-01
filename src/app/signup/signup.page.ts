import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class SignupPage implements OnInit {
  signupForm!: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{10}$/), // exactly 10 digits
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // ✅ Custom Validator for password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // ✅ Handle Sign Up
  onSignUp() {
    this.isSubmitted = true;

    if (this.signupForm.valid) {
      console.log('✅ Signup Data:', this.signupForm.value);

      // 🔹 TODO: Call signup API or Firebase Auth here
      // Example: this.authService.signup(this.signupForm.value)

      // Redirect to SignIn after successful signup
      this.router.navigate(['/signin'], { replaceUrl: true });
    } else {
      console.log('❌ Signup Form Invalid');
    }
  }

  // ✅ Navigate to SignIn Page
  navigateToSignIn() {
    this.router.navigate(['/signin'], { replaceUrl: true });
  }
}
