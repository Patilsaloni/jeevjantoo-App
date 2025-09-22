// favorites.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../app/services/firebase.service';

export type FavType = 'clinic' | 'ngo' | 'event' | 'adoption' | 'other';
export interface FavoriteItem {
  id: string;
  type: FavType;
  name: string;
  image?: string;
  city?: string;
  area?: string;
  address?: string;
  lat?: number;
  lng?: number;
  contact?: string;
  status?: 'active' | 'inactive' | 'adopted' | 'pending';
  tags?: string[];
  dateAdded?: number;
  _raw?: any;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit, OnDestroy {
  items: FavoriteItem[] = [];
  filtered: (FavoriteItem & { distanceKm?: number })[] = [];

  searchQuery = '';
  selectedGroup: 'all' | 'directories' | 'adoption' = 'all';
  selectedType: 'any' | FavType = 'any';
  sortBy: 'name' | 'date' | 'distance' = 'name';
  viewMode: 'list' | 'map' = 'list';

  hasLocation = false;
  isLocLoading = false;
  myLat?: number; myLng?: number;

  private leafletReady = false;
  private map: any; // L.Map
  private markers: any[] = [];

  constructor(
    private firebase: FirebaseService,
    private toast: ToastController,
    private alert: AlertController,
  ) {}

  async ngOnInit() {
    await this.loadFavorites();
    this.tryGetLocation(true);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove?.();
      this.map = null;
    }
  }

  // Load favorites (using your existing service: getFavoritePets('pet-adoption'))
  async loadFavorites() {
    try {
      const favPets: any[] = await this.firebase.getFavoritePets('pet-adoption');

      this.items = (favPets || []).map((p: any): FavoriteItem => {
        const typeRaw = (p.type || p.category || p.species || 'adoption').toString().toLowerCase();
        const type: FavType = (['clinic','ngo','event','adoption'].includes(typeRaw) ? typeRaw : 'adoption') as FavType;
        const city = p.city || this.extractCity(p.location) || '';
        return {
          id: p.id,
          type,
          name: p.name || p.petName || 'Untitled',
          image: p.image || p.thumbnail || 'assets/default-thumb.png',
          city,
          area: p.area || '',
          address: p.address || p.location || '',
          lat: this.num(p.lat),
          lng: this.num(p.lng),
          contact: p.contact || p.phone || '',
          status: p.status as any,
          tags: Array.isArray(p.tags) ? p.tags : [],
          dateAdded: typeof p.dateAdded === 'number' ? p.dateAdded : Date.now(),
          _raw: p,
        };
      });

      this.applyFilters();
    } catch (e) {
      console.error('loadFavorites error', e);
      this.items = [];
      this.filtered = [];
    }
  }

  // Pull-to-refresh (use loose typing to avoid TS cast error)
  async doRefresh(ev: any) {
    await this.loadFavorites();
    ev.target?.complete?.();
  }

  applyFilters() {
    const q = this.searchQuery.trim().toLowerCase();
    const isDir = (t: FavType) => ['clinic','ngo','event','other'].includes(t);

    let list = this.items.filter((it) => {
      const groupOk =
        this.selectedGroup === 'all' ? true :
        this.selectedGroup === 'adoption' ? it.type === 'adoption' :
        isDir(it.type);

      const typeOk = this.selectedType === 'any' ? true : it.type === this.selectedType;

      const hay = `${it.name} ${it.type} ${it.city ?? ''} ${it.area ?? ''} ${(it.tags||[]).join(' ')}`.toLowerCase();
      const qOk = q === '' || hay.includes(q);

      return groupOk && typeOk && qOk;
    });

    list = list.map((it) => {
      const withDist: any = { ...it };
      if (this.hasLocation && this.isNum(it.lat) && this.isNum(it.lng)) {
        withDist.distanceKm = this.haversine(this.myLat!, this.myLng!, it.lat!, it.lng!);
      }
      return withDist;
    });

    this.filtered = this.sortList(list);
    if (this.viewMode === 'map') setTimeout(() => this.refreshMap(), 0);
  }

  sortNow() {
    this.filtered = this.sortList(this.filtered);
    if (this.viewMode === 'map') setTimeout(() => this.refreshMap(), 0);
  }

  private sortList<T extends FavoriteItem & { distanceKm?: number }>(arr: T[]): T[] {
    const copy = [...arr];
    if (this.sortBy === 'name') copy.sort((a,b) => a.name.localeCompare(b.name));
    else if (this.sortBy === 'date') copy.sort((a,b) => (b.dateAdded||0) - (a.dateAdded||0));
    else if (this.sortBy === 'distance') copy.sort((a,b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9));
    return copy;
  }

  openDetails(item: FavoriteItem) {
    // TODO: router navigate to details route with item.id
    this.toastQuick('Open detail screen here');
  }

  call(item: FavoriteItem) {
    if (!item.contact) return;
    window.open(`tel:${item.contact}`, '_system');
  }

