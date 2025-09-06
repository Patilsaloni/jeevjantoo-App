import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule) },
      { path: 'adoption', loadChildren: () => import('../adoption/adoption.module').then(m => m.AdoptionPageModule) },
      { path: 'directory', loadComponent: () => import('../directory/directory.page').then(m => m.DirectoryPage) },

      // Separate routes for each detail page
      { path: 'directory/clinics', loadComponent: () => import('../directory/clinics/clinics.page').then(m => m.ClinicsPage) },
      { path: 'directory/ngos', loadComponent: () => import('../directory/ngos/ngos.page').then(m => m.NgosPage) },
      { path: 'directory/ambulance', loadComponent: () => import('../directory/ambulance/ambulance.page').then(m => m.AmbulancePage) },
      { path: 'directory/boarding', loadComponent: () => import('../directory/boarding/boarding.page').then(m => m.BoardingPage) },
      { path: 'directory/ghelpline', loadComponent: () => import('../directory/ghelpline/ghelpline.page').then(m => m.GhelplinePage) },
      { path: 'directory/feeding', loadComponent: () => import('../directory/feeding/feeding.page').then(m => m.FeedingPage) },
      { path: 'directory/insurance', loadComponent: () => import('../directory/insurance/insurance.page').then(m => m.InsurancePage) },
      {
  path: 'events',
  loadComponent: () =>
    import('../directory/events/events.page').then(m => m.EventsPage),
},
{
  path: 'abc',
  loadComponent: () =>
    import('../directory/abc/abc.page').then(m => m.AbcPage),
},

      { path: 'profile', loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule) },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
