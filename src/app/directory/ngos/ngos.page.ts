import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';

interface NGO {
  id: string;
  name: string;
  individual: string;
  state: string;
  city: string;
  pincode: string;
  contact: string;
  status: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-ngos',
  templateUrl: './ngos.page.html',
  styleUrls: ['./ngos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgosPage implements OnInit {
  ngos: NGO[] = [];
  loading = true;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadNGOs();
  }

  async loadNGOs() {
    this.loading = true;
    try {
      const res = await this.firebaseService.getInformation('ngos'); // Firestore collection
      this.ngos = res
        .filter((ngo: any) => ngo.status?.toLowerCase() === 'active')
        .map((ngo: any) => ({
          id: ngo.id,
          name: ngo.name || 'Unknown',
          individual: ngo.individual || 'N/A',
          state: ngo.state || 'N/A',
          city: ngo.city || 'N/A',
          pincode: ngo.pincode || 'N/A',
          contact: ngo.contact || 'N/A',
          status: ngo.status || 'Inactive',
          lat: ngo.lat ?? 0,
          lng: ngo.lng ?? 0,
        }));
    } catch (err) {
      console.error('Failed to load NGOs:', err);
      this.ngos = [];
    } finally {
      this.loading = false;
    }
  }

  trackNGO(ngo: NGO) {
    if (!ngo.lat || !ngo.lng) {
      alert('Location not available for this NGO');
      return;
    }
    const query = encodeURIComponent(`${ngo.lat},${ngo.lng}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }
}
