import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectoryPage } from './directory.page';

const routes: Routes = [
  {
    path: '',
    component: DirectoryPage,
    children: [
      {
        path: 'clinics',
        loadComponent: () =>
          import('./clinics/clinics.page').then(m => m.ClinicsPage),
      },
      {
        path: 'abc',
        loadComponent: () =>
          import('./abc/abc.page').then(m => m.AbcPage),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./events/events.page').then(m => m.EventsPage),
      },
      {
        path: 'ngos',
        loadComponent: () =>
          import('./ngos/ngos.page').then(m => m.NgosPage),
      },
      {
        path: 'ambulance',
        loadComponent: () =>
          import('./ambulance/ambulance.page').then(m => m.AmbulancePage),
      },
      {
        path: 'boarding',
        loadComponent: () =>
          import('./boarding/boarding.page').then(m => m.BoardingPage),
      },
      {
        path: 'ghelpline',
        loadComponent: () =>
          import('./ghelpline/ghelpline.page').then(m => m.GhelplinePage),
      },
      {
        path: 'feeding',
        loadComponent: () =>
          import('./feeding/feeding.page').then(m => m.FeedingPage),
      },
      {
        path: 'insurance',
        loadComponent: () =>
          import('./insurance/insurance.page').then(m => m.InsurancePage),
      },
      {
        path: '',
        redirectTo: 'clinics',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectoryPageRoutingModule {}
