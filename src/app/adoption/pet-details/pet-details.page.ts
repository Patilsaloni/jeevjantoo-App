// import { Component, OnInit } from '@angular/core';
// import { IonicModule, ToastController } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { FirebaseService } from '../../../app/services/firebase.service';

// type PetEx = any & {
//   id?: string;
//   petName?: string;
//   species?: string;
//   breed?: string;
//   age?: number;
//   gender?: string;
//   vaccinated?: boolean;
//   location?: string;
//   area?: string;
//   ownerName?: string;
//   ownerPhone?: string;
//   photos?: string[];
//   image?: string;
//   lat?: number;
//   lng?: number;
//   favorite?: boolean;
// };

// @Component({
//   selector: 'app-pet-details',
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule],
//   templateUrl: './pet-details.page.html',
//   styleUrls: ['./pet-details.page.scss'],
// })
// export class PetDetailsPage implements OnInit {
//   pet?: PetEx;
//   loading = true;

//   showActionsPanel = false; // For paw icon panel toggle
//   mainImageIdx = 0;         // Index for main image in gallery

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private firebase: FirebaseService,
//     private toast: ToastController,
//   ) {}

//   async ngOnInit() {
//     try {
//       const id = this.route.snapshot.paramMap.get('id')!;

//       // Prefer navigation state for instant data
//       const fromState = (history.state && history.state.pet) ? history.state.pet : null;

//       if (fromState && fromState.id === id) {
//         this.pet = fromState;
//       } else {
//         // Fallback: fetch by id (rename to your actual service method)
//         this.pet = await this.safeGetPetById(id);
//       }
//     } catch (e) {
//       console.error(e);
//       await this.toastQuick('Unable to load pet');
//       this.router.navigate(['/adoption']);
//     } finally {
//       this.loading = false;
//     }
//   }

//   private async safeGetPetById(id: string): Promise<PetEx | undefined> {
//     if ((this.firebase as any).getPetById) {
//       return (this.firebase as any).getPetById(id);
//     }
//     if ((this.firebase as any).getAdoptionById) {
//       return (this.firebase as any).getAdoptionById(id);
//     }
//     // As a last resort, try to search in active pets list
//     try {
//       const all: any[] = await (this.firebase as any).getActivePets?.();
//       return (all || []).find(p => p.id === id);
//     } catch {
//       return undefined;
//     }
//   }

//   photoList(): string[] {
//     if (!this.pet) return [];
//     const arr = Array.isArray(this.pet.photos) ? this.pet.photos : [];
//     const primary = this.pet.image ? [this.pet.image] : [];
//     // de-dup primary if already present
//     const merged = [...primary, ...arr];
//     return merged.filter((v, i) => merged.indexOf(v) === i);
//   }

//   openInMaps() {
//     if (!this.pet) return;
//     if (Number.isFinite(Number(this.pet.lat)) && Number.isFinite(Number(this.pet.lng))) {
//       window.open(`https://maps.google.com/?q=${this.pet.lat},${this.pet.lng}`, '_system');
//     } else if (this.pet.location) {
//       window.open(`https://maps.google.com/?q=${encodeURIComponent(this.pet.location)}`, '_system');
//     }
//   }

//   callOwner() {
//     if (!this.pet?.ownerPhone) return;
//     window.open(`tel:${this.pet.ownerPhone}`, '_system');
//   }

//   whatsappOwner() {
//     if (!this.pet?.ownerPhone) return;
//     const phone = String(this.pet.ownerPhone).replace(/[^\d+]/g, '');
//     window.open(`https://wa.me/${phone}`, '_system');
//   }

//   async sharePet() {
//     if (!this.pet) return;
//     const url = window.location.href;
//     const text = `${this.pet.petName || 'Pet'} • ${this.pet.species || ''} • ${this.pet.location || ''}`;
//     try {
//       if (navigator.share) await navigator.share({ title: this.pet.petName || 'Adoption', text, url });
//       else {
//         await navigator.clipboard.writeText(`${text}\n${url}`);
//         this.toastQuick('Link copied');
//       }
//     } catch {}
//   }

//   async toggleFavorite() {
//     if (!this.pet?.id) return;
//     try {
//       const newVal = !this.pet.favorite;
//       await this.firebase.setFavorite('pet-adoption', this.pet.id, newVal);
//       this.pet.favorite = newVal;
//       this.toastQuick(newVal ? 'Saved to favorites' : 'Removed from favorites');
//     } catch {
//       this.toastQuick('Failed to update favorite');
//     }
//   }

