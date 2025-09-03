import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, ActionSheetController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectoryService } from 'src/app/services/directory.service';

@Component({
  selector: 'app-feeding',
  templateUrl: './feeding.page.html',
  styleUrls: ['./feeding.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FeedingPage implements OnInit {
  feedingPoints: any[] = [];
  loading = true;

  // 🔹 Filters
  searchTerm = '';
  selectedCity: string = '';
  selectedType: string = ''; // 'individual' | 'ngo' | ''

  constructor(
    private directoryService: DirectoryService,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.loadFeedingPoints();
  }

  // 🔹 Fetch feeding points
  loadFeedingPoints() {
    this.loading = true;

    const params: any = {
      q: this.searchTerm,
      page: 1,
      pageSize: 20
    };
    if (this.selectedCity) params.location = this.selectedCity;
    if (this.selectedType === 'individual') params.is_individual = true;
    if (this.selectedType === 'ngo') params.is_individual = false;

    this.directoryService.getFeeding(params).subscribe({
      next: (res: any) => {
        this.feedingPoints = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.feedingPoints = [];
        this.loading = false;
      }
    });
  }

  // 🔹 Action Sheet (Call, WhatsApp, Maps, Report)
  async openActions(fp: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: fp.name,
      buttons: [
        {
          text: '📞 Call',
          handler: () => this.call(fp.contact)
        },
        {
          text: '💬 WhatsApp',
          handler: () => this.whatsapp(fp.contact)
        },
        {
          text: '📍 Open in Maps',
          handler: () => this.openInMaps(fp.lat, fp.lng)
        },
        {
          text: '🚩 Report',
          handler: () => this.report(fp)
        },
        {
          text: '❌ Cancel',
          role: 'cancel'
        }
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
  openInMaps(lat: number, lng: number) {
    if (lat && lng) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        '_system'
      );
    }
  }

  // 🚩 Report
  report(fp: any) {
    alert(`Report submitted for: ${fp.name}`);
    // TODO: send to backend API if needed
  }
}
