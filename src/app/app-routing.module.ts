import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default route → Splash screen
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },

  // Splash screen
  {
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then(m => m.SplashPage)
  },

  // Authentication
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

  // Onboarding
  {
    path: 'onboarding',
    loadComponent: () => import('./onboarding/onboarding.page').then(m => m.OnboardingPage)
  },

  // Main app pages
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

  // Contact (module-based)
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactPageModule)
  },

  // Directory lazy-loaded pages
  {
    path: 'clinics',
    loadChildren: () => import('./directory/clinics/clinics.module').then(m => m.ClinicsPageModule)
  },
  {
    path: 'ngos',
    loadChildren: () => import('./directory/ngos/ngos.module').then(m => m.NgosPageModule)
  },
  {
    path: 'ambulance',
    loadChildren: () => import('./directory/ambulance/ambulance.module').then(m => m.AmbulancePageModule)
  },
  {
    path: 'boarding',
    loadChildren: () => import('./directory/boarding/boarding.module').then(m => m.BoardingPageModule)
  },
  {
    path: 'ghelpline',
    loadChildren: () => import('./directory/ghelpline/ghelpline.module').then(m => m.GhelplinePageModule)
  },
  {
    path: 'feeding',
    loadChildren: () => import('./directory/feeding/feeding.module').then(m => m.FeedingPageModule)
  },
  {
    path: 'insurance',
    loadChildren: () => import('./directory/insurance/insurance.module').then(m => m.InsurancePageModule)
  },
  {
    path: 'adoptions',
    loadChildren: () => import('./directory/adoptions/adoptions.module').then(m => m.AdoptionsPageModule)
  },

  // 🔹 Wildcard route (always last!)
  {
    path: '**',
    redirectTo: 'splash'
  },  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'animalcare',
    loadChildren: () => import('./animalcare/animalcare.module').then( m => m.AnimalcarePageModule)
  }

];

