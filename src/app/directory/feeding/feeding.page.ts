// import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { IonicModule, ActionSheetController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { FirebaseService } from 'src/app/services/firebase.service';
// import { Router } from '@angular/router';

// // 🟢 Define Interface for Feeding Point
// interface FeedingPoint {
//   id: string;
//   name?: string;
//   contact?: string;
//   address?: string;
//   individual?: string; // 'Y' | 'N'
//   lat?: number | null;
//   lng?: number | null;
//   food_items: string[];  // ✅ always array
//   city?: string;
//    expanded?: boolean;
//   variant?: string;
// }

// @Component({
//   selector: 'app-feeding',
//   templateUrl: './feeding.page.html',
//   styleUrls: ['./feeding.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA]
// })
// export class FeedingPage implements OnInit {
//   feedingPoints: FeedingPoint[] = [];
//   filteredPoints: FeedingPoint[] = [];
//   loading = true;

//   // Filters
//   searchTerm = '';
//   selectedCity: string = '';
//   selectedType: string = ''; // 'individual' | 'community' | ''

//   constructor(
//     private firebaseService: FirebaseService,
//     private actionSheetCtrl: ActionSheetController,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.loadFeedingPoints();
//   }

//   // ✅ Fetch feeding points & normalize food_items
//   async loadFeedingPoints() {
//     this.loading = true;
//     try {
//       let data: any[] = await this.firebaseService.getInformation('food') || [];

//       this.feedingPoints = data.map((fp, index) => {
//         let items: string[] = [];

//         if (Array.isArray(fp.food_items)) {
//           items = fp.food_items;
//         } else if (typeof fp.food_items === 'string') {
//           items = fp.food_items.split(',').map((item: string) => item.trim());
//         }

//         return {
//           ...fp,
//           food_items: items,  // ✅ always string[]
//           lat: fp.lat ?? null,
//           lng: fp.lng ?? null,
//            expanded: false,
//           variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
//         } as FeedingPoint;
//       });

//       this.applyFilters();
//     } catch (err) {
//       console.error('Error fetching feeding points:', err);
//       this.feedingPoints = [];
//       this.filteredPoints = [];
//     } finally {
//       this.loading = false;
//     }
//   }

//   // ✅ Apply search, city & type filters
//   applyFilters() {
//     this.filteredPoints = this.feedingPoints.filter(fp => {
//       const matchSearch = this.searchTerm
//         ? fp.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//           fp.address?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//           fp.food_items.some(item =>
//             item.toLowerCase().includes(this.searchTerm.toLowerCase()))
//         : true;

//       const matchCity = this.selectedCity
//         ? fp.address?.toLowerCase().includes(this.selectedCity.toLowerCase())
//         : true;

//       const matchType = this.selectedType
//         ? (this.selectedType === 'individual'
//             ? fp.individual === 'Y'
//             : fp.individual === 'N')
//         : true;

//       return matchSearch && matchCity && matchType;
//     });
//   }

//   // 📱 Action Sheet (Call, WhatsApp, Maps, Report)
//   async openActions(fp: FeedingPoint) {
//     const actionSheet = await this.actionSheetCtrl.create({
//       header: fp.name,
//       buttons: [
//         { text: '📞 Call', handler: () => this.call(fp.contact || '') },
//         { text: '💬 WhatsApp', handler: () => this.whatsapp(fp.contact || '') },
//         { text: '📍 Open in Maps', handler: () => this.openInMaps(fp.lat, fp.lng) },
//         { text: '🚩 Report', handler: () => this.report(fp) },
//         { text: '❌ Cancel', role: 'cancel' }
//       ]
//     });
//     await actionSheet.present();
//   }

//   // 📞 Call
//   call(contact: string) {
//     if (contact) window.open(`tel:${contact}`, '_system');
//   }

//   // 💬 WhatsApp
//   whatsapp(contact: string) {
//     if (contact) {
//       const phone = contact.replace(/\D/g, '');
//       window.open(`https://wa.me/${phone}`, '_system');
//     }
//   }

//   // 📍 Maps
//   openInMaps(lat?: number | null, lng?: number | null) {
//     if (lat != null && lng != null) {
//       window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_system');
//     } else {
//       alert("Location not available");
//     }
//   }

//   // 🚩 Report
//   report(fp: FeedingPoint) {
//     alert(`Report submitted for: ${fp.name}`);
//     // TODO: send to Firebase / backend queue
//   }

//   // 📄 View details page
//   viewDetails(fp: FeedingPoint) {
//   this.router.navigate([`tabs/directory/feeding/${fp.id}`]); // use backticks
// }

