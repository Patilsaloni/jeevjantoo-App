import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

// 🟢 Define Interface for Feeding Point
interface FeedingPoint {
  id: string;
  name?: string;
  contact?: string;
  address?: string;
  individual?: string; // 'Y' | 'N'
  lat?: number | null;
  lng?: number | null;
  food_items: string[];  // ✅ always array
  city?: string;
   expanded?: boolean;
  variant?: string;
}

@Component({
  selector: 'app-feeding',
  templateUrl: './feeding.page.html',
  styleUrls: ['./feeding.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeedingPage implements OnInit {
  feedingPoints: FeedingPoint[] = [];
  filteredPoints: FeedingPoint[] = [];
  loading = true;

  // Filters
  searchTerm = '';
  selectedCity: string = '';
  selectedType: string = ''; // 'individual' | 'community' | ''

  constructor(
    private firebaseService: FirebaseService,
    private actionSheetCtrl: ActionSheetController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFeedingPoints();
  }

  // ✅ Fetch feeding points & normalize food_items
  async loadFeedingPoints() {
    this.loading = true;
    try {
      let data: any[] = await this.firebaseService.getInformation('food') || [];

      this.feedingPoints = data.map((fp, index) => {
        let items: string[] = [];

        if (Array.isArray(fp.food_items)) {
          items = fp.food_items;
        } else if (typeof fp.food_items === 'string') {
          items = fp.food_items.split(',').map((item: string) => item.trim());
        }

        return {
          ...fp,
          food_items: items,  // ✅ always string[]
          lat: fp.lat ?? null,
          lng: fp.lng ?? null,
           expanded: false,
          variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
        } as FeedingPoint;
      });

      this.applyFilters();
    } catch (err) {
      console.error('Error fetching feeding points:', err);
      this.feedingPoints = [];
      this.filteredPoints = [];
    } finally {
      this.loading = false;
    }
  }

  // ✅ Apply search, city & type filters
  applyFilters() {
    this.filteredPoints = this.feedingPoints.filter(fp => {
      const matchSearch = this.searchTerm
        ? fp.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          fp.address?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          fp.food_items.some(item =>
            item.toLowerCase().includes(this.searchTerm.toLowerCase()))
        : true;

      const matchCity = this.selectedCity
        ? fp.address?.toLowerCase().includes(this.selectedCity.toLowerCase())
        : true;

      const matchType = this.selectedType
        ? (this.selectedType === 'individual'
            ? fp.individual === 'Y'
            : fp.individual === 'N')
        : true;

      return matchSearch && matchCity && matchType;
    });
  }

  // 📱 Action Sheet (Call, WhatsApp, Maps, Report)
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

  // 📞 Call
  call(contact: string) {
    if (contact) window.open(`tel:${contact}`, '_system');
  }

  // 💬 WhatsApp
  whatsapp(contact: string) {
    if (contact) {
      const phone = contact.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_system');
    }
  }

  // 📍 Maps
  openInMaps(lat?: number | null, lng?: number | null) {
    if (lat != null && lng != null) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_system');
    } else {
      alert("Location not available");
    }
  }

  // 🚩 Report
  report(fp: FeedingPoint) {
    alert(`Report submitted for: ${fp.name}`);
    // TODO: send to Firebase / backend queue
  }

  // 📄 View details page
  viewDetails(fp: FeedingPoint) {
  this.router.navigate([`tabs/directory/feeding/${fp.id}`]); // use backticks
}

}
