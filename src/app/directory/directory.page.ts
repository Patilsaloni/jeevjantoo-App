import { Component } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, NgForOf],
})
export class DirectoryPage {
  // directory items with assigned colors and effect flag
  directoryItems = [
    { label: 'NGOs', icon: 'people-circle', color: '#9befe0', effect: true },
    { label: 'Events', icon: 'calendar', color: '#6eb9ff', effect: false },
    { label: 'Ambulance', icon: 'medkit', color: '#ffdc6e', effect: true },
    { label: 'Boarding', icon: 'bed', color: '#d4ef9b', effect: false },
    { label: 'ABC', icon: 'help-circle', color: '#ff8d6b', effect: true },
    { label: 'Govt Helpline', icon: 'call', color: '#9befe0', effect: false },
    { label: 'Feeding', icon: 'restaurant', color: '#6eb9ff', effect: true },
    { label: 'Medical Insurance', icon: 'shield-checkmark', color: '#ffdc6e', effect: false },
  ];

  goToDirectoryDetail(item: any) {
    console.log('Clicked:', item);
    // Navigate to detail page if needed
  }
}
