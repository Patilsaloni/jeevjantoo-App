import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abc',
  templateUrl: './abc.page.html',
  styleUrls: ['./abc.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbcPage implements OnInit {
  abcs: any[] = [];
  filteredAbcs: any[] = [];
  loading = true;

  cities: string[] = [];
  types: string[] = [];
  cityFilter: string = '';
  typeFilter: string = '';
  searchTerm: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.loadAbcs();
  }

  async loadAbcs() {
    this.loading = true;
    try {
      this.abcs = await this.firebaseService.getInformation('abcs');
      this.filteredAbcs = [...this.abcs];


        const variants = ['a', 'b', 'c', 'd', 'e'];
      this.abcs.forEach((abc, idx) => {
        abc.expanded = false;
        abc.variant = variants[idx % variants.length];
      });
      this.filteredAbcs = [...this.abcs];

      
      this.cities = Array.from(new Set(this.abcs.map(a => a.city).filter(c => c)));
      this.types = Array.from(new Set(this.abcs.map(a => a.type).filter(t => t)));

    } catch (error) {
      console.error('Error loading ABCs:', error);
      this.abcs = [];
      this.filteredAbcs = [];
    } finally {
      this.loading = false;
    }
  }

  filterAbcs(event: any) {
    this.searchTerm = event?.target?.value?.toLowerCase() || '';
    this.applyFilters();
  }

  filterBySelect() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredAbcs = this.abcs.filter(a => {
      const matchesSearch =
        a.location?.toLowerCase().includes(this.searchTerm) ||
        a.type?.toLowerCase().includes(this.searchTerm) ||
        a.personIncharge?.toLowerCase().includes(this.searchTerm);

      const matchesCity = this.cityFilter ? a.city === this.cityFilter : true;
      const matchesType = this.typeFilter ? a.type === this.typeFilter : true;

      return matchesSearch && matchesCity && matchesType;
    });
  }

  // Navigate to ABC Details page
 viewDetails(abc: any) {
  this.router.navigate([`/tabs/directory/abc/${abc.id}`]);
}


  // Open Google Maps using location string or coordinates
  openMap(location: string, lat?: number, lng?: number) {
    if (lat != null && lng != null) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    } else if (location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
    } else {
      alert('Location not available');
    }
  }
}
