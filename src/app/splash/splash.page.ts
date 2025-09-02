import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class SplashPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Navigate to Signin page after 2.5 seconds
    setTimeout(() => {
      this.router.navigate(['/onboarding'], { replaceUrl: true });
    }, 2500);
  }
}
