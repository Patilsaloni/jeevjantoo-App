import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  imports: [IonicModule, CommonModule]
})
export class ProfilePage implements OnInit {

  username: string = 'Username';

  menu: ProfileMenuItem[] = [
    { icon: 'person',      label: 'Edit profile',     bg: '#ffd7e3ff' },
    { icon: 'heart',       label: 'Favorite section', bg: '#e3d7ffff' },
    { icon: 'settings',    label: 'Settings',         bg: '#ffd7e3ff' },
    { icon: 'person-add',  label: 'Invite a friend',  bg: '#d7ffdeff' },
    { icon: 'help-circle', label: 'Help',             bg: '#b7d3ce' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('ProfilePage initialized');
  }

  onMenuClick(item: ProfileMenuItem) {
    switch (item.label) {
      case 'Edit profile':
        this.router.navigate(['/tabs/profile/edit-profile']);
        break;
      case 'Favorite section':
        this.router.navigate(['/tabs/profile/favorites']);
        break;
      case 'Settings':
        this.router.navigate(['/tabs/profile/settings']);
        break;
      case 'Invite a friend':
        this.router.navigate(['/tabs/profile/invite-friend']);
        break;
      case 'Help':
        this.router.navigate(['/tabs/profile/help']);
        break;
    }
  }
}
