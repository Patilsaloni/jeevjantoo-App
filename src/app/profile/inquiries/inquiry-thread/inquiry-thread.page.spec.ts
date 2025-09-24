import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InquiryThreadPage } from './inquiry-thread.page';

describe('InquiryThreadPage', () => {
  let component: InquiryThreadPage;
  let fixture: ComponentFixture<InquiryThreadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryThreadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
