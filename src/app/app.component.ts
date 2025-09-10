import { Component } from '@angular/core';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { getAuth, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';

const app = initializeApp(environment.firebaseConfig);
const auth = getAuth(app);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class AppComponent {
  constructor(private router: Router, private toastCtrl: ToastController) {
    Keyboard.setResizeMode({ mode: KeyboardResize.None });
  }

  ngOnInit() {
    Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-open');
    });

    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-open');
    });
  }

  // ---------------- Logout ----------------
  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      this.router.navigate(['/signin'], { replaceUrl: true });
      this.showToast('Logged out successfully', 'success');
    } catch (error: any) {
      console.error('Logout failed:', error);
      this.showToast(error.message || 'Logout failed', 'danger');
    }
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    toast.present();
  }
}
