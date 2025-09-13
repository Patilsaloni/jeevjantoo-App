import { Component, OnInit } from '@angular/core'; // Fix import
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class EditProfilePage implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log('EditProfilePage initialized');
  }
}