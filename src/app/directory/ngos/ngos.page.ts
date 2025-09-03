// ngos.page.ts
import { Component, OnInit } from '@angular/core';
import { DirectoryService } from 'src/app/services/directory.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ngos',
  templateUrl: './ngos.page.html',
  styleUrls: ['./ngos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NgosPage implements OnInit {
  ngos: any[] = [];
  loading = true;

  constructor(private directoryService: DirectoryService) {}

  ngOnInit() {
    this.loadNGOs();
  }

  loadNGOs() {
  this.loading = true;
  this.directoryService.getNGOs().subscribe({
  next: (res: any) => {
    this.ngos = res.data.map((ngo: any) => ({
      name: ngo.name,
      location: ngo.location || 'Unknown',
      contact: ngo.contact || 'N/A',
      status: ngo.status || 'Unknown',
      report_count: ngo.report_count ?? 0
    }));
    this.loading = false;
  },
  error: () => {
    this.ngos = [];
    this.loading = false;
  }
});

}

}
