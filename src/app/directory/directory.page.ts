import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, NgForOf, RouterModule], // ✅ include RouterModule
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DirectoryPage {
  directoryItems = [
    { label: 'Clinics', icon: 'pulse-outline', color: '#ff8d6b', route: 'clinics' },
    { label: 'NGOs', icon: 'people-circle', color: '#9befe0', route: 'ngos' },
    { label: 'Events', icon: 'calendar', color: '#6eb9ff', route: 'events' },
    { label: 'Ambulance', icon: 'medkit', color: '#ffdc6e', route: 'ambulance' },
    { label: 'Boarding', icon: 'bed', color: '#d4ef9b', route: 'boarding' },
    { label: 'ABC', icon: 'help-circle', color: '#ff8d6b', route: 'abc' },
    { label: 'Govt Helpline', icon: 'call', color: '#9befe0', route: 'ghelpline' },
    { label: 'Feeding', icon: 'restaurant', color: '#6eb9ff', route: 'feeding' },
    { label: 'Medical Insurance', icon: 'shield-checkmark', color: '#ffdc6e', route: 'insurance' },
  ];

  constructor(private router: Router) {}

  goToDirectoryDetail(item: any) {
  this.router.navigate([`/tabs/directory/${item.route}`]);
}

}
