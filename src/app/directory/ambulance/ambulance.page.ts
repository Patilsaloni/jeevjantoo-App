import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';

interface Ambulance {
  id: string;
  name: string;
  contact: string;
  status: string;
  vehicle_number: string;
  governing_body: string;
  area: string;
  lat?: number;
  lng?: number;
}

@Component({
  selector: 'app-ambulance',
  templateUrl: './ambulance.page.html',
  styleUrls: ['./ambulance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AmbulancePage implements OnInit {
  ambulances: Ambulance[] = [];
  loading = true;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadAmbulances();
  }

  async loadAmbulances() {
    this.loading = true;
    try {
      // 🔹 Make sure the collection name matches the one in admin
      const res = await this.firebaseService.getInformation('ambulance'); 
      this.ambulances = res
        .filter((amb: any) => amb.status?.toLowerCase() === 'active')
        .map((amb: any) => ({
          id: amb.id,
          name: amb.name || 'Unknown',
          contact: amb.contact || 'N/A',
          status: amb.status || 'inactive',
          vehicle_number: amb.vehicleNumber || 'N/A',
          governing_body: amb.govtBody || 'N/A',
          area: amb.area || 'N/A',
          lat: amb.lat,
          lng: amb.lng
        }));
    } catch (err) {
      console.error('Failed to load ambulances:', err);
      this.ambulances = [];
    } finally {
      this.loading = false;
    }
  }

  trackAmbulance(amb: Ambulance) {
    if (amb.lat == null || amb.lng == null) {
      alert('Location not available');
      return;
    }
    const query = `${amb.lat},${amb.lng}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }
  saveAmbulance(amb: any) {
  console.log('Ambulance saved:', amb);
  // You can later implement saving to Firebase or localStorage
}

}
