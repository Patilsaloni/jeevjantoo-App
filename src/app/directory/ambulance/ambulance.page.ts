import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DirectoryService } from 'src/app/services/directory.service';

@Component({
  selector: 'app-ambulance',
  templateUrl: './ambulance.page.html',
  styleUrls: ['./ambulance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],  // ✅ must include IonicModule
   schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AmbulancePage implements OnInit {
  ambulances: any[] = [];
  loading = true;

  constructor(private directoryService: DirectoryService) { }

  ngOnInit() {
    this.loadAmbulances();
  }

  loadAmbulances() {
    this.loading = true;
    this.directoryService.getAmbulances({ page: 1, pageSize: 10 }).subscribe({
      next: (res: any) => {
        this.ambulances = (res.data || [])
          .filter((amb: any) => amb.status === 'active')
          .map((amb: any) => ({
            name: amb.name,
            location: amb.location || 'Unknown',
            contact: amb.contact || 'N/A',
            status: amb.status,
            vehicle_number: amb.vehicle_number || 'N/A',
            governing_body: amb.governing_body || 'N/A',
            area: amb.area || 'N/A',
            distance: amb.distance ? amb.distance.toFixed(2) + ' km' : 'N/A'
          }));
        this.loading = false;
      },
      error: () => {
        this.ambulances = [];
        this.loading = false;
      }
    });
  }

  trackAmbulance(amb: any) {
    const location = encodeURIComponent(amb.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
  }
}