  whatsapp(item: FavoriteItem) {
    if (!item.contact) return;
    const phone = item.contact.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${phone}`, '_system');
  }

  openInMaps(item: FavoriteItem) {
    if (this.isNum(item.lat) && this.isNum(item.lng)) {
      window.open(`https://maps.google.com/?q=${item.lat},${item.lng}`, '_system');
    } else if (item.address) {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(item.address)}`, '_system');
    } else if (item.city || item.area) {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(`${item.area||''} ${item.city||''}`)}`, '_system');
    } else {
      this.toastQuick('No location available');
    }
  }

  async share(item: FavoriteItem) {
    const title = item.name;
    const url = window.location.href;
    const text = `${item.name} — ${this.typeLabel(item)}${item.city ? ' • ' + item.city : ''}`;
    const payload: ShareData = { title, text, url } as any;

    try {
      if (navigator.share) await navigator.share(payload);
      else {
        await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
        this.toastQuick('Link copied');
      }
    } catch {}
  }

  async removeFavorite(item: FavoriteItem) {
    const prev = [...this.items];
    this.items = this.items.filter((x) => x.id !== item.id);
    this.applyFilters();
    try {
      // use your existing namespace for adoption favorites
      await this.firebase.setFavorite('pet-adoption', item.id, false);
      this.toastQuick('Removed from favorites');
    } catch (e) {
      console.error(e);
      this.items = prev;
      this.applyFilters();
      this.toastQuick('Failed to remove');
    }
  }

  async onViewModeChange() {
    if (this.viewMode === 'map') {
      await this.ensureLeaflet();
      this.initMapOnce();
      this.refreshMap();
    }
  }

  private async ensureLeaflet() {
    if (this.leafletReady) return;
    const hasL = (window as any).L;
    if (!hasL) {
      await this.injectCss('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
      await this.injectScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
    }
    this.leafletReady = true;
  }

  private injectScript(src: string) { return new Promise<void>((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.async = true; s.onload = () => res(); s.onerror = () => rej();
    document.head.appendChild(s);
  }); }

  private injectCss(href: string) { return new Promise<void>((res, rej) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href; l.onload = () => res(); l.onerror = () => rej();
    document.head.appendChild(l);
  }); }

  private initMapOnce() {
    const L = (window as any).L;
    const el = document.getElementById('fav-map');
    if (!L || !el) return;
    if (this.map) return;

    this.map = L.map(el).setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
  }

  private refreshMap() {
    const L = (window as any).L;
    if (!L || !this.map) return;

    this.markers.forEach(m => m.remove());
    this.markers = [];

    const group = L.featureGroup();

    this.filtered.forEach((it) => {
      const { lat, lng, name } = it;
      if (!this.isNum(lat) || !this.isNum(lng)) return;
      const marker = L.marker([lat!, lng!]).bindPopup(`
        <b>${name}</b><br/>
        ${this.typeLabel(it)}${it.city ? ' • ' + it.city : ''}
      `);
      marker.addTo(group);
      this.markers.push(marker);
    });

    if (this.markers.length) {
      group.addTo(this.map);
      this.map.fitBounds(group.getBounds().pad(0.25));
    }
  }

  async tryGetLocation(silent = false) {
    try {
      this.isLocLoading = true;
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) return reject('Geolocation not available');
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 8000 });
      });
      this.myLat = pos.coords.latitude; this.myLng = pos.coords.longitude;
      this.hasLocation = true; this.isLocLoading = false;
      this.applyFilters();
      if (!silent) this.toastQuick('Location updated');
    } catch (e) {
      this.isLocLoading = false;
      if (!silent) this.toastQuick('Unable to get location');
    }
  }

  private haversine(aLat: number, aLng: number, bLat: number, bLng: number) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);
    const x = Math.sin(dLat/2)**2 + Math.cos(toRad(aLat))*Math.cos(toRad(bLat))*Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }

  badgeColor(it: FavoriteItem): string {
    const t = it.type;
    if (t === 'adoption') return 'warning';
    if (t === 'clinic') return 'primary';
    if (t === 'ngo') return 'success';
    if (t === 'event') return 'tertiary';
    return 'medium';
  }

  statusColor(s: FavoriteItem['status']): string {
    switch (s) {
      case 'active': return 'success';
      case 'inactive': return 'medium';
      case 'adopted': return 'secondary';
      case 'pending': return 'warning';
      default: return 'medium';
    }
  }

  typeLabel(it: FavoriteItem): string {
    const t = it.type;
    if (t === 'adoption') return 'Adoption';
    if (t === 'ngo') return 'NGO';
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  num(v: any): number | undefined { const n = Number(v); return Number.isFinite(n) ? n : undefined; }
  isNum(v: any): v is number { return Number.isFinite(v); }

  extractCity(loc?: string): string | undefined {
    if (!loc || typeof loc !== 'string') return undefined;
    const parts = loc.split(',').map(s => s.trim()).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : undefined;
  }

  async toastQuick(message: string) {
    const t = await this.toast.create({ message, duration: 1500, position: 'bottom' });
    await t.present();
  }
}
