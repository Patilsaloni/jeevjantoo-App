import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from '../tabs/tabs.page';
import { AuthGuard } from '../guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [AuthGuard],       // Protect parent route
    canActivateChild: [AuthGuard],  // Protect all child routes
    children: [
      { path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule) },
      { path: 'adoption', loadChildren: () => import('../adoption/adoption.module').then(m => m.AdoptionPageModule) },

      // Directory Main
      { path: 'directory', loadComponent: () => import('../directory/directory.page').then(m => m.DirectoryPage) },

      // Directory Children
      { path: 'directory/clinics', loadComponent: () => import('../directory/clinics/clinics.page').then(m => m.ClinicsPage) },
      { path: 'directory/ngos', loadComponent: () => import('../directory/ngos/ngos.page').then(m => m.NgosPage) },
      { path: 'directory/events', loadComponent: () => import('../directory/events/events.page').then(m => m.EventsPage) },
      { path: 'directory/events/:id', loadComponent: () => import('../directory/events/event-details/event-details.page').then(m => m.EventDetailsPage) },
      { path: 'directory/abc', loadComponent: () => import('../directory/abc/abc.page').then(m => m.AbcPage) },
      { path: 'directory/abc/:id', loadComponent: () => import('../directory/abc/abc-details/abc-details.page').then(m => m.AbcDetailsPage) },
      { path: 'directory/ambulance', loadComponent: () => import('../directory/ambulance/ambulance.page').then(m => m.AmbulancePage) },
      { path: 'directory/boarding', loadComponent: () => import('../directory/boarding/boarding.page').then(m => m.BoardingPage) },
      { path: 'directory/ghelpline', loadComponent: () => import('../directory/ghelpline/ghelpline.page').then(m => m.GhelplinePage) },
      { path: 'directory/feeding', loadComponent: () => import('../directory/feeding/feeding.page').then(m => m.FeedingPage) },
      { path: 'directory/insurance', loadComponent: () => import('../directory/insurance/insurance.page').then(m => m.InsurancePage) },

      { path: 'profile', loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule) },

      // Default redirect
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
