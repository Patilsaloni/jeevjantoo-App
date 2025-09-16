// import { Component, OnInit } from '@angular/core'; 
// import { IonicModule } from '@ionic/angular';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-edit-profile',
//   templateUrl: './edit-profile.page.html',
//   styleUrls: ['./edit-profile.page.scss'],
//   standalone: true, // Marks this as a standalone component
//   imports: [IonicModule, CommonModule] // Import necessary Angular and Ionic modules
// })
// export class EditProfilePage implements OnInit {
//   constructor() {}

//   ngOnInit() {
//     console.log('EditProfilePage initialized');
//   }
// }
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditProfilePage {
  user = {
    name: 'Jhone Williams',
    email: 'jhonewilliams@gmail.com',
    location: 'Lurah Bilut, Pahang, Malaysia',
    language: 'English',
    education: 'Degree',
    course: 'BCA',
    profileImage: null
  };

  changePhoto() {
    console.log('Avatar change clicked');
  }

  submit() {
    console.log('Save button clicked', this.user);
  }
}
