import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../home/dashboard.module').then(m => m.DashboardPageModule),
      },
      {
        path: 'adoption',
        loadChildren: () =>
          import('../adoption/adoption.module').then(m => m.AdoptionPageModule),
      },
      {
        path: 'care',
        loadChildren: () =>
          import('../animalcare/animalcare.module').then(m => m.AnimalcarePageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then(m => m.ProfilePageModule),
      },
      {
        path: '',
        redirectTo: 'dashboard', // ✅ relative, not /tabs/dashboard
        pathMatch: 'full',
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
