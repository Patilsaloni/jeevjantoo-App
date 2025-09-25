import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-inquiry-thread',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './inquiry-thread.page.html',
  styleUrls: ['./inquiry-thread.page.scss'],
})
export class InquiryThreadPage implements OnInit, OnDestroy {
  inquiryId!: string;
  messages: any[] = [];
  text = '';
  private unsub?: () => void;

  constructor(
    private route: ActivatedRoute,
    private fb: FirebaseService,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.inquiryId = this.route.snapshot.paramMap.get('id')!;
    this.unsub = this.fb.listenInquiryMessages(
      this.inquiryId,
      rows => (this.messages = rows),
      err  => console.error(err)
    );
  }

  ngOnDestroy() {
    this.unsub?.();
  }

  async send() {
    const msg = this.text.trim();
    if (!msg) return;
    try {
      await this.fb.addInquiryReply(this.inquiryId, msg);
      this.text = '';
    } catch {
      const t = await this.toast.create({ message: 'Send failed', duration: 1200 });
      await t.present();
    }
  }
}