//   async markAdopted() {
//     // Owner-only flow — implement permission check in real app
//     this.toastQuick('Marked as adopted (demo)');
//   }

//   private async toastQuick(message: string) {
//     const t = await this.toast.create({ message, duration: 1500, position: 'bottom' });
//     await t.present();
//   }
// }


import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirebaseService } from '../../../app/services/firebase.service';
import { register } from 'swiper/element/bundle';

type PetEx = any & {
  id?: string;
  petName?: string;
  species?: string;
  breed?: string;
  age?: number;           
  ageYears?: number;
  ageMonths?: number;
  ageInMonths?: number;
  gender?: string;
  vaccinated?: boolean;
  dewormed?: boolean;
  neutered?: boolean;
  health?: string | string[];
  temperament?: string | string[];
  location?: string;
  area?: string;
  ownerName?: string;
  ownerPhone?: string;
  contactPublic?: boolean;
  photos?: string[];
  image?: string;
  lat?: number;
  lng?: number;
  favorite?: boolean;
  createdAt?: any;
  views?: number;
  postedBy?: string;
};

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './pet-details.page.html',
  styleUrls: ['./pet-details.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PetDetailsPage implements OnInit {
  pet?: PetEx;
  loading = true;

  photos: string[] = [];

  // gallery
  galleryOpen = false;
  galleryIndex = 0;

  // inquiry/report
  inquiryOpen = false;
  inquiryText = '';
  reportOpen = false;
  reportText = '';

  // map
  mapSafeUrl?: SafeResourceUrl | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService,
    private toast: ToastController,
    private sanitizer: DomSanitizer
  ) {
    try {
      const w = window as any;
      if (!w.__swiper_registered__) {
        register();
        w.__swiper_registered__ = true;
      }
    } catch {}
  }

  async ngOnInit() {
    try {
      const id = this.route.snapshot.paramMap.get('id')!;
      const fromState = history.state?.pet ?? null;

      this.pet = (fromState && fromState.id === id)
        ? fromState
        : await this.safeGetPetById(id);

      this.photos = this.photoList();
      this.buildMapUrl();
    } catch (e) {
      console.error(e);
      await this.toastQuick('Unable to load pet');
      this.router.navigate(['/tabs/adoption']);
    } finally {
      this.loading = false;
    }
  }

  private async safeGetPetById(id: string): Promise<PetEx | undefined> {
    if ((this.firebase as any).getPetById) return (this.firebase as any).getPetById(id);
    if ((this.firebase as any).getAdoptionById) return (this.firebase as any).getAdoptionById(id);
    try {
      const all: any[] = await (this.firebase as any).getActivePets?.();
      return (all || []).find(p => p.id === id);
    } catch { return undefined; }
  }

  photoList(): string[] {
    if (!this.pet) return [];
    const arr = Array.isArray(this.pet.photos) ? this.pet.photos : [];
    const primary = this.pet.image ? [this.pet.image] : [];
    const merged = [...primary, ...arr];
    return merged.filter((v, i) => merged.indexOf(v) === i);
  }

  openGallery(index: number) {
    this.galleryIndex = index;
    this.galleryOpen = true;
  }

  displayAge(p: PetEx | undefined): string {
    if (!p) return '';
    let months = typeof p.ageInMonths === 'number'
      ? p.ageInMonths
      : (Number(p.ageYears) || 0) * 12 + (Number(p.ageMonths) || 0);

    if ((!months || months <= 0) && typeof p.age === 'number') {
      months = Math.max(0, Math.floor(p.age * 12));
    }
    if (!months || months < 0) return '';

    const y = Math.floor(months / 12);
    const m = months % 12;

    if (y >= 1) {
      const yearsFloat = +(y + m / 12).toFixed(m ? 1 : 0);
      return yearsFloat === 1 ? '1 year' : `${yearsFloat} years`;
    }
    return m <= 1 ? '1 month' : `${m} months`;
  }

  speciesLabel(val: any): string {
    const s = String(val || '').toLowerCase();
    if (s.includes('dog')) return 'Dog';
    if (s.includes('cat')) return 'Cat';
    if (s.includes('bird')) return 'Bird';
    if (s.includes('fish')) return 'Fish';
    if (s.includes('rabbit')) return 'Rabbit';
    return 'Other';
  }

  private inHealth(term: string): boolean {
    const h = this.pet?.health;
    if (!h) return false;
    if (Array.isArray(h)) return h.some(x => String(x).toLowerCase().includes(term));
    return String(h).toLowerCase().includes(term);
  }
  hasVaccinated(): boolean { return !!(this.pet?.vaccinated || this.inHealth('vaccin')); }
  hasDewormed(): boolean { return !!(this.pet?.dewormed || this.inHealth('deworm')); }
  hasNeutered(): boolean { return !!(this.pet?.neutered || this.inHealth('neuter') || this.inHealth('spay')); }

  temperamentList(): string[] {
    const t = this.pet?.temperament;
    if (!t) return [];
    return Array.isArray(t) ? t : String(t).split(',').map(s => s.trim()).filter(Boolean);
  }

  private buildMapUrl() {
    if (!this.pet) { this.mapSafeUrl = null; return; }
    let url = '';
    if (Number.isFinite(Number(this.pet.lat)) && Number.isFinite(Number(this.pet.lng))) {
      const lat = Number(this.pet.lat), lng = Number(this.pet.lng);
      url = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
    } else if (this.pet.location) {
      const q = encodeURIComponent(this.pet.location);
      url = `https://maps.google.com/maps?q=${q}&z=14&output=embed`;
    }
    this.mapSafeUrl = url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  }

  openInMaps() {
    if (!this.pet) return;
    if (Number.isFinite(Number(this.pet.lat)) && Number.isFinite(Number(this.pet.lng))) {
      window.open(`https://maps.google.com/?q=${this.pet.lat},${this.pet.lng}`, '_system');
    } else if (this.pet.location) {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(this.pet.location)}`, '_system');
    }
  }

  /** Only allow phone actions if contactPublic is true and ownerPhone exists */
  showPhone(): boolean { return !!(this.pet?.contactPublic && this.pet?.ownerPhone); }

  callOwner() {
    if (!this.showPhone() || !this.pet?.ownerPhone) return;
    window.open(`tel:${this.pet.ownerPhone}`, '_system');
  }

  whatsappOwner() {
    if (!this.showPhone() || !this.pet?.ownerPhone) return;
    const phone = String(this.pet.ownerPhone).replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${phone}`, '_system');
  }

  openInquiry() { this.inquiryOpen = true; }
  async sendInquiry() {
    if (!this.inquiryText.trim() || !this.pet?.id) return;
    try {
      const payload = {
        petId: this.pet.id,
        message: this.inquiryText.trim(),
        createdAt: Date.now(),
        location: this.pet.location || null
      };
      const id = `inq_${this.pet.id}_${Date.now()}`;
      await this.firebase.addInformation(id, payload, 'adoption-inquiries');
      this.inquiryText = '';
      this.inquiryOpen = false;
      this.toastQuick('Inquiry sent');
    } catch (e) {
      console.error(e);
      this.toastQuick('Failed to send inquiry');
    }
  }

  openReport() { this.reportOpen = true; }
  async sendReport() {
    if (!this.reportText.trim() || !this.pet?.id) return;
    try {
      const payload = { petId: this.pet.id, reason: this.reportText.trim(), createdAt: Date.now() };
      const id = `rpt_${this.pet.id}_${Date.now()}`;
      await this.firebase.addInformation(id, payload, 'adoption-reports');
      this.reportText = '';
      this.reportOpen = false;
      this.toastQuick('Report submitted');
    } catch (e) {
      console.error(e);
      this.toastQuick('Failed to submit report');
    }
  }

  async sharePet() {
    if (!this.pet) return;
    const url = window.location.href;
    const text = `${this.pet.petName || 'Pet'} • ${this.speciesLabel(this.pet.species)} • ${this.pet.location || ''}`;
    try {
      if (navigator.share) await navigator.share({ title: this.pet.petName || 'Adoption', text, url });
      else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        this.toastQuick('Link copied');
      }
    } catch {}
  }

  async toggleFavorite() {
    if (!this.pet?.id) return;
    try {
      const newVal = !this.pet.favorite;
      await this.firebase.setFavorite('pet-adoption', this.pet.id, newVal);
      this.pet.favorite = newVal;
      this.toastQuick(newVal ? 'Saved to favorites' : 'Removed from favorites');
    } catch {
      this.toastQuick('Failed to update favorite');
    }
  }

  isOwner(): boolean { return false; }

  async markAdopted() {
    if (!this.pet?.id) return;
    this.toastQuick('Marked as adopted (demo)');
  }

  postedOn(): string | null {
    const c = this.pet?.createdAt;
    if (!c) return null;
    try {
      const date = (c?.toDate?.() ? c.toDate() : new Date(c)) as Date;
      return date.toLocaleString();
    } catch { return null; }
  }

  private async toastQuick(message: string) {
    const t = await this.toast.create({ message, duration: 1500, position: 'bottom' });
    await t.present();
  }
}
