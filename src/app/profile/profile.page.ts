// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { IonicModule } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';

// interface ProfileMenuItem {
//   icon: string;
//   label: string;
//   bg: string;
// }

// @Component({
//   selector: 'app-profile',
//   templateUrl: './profile.page.html',
//   styleUrls: ['./profile.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule]
// })
// export class ProfilePage implements OnInit {
//   username: string = 'Username';
  
//   // Input fields
//   fullName: string = '';
//   email: string = '';
//   phone: string = '';
//   address: string = '';

//   menu: ProfileMenuItem[] = [
//     { icon: 'person', label: 'Edit Profile', bg: '#ffd7e3' },
//     { icon: 'list', label: 'My Listings', bg: '#e3d7ff' },
//     { icon: 'heart', label: 'Favorites', bg: '#d7ffde' },
//     { icon: 'mail', label: 'Messages', bg: '#ffd7e3' },
//     { icon: 'shield-checkmark', label: 'Verification', bg: '#cde3ff' },
//     { icon: 'settings', label: 'Settings', bg: '#ffd7e3' },
//     { icon: 'person-add', label: 'Invite a friend', bg: '#d7ffde' },
//     { icon: 'help-circle', label: 'Help', bg: '#b7d3ce' },
//     { icon: 'alert-circle', label: 'Activity Reports', bg: '#fcd7c7' }
//   ];

//   menuRoutes: Record<string, string> = {
//     'Edit Profile': '/tabs/profile/edit-profile',
//     'My Listings': '/tabs/profile/my-listings',
//     'Favorites': '/tabs/profile/favorites',
//     'Messages': '/tabs/profile/inquiries',
//     'Verification': '/tabs/profile/verification',
//     'Settings': '/tabs/profile/settings',
//     'Invite a friend': '/tabs/profile/invite-friend',
//     'Help': '/tabs/profile/help',
//     'Activity Reports': '/tabs/profile/activity-reports'
//   };

//   constructor(private router: Router, private cdr: ChangeDetectorRef) {}

//   ngOnInit() {
//     console.log('ProfilePage initialized');
//     console.log('Menu:', this.menu);
//     console.log('Menu Routes:', this.menuRoutes);
//     this.cdr.detectChanges(); // Force change detection
//   }

//   onMenuClick(item: ProfileMenuItem) {
//     const path = this.menuRoutes[item.label];
//     console.log('Menu clicked:', item.label, 'Navigating to:', path);
//     if (path) {
//       this.router.navigate([path]).then(() => {
//         console.log('Navigation successful to:', path);
//       }).catch(err => {
//         console.error('Navigation error:', err);
//       });
//     } else {
//       console.warn('No route defined for:', item.label);
//     }
//   }

//   saveProfile() {
//     console.log('Profile saved:', {
//       fullName: this.fullName,
//       email: this.email,
//       phone: this.phone,
//       address: this.address
//     });
//   }
// }


//profile.ts

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ProfileMenuItem {
  icon: string;
  label: string;
  bg: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  username: string = 'Username';
  
  // Input fields
  fullName: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';

  menu: ProfileMenuItem[] = [
    { icon: 'person', label: 'Edit Profile', bg: '#ffd7e3' },
    { icon: 'list', label: 'My Listings', bg: '#e3d7ff' },
    { icon: 'heart', label: 'Favorites', bg: '#d7ffde' },
    { icon: 'mail', label: 'Inquiries', bg: '#ffd7e3' },
    { icon: 'shield-checkmark', label: 'Verification', bg: '#cde3ff' },
    { icon: 'settings', label: 'Settings', bg: '#ffd7e3' },
    { icon: 'person-add', label: 'Invite a friend', bg: '#d7ffde' },
    { icon: 'help-circle', label: 'Help', bg: '#b7d3ce' },
    { icon: 'alert-circle', label: 'Activity Reports', bg: '#fcd7c7' }
  ];

  menuRoutes: Record<string, string> = {
    'Edit Profile': '/tabs/profile/edit-profile',
    'My Listings': '/tabs/profile/my-listings',
    'Favorites': '/tabs/profile/favorites',
    'Messages': '/tabs/profile/inquiries',
    'Verification': '/tabs/profile/verification',
    'Settings': '/tabs/profile/settings',
    'Invite a friend': '/tabs/profile/invite-friend',
    'Help': '/tabs/profile/help',
    'Activity Reports': '/tabs/profile/activity-reports'
  };

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('ProfilePage initialized');
    console.log('Menu:', this.menu);
    console.log('Menu Routes:', this.menuRoutes);
    this.cdr.detectChanges(); // Force change detection
  }

  onMenuClick(item: ProfileMenuItem) {
    const path = this.menuRoutes[item.label];
    console.log('Menu clicked:', item.label, 'Navigating to:', path);
    if (path) {
      this.router.navigate([path]).then(() => {
        console.log('Navigation successful to:', path);
      }).catch(err => {
        console.error('Navigation error:', err);
      });
    } else {
      console.warn('No route defined for:', item.label);
    }
  }

  saveProfile() {
    console.log('Profile saved:', {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      address: this.address
    });
  }
}