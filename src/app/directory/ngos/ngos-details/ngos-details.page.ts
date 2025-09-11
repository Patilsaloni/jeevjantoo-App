import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-ngos-details',
  templateUrl: './ngos-details.page.html',
  styleUrls: ['./ngos-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NgosDetailsPage implements OnInit {
  ngo: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) await this.loadNGO(id);
  }

  async loadNGO(id: string) {
    this.loading = true;
    try {
      const ngos = await this.firebaseService.getInformation('ngos');
      this.ngo = ngos.find((n: any) => n.id === id);
    } catch (err) {
      console.error('Error loading NGO:', err);
      this.ngo = null;
    } finally {
      this.loading = false;
    }
  }

  callNGO() {
    if (this.ngo?.contact) {
      window.open(`tel:${this.ngo.contact}`, '_system');
    } else {
      alert('Contact not available');
    }
  }

  openWhatsApp() {
    if (this.ngo?.contact) {
      const phone = this.ngo.contact.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_blank');
    } else {
      alert('WhatsApp not available');
    }
  }

  openMap() {
    if (this.ngo?.lat && this.ngo?.lng) {
      const url = `https://www.google.com/maps?q=${this.ngo.lat},${this.ngo.lng}`;
      window.open(url, '_blank');
    } else {
      alert('Location not available');
    }
  }

  saveNGO() {
    // later integrate Firebase/local storage
    alert('Saved to favorites');
  }

  shareNGO() {
    if (navigator.share && this.ngo) {
      navigator.share({
        title: this.ngo.name,
        text: `Check out ${this.ngo.name}`,
        url: window.location.href
      });
    } else {
      alert('Share not supported on this device');
    }
  }

  reportNGO() {
    // future: send to Firebase "reports" collection
    alert('Reported to admin');
  }
}
