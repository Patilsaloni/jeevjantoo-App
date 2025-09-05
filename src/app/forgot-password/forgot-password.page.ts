import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../app/services/firebase.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule]
})
export class ForgotPasswordPage implements OnInit {
  forgotForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    // Only email is needed now
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (!this.forgotForm.valid) return;

    const email = this.forgotForm.value.email;

    try {
      // Trigger Firebase email password reset
      await this.firebaseService.resetPasswordWithEmail(email);
      alert('Password reset email sent! Please check your inbox.');
      this.navigateToSignIn();

    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to send reset email.');
    }
  }

  navigateToSignIn() {
    this.router.navigate(['/signin']);
  }
}
