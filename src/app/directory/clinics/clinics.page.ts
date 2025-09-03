// src/app/directory/clinics/clinics.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DirectoryService } from 'src/app/services/directory.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.page.html',
  styleUrls: ['./clinics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ClinicsPage implements OnInit {
  clinics: any[] = [];
  loading = true;

  constructor(private directoryService: DirectoryService) {}

  ngOnInit() {
    this.loadClinics();
  }

  loadClinics() {
    this.loading = true;
    this.directoryService.getClinics().subscribe({
      next: (res: any) => {
        this.clinics = res.data || [];
        this.loading = false;
      },
      error: err => {
        console.error('Error loading clinics', err);
        this.clinics = [];
        this.loading = false;
      }
    });
  }
}
