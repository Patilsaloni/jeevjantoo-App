import { Routes } from '@angular/router';

export const routes: Routes = [
  // 🔹 Default route → Splash screen
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },

  // 🔹 Splash screen
  {
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then(m => m.SplashPage)
  },

  // 🔹 Authentication
  {
    path: 'signin',
    loadComponent: () => import('./signin/signin.page').then(m => m.SigninPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
  },

  // 🔹 Onboarding
  {
    path: 'onboarding',
    loadComponent: () => import('./onboarding/onboarding.page').then(m => m.OnboardingPage)
  },

  // 🔹 Main app pages
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'adoption',
    loadComponent: () => import('./adoption/adoption.page').then(m => m.AdoptionPage)
  },
  {
    path: 'pets',
    loadComponent: () => import('./pets/pets.page').then(m => m.PetsPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage)
  },

  // 🔹 Contact page (if you still want it module-based)
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactPageModule)
  },

  // 🔹 Fallback route (optional)
  {
    path: '**',
    redirectTo: 'splash'
  }
];
