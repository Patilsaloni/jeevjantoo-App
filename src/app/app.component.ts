import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class AppComponent {
  constructor() {
    console.log('AppComponent initialized');

    // ✅ Use enum instead of string
    Keyboard.setResizeMode({ mode: KeyboardResize.Ionic });
    // Or: KeyboardResize.Body / KeyboardResize.Native / KeyboardResize.None
  }
}
