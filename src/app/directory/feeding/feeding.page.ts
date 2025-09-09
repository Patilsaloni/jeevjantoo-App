import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, ActionSheetController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-feeding',
  templateUrl: './feeding.page.html',
  styleUrls: ['./feeding.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class FeedingPage implements OnInit {
  feedingPoints: any[] = [];
  filteredPoints: any[] = [];
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

  // Fetch feeding points from Firebase
  async loadFeedingPoints() {
    this.loading = true;
    try {
      this.feedingPoints = await this.firebaseService.getInformation('feeding');
      this.applyFilters();
    } catch (err) {
      console.error('Error fetching feeding points:', err);
      this.feedingPoints = [];
      this.filteredPoints = [];
    } finally {
      this.loading = false;
    }
  }

  // Apply search, city & type filters
  applyFilters() {
    this.filteredPoints = this.feedingPoints.filter(fp => {
      const matchSearch = this.searchTerm
        ? fp.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          fp.address?.toLowerCase().includes(this.searchTerm.toLowerCase())
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

  // Action Sheet (Call, WhatsApp, Maps, Report)
  async openActions(fp: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: fp.name,
      buttons: [
        { text: '📞 Call', handler: () => this.call(fp.contact) },
        { text: '💬 WhatsApp', handler: () => this.whatsapp(fp.contact) },
        { text: '📍 Open in Maps', handler: () => this.openInMaps(fp.lat, fp.lng) },
        { text: '🚩 Report', handler: () => this.report(fp) },
        { text: '❌ Cancel', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  // Call
  call(contact: string) {
    if (contact) window.open(`tel:${contact}`, '_system');
  }

  // WhatsApp
  whatsapp(contact: string) {
    if (contact) {
      const phone = contact.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_system');
    }
  }

  // Maps
  openInMaps(lat: number, lng: number) {
    if (lat && lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_system');
    }
  }

  // Report
  report(fp: any) {
    alert(`Report submitted for: ${fp.name}`);
    // TODO: send to Firebase / backend queue
  }

  // View details page
  viewDetails(fp: any) {
    this.router.navigate(['tabs/directory/feeding-details', fp.id]);

  }
}
