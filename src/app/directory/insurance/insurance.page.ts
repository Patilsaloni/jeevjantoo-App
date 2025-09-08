import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsuranceDetailModal } from './insurance-detail-modal/insurance-detail-modal.component';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.page.html',
  styleUrls: ['./insurance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InsurancePage implements OnInit {
  insurances: any[] = [];
  filteredInsurances: any[] = [];
  loading = true;

  filters = {
    q: '',
    city: ''
  };

  constructor(
    private firebaseService: FirebaseService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    await this.loadInsurances();
  }

  async loadInsurances() {
    this.loading = true;
    try {
      this.insurances = await this.firebaseService.getInformation('medical-insurance');
      this.applyFilters();
    } catch (err) {
      console.error('Error fetching insurance:', err);
      this.insurances = [];
      this.filteredInsurances = [];
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    this.filteredInsurances = this.insurances.filter(ins => {
      const matchQuery = this.filters.q
        ? ins.providerName?.toLowerCase().includes(this.filters.q.toLowerCase())
        : true;

      const matchCity = this.filters.city
        ? ins.city?.toLowerCase().includes(this.filters.city.toLowerCase())
        : true;

      return matchQuery && matchCity;
    });
  }

  async openDetail(item: any) {
    const modal = await this.modalCtrl.create({
      component: InsuranceDetailModal,
      componentProps: { insurance: item }
    });
    await modal.present();
  }
}
