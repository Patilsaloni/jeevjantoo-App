import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HelplineDetailModalComponent } from './helpline-detail-modal/helpline-detail-modal.component';

// ✅ Define interface for helpline
interface GovtHelpline {
  id: string;
  helplineServices: string; // Service name
  contact: string;
  govtBody: string;
  remarks?: string;
  status: string;
  state?: string;
  city?: string;
  pincode?: string;
  timeFrom?: string;
  timeTo?: string;
}

@Component({
  selector: 'app-ghelpline',
  templateUrl: './ghelpline.page.html',
  styleUrls: ['./ghelpline.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GhelplinePage implements OnInit {
  helplines: GovtHelpline[] = [];
  loading = true;
  searchTerm = '';
  selectedCity = '';
  selectedService = '';

  constructor(
    private firebaseService: FirebaseService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadHelplines();
  }

  async loadHelplines() {
    this.loading = true;
    try {
      // ✅ Fetch all government helplines from Firestore
      const res = await this.firebaseService.getInformation('government-helpline');

      const helplinesData: GovtHelpline[] = res as GovtHelpline[];

      // ✅ Filter based on status, city, service, search term
      this.helplines = helplinesData
        .filter(h => h.status?.toLowerCase() === 'active')
        .filter(h => !this.selectedCity || (h.city && h.city.toLowerCase() === this.selectedCity.toLowerCase()))
        .filter(h => !this.selectedService || h.helplineServices.toLowerCase().includes(this.selectedService.toLowerCase()))
        .filter(h => !this.searchTerm || h.helplineServices.toLowerCase().includes(this.searchTerm.toLowerCase()));

    } catch (err) {
      console.error('Failed to load government helplines:', err);
      this.helplines = [];
    } finally {
      this.loading = false;
    }
  }

  // ✅ Open helpline detail modal
  async openDetails(helpline: GovtHelpline) {
    const modal = await this.modalCtrl.create({
      component: HelplineDetailModalComponent,
      componentProps: { helpline }
    });
    await modal.present();
  }
}
