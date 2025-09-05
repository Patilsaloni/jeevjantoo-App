import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.page.html',
  styleUrls: ['./clinics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClinicsPage implements OnInit {
  clinics: any[] = [];
  loading = true;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadClinics();
  }

  async loadClinics() {
  this.loading = true;
  try {
    this.clinics = await this.firebaseService.getInformation('veterinaryClinic');
    
    this.clinics.forEach(clinic => {
      // Convert lat/lng to numbers if possible
      const lat = parseFloat(clinic.lat);
      const lng = parseFloat(clinic.lng);

      if (!isNaN(lat) && !isNaN(lng)) {
        clinic.lat = lat;
        clinic.lng = lng;
        clinic.hasLocation = true;
      } else {
        clinic.hasLocation = false;
      }
    });

  } catch (error) {
    console.error('Error loading clinics:', error);
    this.clinics = [];
  } finally {
    this.loading = false;
  }
}

openMap(clinic: any) {
  if (clinic.hasLocation) {
    const mapUrl = `https://www.google.com/maps?q=${clinic.lat},${clinic.lng}`;
    window.open(mapUrl, '_blank');
  } else {
    alert('Location not available for this clinic');
  }
}


  formatTiming(timeFrom: string, timeTo: string) {
    if (!timeFrom || !timeTo) return 'Timing not available';
    return `${timeFrom} - ${timeTo}`;
  }
}
