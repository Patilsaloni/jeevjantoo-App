import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  showMenu = true;

  constructor(private router: Router, private toastCtrl: ToastController) {
    Keyboard.setResizeMode({ mode: KeyboardResize.None });

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = (event.urlAfterRedirects || event.url).split('?')[0].split('#')[0];

        // Exact paths where the menu should be hidden
        const hideOnExact = new Set<string>([
          '/signin',
          '/splash',
          '/onboarding',
          '/forgot-password',
          '/signup'
        ]);

        // Prefixes (use if you want to hide whole route groups)
        const hideOnPrefix: string[] = [
          // '/auth', '/welcome'
        ];

        const hiddenByExact = hideOnExact.has(url);
        const hiddenByPrefix = hideOnPrefix.some(p => url.startsWith(p));

        this.showMenu = !(hiddenByExact || hiddenByPrefix);
      });
  }

  ngOnInit() {
    Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-open');
    });

    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-open');
    });
  }

  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      this.router.navigate(['/signin'], { replaceUrl: true });
      this.showToast('Logged out successfully', 'success');
    } catch (error: any) {
      this.showToast(error.message || 'Logout failed', 'danger');
    }
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    await toast.present();
  }

  // ✅ Fixed typo: navigareToHome → navigateToHome
  navigateToHome() { this.router.navigate(['/tabs/home']); }
  navigateToProfile() { this.router.navigate(['/tabs/profile']); }
  navigateToAdopt() { this.router.navigate(['/tabs/adoption']); }
}
