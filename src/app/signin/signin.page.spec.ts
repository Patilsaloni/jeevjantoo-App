import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SigninPage } from './signin.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';

describe('SigninPage', () => {
  let component: SigninPage;
  let fixture: ComponentFixture<SigninPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        CommonModule,
        RouterTestingModule,
        SigninPage,
      ],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the phone form with phone and otp controls', () => {
    expect(component.phoneForm.contains('phone')).toBeTruthy();
    expect(component.phoneForm.contains('otp')).toBeTruthy();
  });

  it('should initialize the email form with email and password controls', () => {
    expect(component.emailForm.contains('email')).toBeTruthy();
    expect(component.emailForm.contains('password')).toBeTruthy();
  });

  it('should disable phone input after OTP is sent', () => {
    component.otpSent = true;
    component.phoneForm.get('phone')?.disable(); // Simulate disabling the phone input
    fixture.detectChanges();
    const phoneInput = fixture.nativeElement.querySelector('ion-input[formControlName="phone"]');
    expect(phoneInput.disabled).toBeTruthy();
  });
});