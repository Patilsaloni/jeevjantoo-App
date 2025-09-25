import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./inquiries.page').then(m => m.InquiriesPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./inquiry-thread/inquiry-thread.page').then(m => m.InquiryThreadPage),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InquiriesPageRoutingModule {}
