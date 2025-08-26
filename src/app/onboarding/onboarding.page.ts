import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class OnboardingPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    console.log('OnboardingPage initialized');
  }

  goToDashboard() {
    this.router.navigate(['/dashboard'], { replaceUrl: true });
  }
}