// }



import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { IonicModule, ActionSheetController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { FilterModalComponent } from 'src/app/filter-modal/filter-modal.component';

// 🟢 Define Interface for Feeding Point
interface FeedingPoint {
  id: string;
  name?: string;
  contact?: string;
  address?: string;
  individual?: string; // 'Y' | 'N'
  lat?: number | null;
  lng?: number | null;
  food_items: string[]; // ✅ always array
  city?: string;
<<<<<<< HEAD
  expanded?: boolean;
=======
   expanded?: boolean;
>>>>>>> 325d64b (done)
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
  searchTerm = '';
  filters = { type: '', address: '', food_item: '' };
  types: string[] = ['Individual', 'NGO'];
  addresses: string[] = [];
  foodItems: string[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadFeedingPoints();
  }

  // ✅ Fetch feeding points & normalize food_items
  async loadFeedingPoints() {
    this.loading = true;
    try {
      let data: any[] = await this.firebaseService.getInformation('food') || [];
<<<<<<< HEAD
=======

>>>>>>> 325d64b (done)
      this.feedingPoints = data.map((fp, index) => {
        let items: string[] = [];
        if (Array.isArray(fp.food_items)) {
          items = fp.food_items;
        } else if (typeof fp.food_items === 'string') {
          items = fp.food_items.split(',').map((item: string) => item.trim());
        }
        return {
          id: fp.id || 'unknown-' + index,
          name: fp.name || 'Unknown',
          contact: fp.contact || 'N/A',
          address: fp.address || 'N/A',
          individual: fp.individual || 'N',
          lat: fp.lat ?? null,
          lng: fp.lng ?? null,
<<<<<<< HEAD
          food_items: items,
          city: fp.city || 'N/A',
          expanded: false,
          variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
        };
=======
           expanded: false,
          variant: ['a', 'b', 'c', 'd', 'e'][index % 5]
        } as FeedingPoint;
>>>>>>> 325d64b (done)
      });
      this.filteredPoints = [...this.feedingPoints];
      this.addresses = Array.from(
        new Set(this.feedingPoints.map(f => f.address).filter((a): a is string => a != null && a !== 'N/A'))
      ).sort();
      this.foodItems = Array.from(new Set(this.feedingPoints.flatMap(f => f.food_items).filter(item => item))).sort();
      console.log('Loaded Feeding Points:', this.feedingPoints);
      console.log('Addresses:', this.addresses);
      console.log('Food Items:', this.foodItems);
      this.applyFilters();
    } catch (err) {
      console.error('Error fetching feeding points:', err);
      this.feedingPoints = [];
      this.filteredPoints = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  filterFeedingPoints(event: any) {
    this.searchTerm = (event?.target?.value || '').toLowerCase().trim();
    console.log('Search Term:', this.searchTerm); // Debug: Log search term
    this.applyFilters();
  }

  applyFilters() {
    this.filteredPoints = this.feedingPoints.filter(fp => {
      const matchSearch = this.searchTerm
        ? ((fp.name || '').toLowerCase().includes(this.searchTerm) ||
           (fp.address || '').toLowerCase().includes(this.searchTerm) ||
           fp.food_items.some(item => item.toLowerCase().includes(this.searchTerm)))
        : true;
      const matchType = this.filters.type
        ? (this.filters.type === 'Individual' ? fp.individual === 'Y' : fp.individual === 'N')
        : true;
      const matchAddress = this.filters.address ? fp.address === this.filters.address : true;
      const matchFood = this.filters.food_item ? fp.food_items.includes(this.filters.food_item) : true;
      console.log('Feeding Point:', fp.id, 'Matches Search:', matchSearch, 'Search Term:', this.searchTerm); // Debug: Log filter results
      return matchSearch && matchType && matchAddress && matchFood;
    });
    console.log('Filtered Points Length:', this.filteredPoints.length, 'Filtered Points:', this.filteredPoints);
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterModalComponent,
      cssClass: 'filter-popup-modal',
      componentProps: {
        filters: { ...this.filters },
        filterType: 'feeding',
        filterConfig: [
          { key: 'type', label: 'Type', type: 'dropdown', options: this.types },
          { key: 'address', label: 'Address', type: 'dropdown', options: this.addresses },
          { key: 'food_item', label: 'Food Item', type: 'dropdown', options: this.foodItems }
        ]
      }
    });
    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.filters = { ...data };
        console.log('Updated Filters:', this.filters); // Debug: Log filters
        this.applyFilters();
      }
    });
    await modal.present();
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
    this.router.navigate([`tabs/directory/feeding/${fp.id}`]);
  }
}