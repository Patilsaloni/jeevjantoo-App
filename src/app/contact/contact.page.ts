import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ContactPage implements OnInit {
  contactForm: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  constructor() {}

  ngOnInit() {
    console.log('ContactPage initialized');
  }

  submitContact() {
    console.log('Contact form submitted:', this.contactForm);
    // Add backend submission logic here (e.g., API call)
  }
}
