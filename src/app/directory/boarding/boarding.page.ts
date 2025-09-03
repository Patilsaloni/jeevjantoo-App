import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DirectoryService } from 'src/app/services/directory.service';

@Component({
  selector: 'app-boarding',
  templateUrl: './boarding.page.html',
  styleUrls: ['./boarding.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class BoardingPage implements OnInit {

  boardingSpas: any[] = [];
  loading = true;

  constructor(private directoryService: DirectoryService) { }

  ngOnInit() {
    this.loadBoardingSpa();
  }

  loadBoardingSpa() {
    this.loading = true;

    this.directoryService.getBoardingSpa({ page: 1, pageSize: 10 }).subscribe({
      next: (res: any) => {
        this.boardingSpas = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.boardingSpas = [];
        this.loading = false;
      }
    });
  }

  trackLocation(spa: any) {
    if (spa.lat && spa.lng) {
      const url = `https://www.google.com/maps?q=${spa.lat},${spa.lng}`;
      window.open(url, "_blank");
    } else {
      alert("Location not available");
    }
  }
}
