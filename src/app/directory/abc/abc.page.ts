import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';

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
  loading = true;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadAbcs();
  }

  async loadAbcs() {
    this.loading = true;
    try {
      this.abcs = await this.firebaseService.getInformation('abcs'); // collection name in Firebase
    } catch (error) {
      console.error('Error loading ABCs:', error);
      this.abcs = [];
    } finally {
      this.loading = false;
    }
  }
}
