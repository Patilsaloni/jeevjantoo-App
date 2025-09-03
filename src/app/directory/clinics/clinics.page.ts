import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DirectoryService } from 'src/app/services/directory.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  
  constructor(
    private route: ActivatedRoute,
    private directoryService: DirectoryService
  ) {}

  ngOnInit() {
    const type = this.route.snapshot.queryParamMap.get('type'); // dynamic from Dashboard
    const city = this.route.snapshot.queryParamMap.get('city'); // optional filter
    this.loadClinics({ type, city });
  }

  loadClinics(params?: any) {
    this.loading = true;
    this.directoryService.getClinics(params).subscribe({
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
