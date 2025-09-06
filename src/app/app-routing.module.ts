import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./splash/splash.page').then(m => m.SplashPage),
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./signin/signin.page').then(m => m.SigninPage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.page').then(m => m.SignupPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./onboarding/onboarding.page').then(m => m.OnboardingPage),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: '**',
    redirectTo: 'splash',
  },
];

