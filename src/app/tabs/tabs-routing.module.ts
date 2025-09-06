import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then(m => m.HomePageModule),
      },

      {
        path: 'adoption',
        loadChildren: () =>
          import('../adoption/adoption.module').then(m => m.AdoptionPageModule),
      },
      {
  path: 'directory',
  loadChildren: () =>
    import('../directory/directory.module').then(m => m.DirectoryPageModule),
},
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then(m => m.ProfilePageModule),
      },
      {
        path: '',
        redirectTo: 'home',
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
