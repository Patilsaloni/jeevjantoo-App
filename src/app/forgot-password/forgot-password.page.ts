import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule]
})
export class ForgotPasswordPage implements OnInit {
  forgotForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.forgotForm = this.fb.group({
      username: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {}

  // Validator to check if newPassword and confirmPassword match
  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      console.log('Reset Password for:', this.forgotForm.value.username);
      console.log('New Password:', this.forgotForm.value.newPassword);
      // TODO: Call backend API to reset password
    }
  }

  navigateToSignIn() {
    this.router.navigate(['/signin']);
  }
}
