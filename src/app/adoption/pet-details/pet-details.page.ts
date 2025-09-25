import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../app/services/firebase.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AppLauncher } from '@capacitor/app-launcher';

type PetEx = any & {
  id?: string;
  petName?: string;
  species?: string;
  breed?: string;
  age?: number;                 // months
  gender?: string;              // 'male' | 'female' | ''
  vaccinated?: boolean;
  dewormed?: boolean;
  neutered?: boolean;
  tags?: string[];
  location?: string;
  area?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerWhatsApp?: string;
  phone_public?: boolean;
  whatsapp_public?: boolean;
  photos?: string[];
  image?: string;
  lat?: number;
  lng?: number;
  favorite?: boolean;
  status?: 'Pending' | 'Active' | 'Adopted' | 'Inactive';
  submitterUid?: string;
  ownerUid?: string;
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

  showActionsPanel = false;
  mainImageIdx = 0;
  inquiryMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService,
    private toast: ToastController,
  ) {}

  async ngOnInit() {
    try {
      const id = this.route.snapshot.paramMap.get('id')!;
      const fromState = (history.state && (history.state as any).pet) ? (history.state as any).pet : null;

      if (fromState && fromState.id === id) {
        this.pet = this.normalizePet(fromState);
      } else {
        const fetched = await this.safeGetPetById(id);
        this.pet = this.normalizePet(fetched);
      }

      await this.ensureLocalNotifPermission();
      // console.log('PET NORMALIZED:', this.pet);
    } catch (e) {
      console.error(e);
      await this.toastQuick('Unable to load pet');
      this.router.navigate(['/adoption']);
    } finally {
      this.loading = false;
    }
  }

  // ---------- Normalization helpers ----------
  private toBool(v: any): boolean {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v === 1;
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase();
      return ['true','yes','y','1'].includes(s);
    }
    return !!v;
  }

  private toTagsArray(v: any): string[] {
    if (!v) return [];
    if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean);
    return String(v).split(',').map(s => s.trim()).filter(Boolean);
  }

  // ✅ NEW: handle health as string ("Dewormed") or object
  private parseHealthFlags(health: any) {
    if (!health) return { vaccinated: false, dewormed: false, neutered: false };
    if (typeof health === 'object') {
      return {
        vaccinated: this.toBool(health.vaccinated),
        dewormed: this.toBool(health.dewormed),
        neutered: this.toBool(health.neutered || health.spayed),
      };
    }
    const h = String(health).toLowerCase();
    return {
      vaccinated: /vaccin/.test(h),
      dewormed: /deworm/.test(h),
      neutered: /neuter|spay|spayed/.test(h),
    };
  }

  // ✅ UPDATED: map contact fields, age, gender, health, tags
  private normalizePet(raw: any): PetEx | undefined {
    if (!raw) return raw;

    // health flags can come from either raw.health (string/object) or boolean fields
    const parsed = this.parseHealthFlags(raw.health);
    const vaccinated = parsed.vaccinated || this.toBool(raw.vaccinated);
    const dewormed  = parsed.dewormed  || this.toBool(raw.dewormed);
    const neutered  = parsed.neutered  || this.toBool(raw.neutered);

    // age in months from multiple possible fields
    const months = Number(
      raw.ageInMonths ?? raw.ageMonths ?? (raw.ageYears != null ? Number(raw.ageYears) * 12 : NaN)
    );
    const age = Number.isFinite(months) ? months : (typeof raw.age === 'number' ? raw.age : undefined);

    return {
      ...raw,
      // contact mapping
      ownerName: raw.ownerName ?? raw.contactName ?? raw.contactPerson ?? '',
      ownerPhone: raw.ownerPhone ?? raw.contactPhone ?? '',
      // normalize gender to lowercase for icon checks
      gender: String(raw.gender || '').toLowerCase(),
      // health flags + tags
      vaccinated,
      dewormed,
      neutered,
      tags: this.toTagsArray(raw.tags ?? raw.temperament ?? raw.traits),
      // final age used by template ("{{ age }} months old")
      age,
    };
  }

  // convenient flags for HTML
  get hasHealthTags(): boolean {
    return !!(this.pet && (this.pet.vaccinated || this.pet.dewormed || this.pet.neutered));
  }
  get hasOtherTags(): boolean {
    return !!(this.pet?.tags && this.pet.tags.length);
  }

  // contact/privacy
  get canCall(): boolean {
    return !!this.pet?.ownerPhone && (this.pet?.phone_public ?? !!this.pet?.ownerPhone);
  }
  get canWhatsApp(): boolean {
    const hasNumber = !!(this.pet?.ownerWhatsApp || this.pet?.ownerPhone);
    const allowed = this.pet?.whatsapp_public ?? !!this.pet?.ownerPhone;
    return hasNumber && !!allowed;
  }

  private async ensureLocalNotifPermission() {
    try {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') await LocalNotifications.requestPermissions();
    } catch {}
  }

  private async safeGetPetById(id: string): Promise<PetEx | undefined> {
    if ((this.firebase as any).getPetById) return (this.firebase as any).getPetById(id);
    if ((this.firebase as any).getAdoptionById) return (this.firebase as any).getAdoptionById(id);
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
    const merged = [...primary, ...arr];
    return merged.filter((v, i) => merged.indexOf(v) === i);
  }

  // ---------- MAP / CALL / WHATSAPP ----------
  async openInMaps() {
    if (!this.pet) return;
    const url = (Number.isFinite(Number(this.pet.lat)) && Number.isFinite(Number(this.pet.lng)))
      ? `https://maps.google.com/?q=${this.pet.lat},${this.pet.lng}`
      : (this.pet.location ? `https://maps.google.com/?q=${encodeURIComponent(this.pet.location)}` : '');
    if (!url) return;
    try { await AppLauncher.openUrl({ url }); } catch { window.open(url, '_system'); }
  }

  async callOwner() {
    if (!this.canCall || !this.pet?.ownerPhone) return this.toastQuick('Phone number not available');
    const tel = `tel:${this.pet.ownerPhone}`;
    try { await AppLauncher.openUrl({ url: tel }); } catch { window.open(tel, '_system'); }
  }

  async whatsappOwner() {
    if (!this.canWhatsApp) return this.toastQuick('WhatsApp not available');
    const raw = this.pet?.ownerWhatsApp || this.pet?.ownerPhone!;
    const phone = String(raw).replace(/[^\d+]/g, '');
    const text = `Hi! I'm interested in ${this.pet?.petName || (this.pet?.species || 'your pet')}.`;
    const deep = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(text)}`;
    try {
      const can = await AppLauncher.canOpenUrl({ url: 'whatsapp://send' });
      const url = can.value ? deep : `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      await AppLauncher.openUrl({ url });
    } catch {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_system');
    }
  }

  // ---------- FAVORITES / SHARE / ADOPTED ----------
  async sharePet() {
    if (!this.pet?.id) return;
    const url = `${location.origin}/adoptions/${this.pet.id}`;
    const text = `${this.pet.petName || 'Pet'} • ${this.pet.species || ''} • ${this.pet.location || ''}`;
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title: this.pet.petName || 'Adoption', text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        this.toastQuick('Link copied');
      }
    } catch {}
  }

  async toggleFavorite() {
    if (!this.pet?.id) return;
    try {
      const newVal = !this.pet.favorite;
      await this.firebase.setFavorite?.('pet-adoption', this.pet.id, newVal);
      this.pet.favorite = newVal;
      this.toastQuick(newVal ? 'Saved to favorites' : 'Removed from favorites');
    } catch {
      this.toastQuick('Failed to update favorite');
    }
  }

  async markAdopted() {
    if (!this.pet?.id) return;
    const me = this.firebase.getCurrentUser();
    const isOwner = !!me && (this.pet.submitterUid === me.uid || this.pet.ownerUid === me.uid);
    if (!isOwner) return this.toastQuick('Only the owner can mark as adopted');
    try {
      await this.firebase.updatePetStatus(this.pet.id, 'Adopted');
      this.pet.status = 'Adopted';
      this.toastQuick('Marked as adopted');
    } catch {
      this.toastQuick('Failed to update status');
    }
  }

  // ---------- REPORT ----------
  async reportPet() {
    if (!this.pet?.id) return;
    try {
      await this.firebase.reportEntry('pet-adoption', this.pet.id, 'Incorrect information');
      this.toastQuick('Thanks! We’ll review this.');
    } catch {
      this.toastQuick('Could not submit report');
    }
  }

  // ---------- SEND INQUIRY + LOCAL NOTIFICATION ----------
  async sendInquiry() {
    if (!this.pet?.id) return this.toastQuick('Post not loaded');

    // ✅ Guard: only active listings can be contacted
    if (this.pet?.status && this.pet.status !== 'Active') {
      return this.toastQuick('This listing is not active');
    }

    const msg = this.inquiryMessage.trim();
    if (!msg) return this.toastQuick('Please write a message');

    try {
      await this.firebase.addAdoptionInquiry?.({
        adoptionId: this.pet.id,
        message: msg
      });

      this.inquiryMessage = '';
      await this.toastQuick('Inquiry sent to the owner');

      try {
        await LocalNotifications.schedule({
          notifications: [{
            id: Date.now(),
            title: 'Inquiry sent ✅',
            body: 'The owner will be notified.',
            schedule: { at: new Date(Date.now() + 300) }
          }]
        });
      } catch {}
    } catch (e) {
      console.error(e);
      this.toastQuick('Failed to send inquiry');
    }
  }

  // ---------- UTIL ----------
  private async toastQuick(message: string) {
    const t = await this.toast.create({ message, duration: 1500, position: 'bottom' });
    await t.present();
  }
}
