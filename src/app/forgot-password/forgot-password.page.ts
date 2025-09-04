import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient // Inject HttpClient to call API
  ) {
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
      const payload = {
        username: this.forgotForm.value.username,
        newPassword: this.forgotForm.value.newPassword
      };

      this.http.post('http://localhost:3000/api/v1/users/reset-password', payload)
        .subscribe({
          next: (res: any) => {
            console.log(res.message);
            alert(res.message); // Show success message
            this.navigateToSignIn(); // Redirect to sign-in page
          },
          error: (err) => {
            console.error(err.error);
            alert(err.error.error || "Something went wrong"); // Show error message
          }
        });
    }
  }

  navigateToSignIn() {
    this.router.navigate(['/signin']);
  }
}
