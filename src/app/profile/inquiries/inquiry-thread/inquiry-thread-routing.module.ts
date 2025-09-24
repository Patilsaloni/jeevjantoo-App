import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InquiryThreadPage } from './inquiry-thread.page';

const routes: Routes = [{ path: '', component: InquiryThreadPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InquiryThreadPageRoutingModule {}
