import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelplineDetailModalComponent } from './helpline-detail-modal.component';

describe('HelplineDetailModalComponent', () => {
  let component: HelplineDetailModalComponent;
  let fixture: ComponentFixture<HelplineDetailModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelplineDetailModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HelplineDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
