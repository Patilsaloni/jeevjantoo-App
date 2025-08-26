import { Routes } from '@angular/router';

// Export routes to make them available in main.ts
export const routes: Routes = [
  {
    path: 'adoption',
    loadComponent: () => import('./adoption/adoption.page').then(m => m.AdoptionPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./onboarding/onboarding.page').then(m => m.OnboardingPage)
  },
  {
    path: 'pets',
    loadComponent: () => import('./pets/pets.page').then(m => m.PetsPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage)
  },
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full'
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then( m => m.ContactPageModule)
  }
];