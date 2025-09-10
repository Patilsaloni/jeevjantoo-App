import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ActionSheetController, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormsModule } from '@angular/forms';

interface FeedingPoint {
  id: string;
  name?: string;
  contact?: string;
  address?: string;
  individual?: string; // 'Y' | 'N'
  lat?: number | null;
  lng?: number | null;
  food_items: string[];
  city?: string;
}

@Component({
  selector: 'app-feeding-details',
  templateUrl: './feeding-details.page.html',
  styleUrls: ['./feeding-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeedingDetailsPage implements OnInit {

  feedingPoint: FeedingPoint | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.warn('No feeding point ID provided in route');
      this.loading = false;
      return;
    }
    console.log('Fetching feeding point with ID:', id);
    this.loadFeedingPoint(id);
  }

  async loadFeedingPoint(id: string) {
    this.loading = true;
    try {
      const data: any = await this.firebaseService.getDocument('food', id);
      console.log('Fetched feeding point data:', data);

      if (!data) {
        this.feedingPoint = null;
        console.warn('Feeding point not found in Firebase.');
        return;
      }

      // Normalize food_items to array
      let items: string[] = [];
      if (Array.isArray(data.food_items)) {
        items = data.food_items;
      } else if (typeof data.food_items === 'string') {
        items = data.food_items.split(',').map((i: string) => i.trim());
      }

      this.feedingPoint = {
        id: data.id,
        name: data.name || 'Unknown',
        contact: data.contact || 'N/A',
        address: data.address || 'N/A',
        individual: data.individual || 'N',
        city: data.city || '',
        food_items: items,
        lat: data.lat ?? null,
        lng: data.lng ?? null
      };
    } catch (err) {
      console.error('Error loading feeding point:', err);
      this.feedingPoint = null;
    } finally {
      this.loading = false;
    }
  }

  async openActions(fp: FeedingPoint) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: fp.name,
      buttons: [
        { text: '📞 Call', handler: () => this.call(fp.contact || '') },
        { text: '💬 WhatsApp', handler: () => this.whatsapp(fp.contact || '') },
        { text: '📍 Open in Maps', handler: () => this.openInMaps(fp.lat, fp.lng) },
        { text: '🚩 Report', handler: () => this.report(fp) },
        { text: '❌ Cancel', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  call(contact: string) {
    if (!contact) {
      alert('Contact number not available');
      return;
    }
    window.open(`tel:${contact}`, '_system');
  }

  whatsapp(contact: string) {
    if (!contact) {
      alert('WhatsApp number not available');
      return;
    }
    const phone = contact.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}`, '_system');
  }

  openInMaps(lat?: number | null, lng?: number | null) {
    if (lat != null && lng != null) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_system');
    } else {
      alert('Location not available');
    }
  }

  report(fp: FeedingPoint) {
    alert(`Report submitted for: ${fp.name}`);
    // TODO: implement Firebase reporting
  }
}
