import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

interface Boarding {
  id: string;
  name: string;
  contact: string;
  state: string;
  city: string;
  area: string;
  pincode: string;
  timeFrom: string;
  timeTo: string;
  lat: number;
  lng: number;
  status: string;
}

@Component({
  selector: 'app-boarding',
  templateUrl: './boarding.page.html',
  styleUrls: ['./boarding.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BoardingPage implements OnInit {

  boardingSpas: Boarding[] = [];
  loading = true;

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.loadBoardings();
  }

  async loadBoardings() {
    this.loading = true;
    try {
      const res = await this.firebaseService.getInformation('boardings'); // Firestore collection
      this.boardingSpas = res
        .filter((b: any) => b.status?.toLowerCase() === 'active')
        .map((b: any) => ({
          id: b.id,
          name: b.name || 'Unknown',
          contact: b.contact || 'N/A',
          state: b.state || 'N/A',
          city: b.city || 'N/A',
          area: b.area || 'N/A',
          pincode: b.pincode || 'N/A',
          timeFrom: b.timeFrom || 'N/A',
          timeTo: b.timeTo || 'N/A',
          lat: b.lat ?? 0,
          lng: b.lng ?? 0,
          status: b.status || 'inactive',
        }));
    } catch (err) {
      console.error('Failed to load boardings:', err);
      this.boardingSpas = [];
    } finally {
      this.loading = false;
    }
  }

  trackLocation(spa: Boarding) {
    if (!spa.lat || !spa.lng) {
      alert("Location not available");
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${spa.lat},${spa.lng}`;
    window.open(url, "_blank");
  }

  viewDetails(spa: Boarding) {
  this.router.navigate([`/tabs/directory/boarding/${spa.id}`]);
}

}
