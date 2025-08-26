import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // For Ionic components
import { RouterModule } from '@angular/router'; // For routerLink

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true, // Ensure standalone
  imports: [IonicModule, RouterModule] // Add necessary imports
})
export class AppComponent {
  constructor() {
    console.log('AppComponent initialized');
  }
}