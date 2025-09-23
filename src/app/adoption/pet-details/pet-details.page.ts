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

//   // Try a few common method names; adjust to your service
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



import { Component, OnInit } from '@angular/core';

import { IonicModule, ToastController } from '@ionic/angular';

import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { FirebaseService } from '../../../app/services/firebase.service';

type PetEx = any & {
  id?: string;
  petName?: string;
  species?: string;
  breed?: string;
  age?: number;
  gender?: string;
  vaccinated?: boolean;
  location?: string;
  area?: string;
  ownerName?: string;
  ownerPhone?: string;
  photos?: string[];
  image?: string;
  lat?: number;
  lng?: number;
  favorite?: boolean;
};

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './pet-details.page.html',
  styleUrls: ['./pet-details.page.scss'],
})
export class PetDetailsPage implements OnInit {
  pet?: PetEx;
  loading = true;

  showActionsPanel = false; // For paw icon panel toggle
  mainImageIdx = 0;         // Index for main image in gallery

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService,
    private toast: ToastController,
  ) {}

  async ngOnInit() {
    try {
      const id = this.route.snapshot.paramMap.get('id')!;

      // Prefer navigation state for instant data
      const fromState = (history.state && history.state.pet) ? history.state.pet : null;

      if (fromState && fromState.id === id) {
        this.pet = fromState;
      } else {
        // Fallback: fetch by id (rename to your actual service method)
        this.pet = await this.safeGetPetById(id);
      }
    } catch (e) {
      console.error(e);
      await this.toastQuick('Unable to load pet');
      this.router.navigate(['/adoption']);
    } finally {
      this.loading = false;
    }
  }

  private async safeGetPetById(id: string): Promise<PetEx | undefined> {
    if ((this.firebase as any).getPetById) {
      return (this.firebase as any).getPetById(id);
    }
    if ((this.firebase as any).getAdoptionById) {
      return (this.firebase as any).getAdoptionById(id);
    }
    // As a last resort, try to search in active pets list
    try {
      const all: any[] = await (this.firebase as any).getActivePets?.();
      return (all || []).find(p => p.id === id);
    } catch {
      return undefined;
    }
  }

  photoList(): string[] {
    if (!this.pet) return [];
    const arr = Array.isArray(this.pet.photos) ? this.pet.photos : [];
    const primary = this.pet.image ? [this.pet.image] : [];
    // de-dup primary if already present
    const merged = [...primary, ...arr];
    return merged.filter((v, i) => merged.indexOf(v) === i);
  }

  openInMaps() {
    if (!this.pet) return;
    if (Number.isFinite(Number(this.pet.lat)) && Number.isFinite(Number(this.pet.lng))) {
      window.open(`https://maps.google.com/?q=${this.pet.lat},${this.pet.lng}`, '_system');
    } else if (this.pet.location) {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(this.pet.location)}`, '_system');
    }
  }

  callOwner() {
    if (!this.pet?.ownerPhone) return;
    window.open(`tel:${this.pet.ownerPhone}`, '_system');
  }

  whatsappOwner() {
    if (!this.pet?.ownerPhone) return;
    const phone = String(this.pet.ownerPhone).replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${phone}`, '_system');
  }

  async sharePet() {
    if (!this.pet) return;
    const url = window.location.href;
    const text = `${this.pet.petName || 'Pet'} • ${this.pet.species || ''} • ${this.pet.location || ''}`;
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

  async markAdopted() {
    // Owner-only flow — implement permission check in real app
    this.toastQuick('Marked as adopted (demo)');
  }

  private async toastQuick(message: string) {
    const t = await this.toast.create({ message, duration: 1500, position: 'bottom' });
    await t.present();
  }
}
