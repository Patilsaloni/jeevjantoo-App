import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectoryService } from 'src/app/services/directory.service';

// ✅ Correct import
import { HelplineDetailModalComponent } from './helpline-detail-modal/helpline-detail-modal.component';

@Component({
  selector: 'app-ghelpline',
  templateUrl: './ghelpline.page.html',
  styleUrls: ['./ghelpline.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GhelplinePage implements OnInit {
  helplines: any[] = [];
  loading = true;
  searchTerm = '';
  selectedCity = '';
  selectedService = '';

  constructor(
    private directoryService: DirectoryService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadHelplines();
  }

  loadHelplines() {
    this.loading = true;
    this.directoryService.getGovtHelpline({
      q: this.searchTerm,
      city: this.selectedCity,
      service: this.selectedService,
      page: 1,
      pageSize: 20
    }).subscribe({
      next: (res: any) => {
        this.helplines = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.helplines = [];
        this.loading = false;
      }
    });
  }

  // ✅ Open detail modal
  async openDetails(helpline: any) {
    const modal = await this.modalCtrl.create({
      component: HelplineDetailModalComponent,
      componentProps: { helpline }
    });
    await modal.present();
  }
}
