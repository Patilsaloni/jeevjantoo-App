import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SigninPage } from './signin.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

describe('SigninPage', () => {
  let component: SigninPage;
  let fixture: ComponentFixture<SigninPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ReactiveFormsModule, CommonModule, SigninPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with phone and otp controls', () => {
    expect(component.signInForm.contains('phone')).toBeTruthy();
    expect(component.signInForm.contains('otp')).toBeTruthy();
  });

  it('should disable phone input after OTP is sent', () => {
    component.otpSent = true;
    fixture.detectChanges();
    const phoneInput = fixture.nativeElement.querySelector('ion-input[formControlName="phone"]');
    expect(phoneInput.disabled).toBeTruthy();
  });
});