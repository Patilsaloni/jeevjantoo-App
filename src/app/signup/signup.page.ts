import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class SignupPage implements OnInit {
  signupForm!: FormGroup;
  isSubmitted = false;

  private apiUrl = 'http://localhost:3000/api/v1/users/register'; // backend endpoint

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom Validator: check if password and confirmPassword match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Handle Signup
  async onSignUp() {
    this.isSubmitted = true;

    if (!this.signupForm.valid) {
      const toast = await this.toastCtrl.create({
        message: '⚠️ Please fill all fields correctly.',
        duration: 2000,
        color: 'warning',
      });
      toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Creating account...' });
    await loading.present();

    // Only send required fields to backend
    const { name, email, phone, password } = this.signupForm.value;
    const payload = { name, email, phone, password };

    this.http.post(this.apiUrl, payload).subscribe({
      next: async (res: any) => {
        await loading.dismiss();

        // Save JWT token
        if (res.token) localStorage.setItem('authToken', res.token);

        const toast = await this.toastCtrl.create({
          message: '🎉 Signup successful! Redirecting...',
          duration: 2000,
          color: 'success',
        });
        toast.present();

        this.router.navigate(['/signin'], { replaceUrl: true });
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('❌ Signup API Error:', err);

        const toast = await this.toastCtrl.create({
          message: err.error?.error || '❌ Signup failed. Try again.',
          duration: 3000,
          color: 'danger',
        });
        toast.present();
      },
    });
  }

  // Navigate to SignIn
  navigateToSignIn() {
    this.router.navigate(['/signin'], { replaceUrl: true });
  }
}
  