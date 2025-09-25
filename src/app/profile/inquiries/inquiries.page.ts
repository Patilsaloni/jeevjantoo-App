import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-inquiries',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TitleCasePipe],
  templateUrl: './inquiries.page.html',
  styleUrls: ['./inquiries.page.scss'],
})
export class InquiriesPage implements OnInit, OnDestroy {
  segment: 'received' | 'sent' = 'received';
  loading = true;

  received: any[] = [];
  sent: any[] = [];

  private unsubReceived?: () => void;
  private unsubSent?: () => void;

  constructor(private fb: FirebaseService, private router: Router) {}

  ngOnInit() {
    try {
      this.unsubReceived = this.fb.listenInquiriesReceived(
        rows => { this.received = rows; this.loading = false; },
        err  => { console.error(err); this.loading = false; }
      );
    } catch (e) { console.warn('Received listener not started:', e); this.loading = false; }

    try {
      this.unsubSent = this.fb.listenInquiriesSent(
        rows => { this.sent = rows; },
        err  => { console.error(err); }
      );
    } catch (e) { console.warn('Sent listener not started:', e); }
  }

  ngOnDestroy() {
    this.unsubReceived?.();
    this.unsubSent?.();
  }

  trackById(_: number, it: any) { return it.id; }

  openThread(inq: any) {
    this.router.navigate(['/profile/inquiries', inq.id]);
  }
}
