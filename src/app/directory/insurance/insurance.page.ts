import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectoryService } from 'src/app/services/directory.service';
import { InsuranceDetailModal } from '../insurance/insurance-detail-modal/insurance-detail-modal.component';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.page.html',
  styleUrls: ['./insurance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InsurancePage implements OnInit {
  insurances: any[] = [];
  filters: any = {
    q: '',
    city: '',
    coverage_type: [],
    minSum: 0,
    maxPremium: 0
  };
  loading = true;

  constructor(
    private directoryService: DirectoryService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadInsurances();
  }

  loadInsurances() {
    this.loading = true;
    this.directoryService.getMedicalInsurance(this.filters).subscribe({
      next: (res: any) => {
        this.insurances = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.insurances = [];
        this.loading = false;
      }
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
