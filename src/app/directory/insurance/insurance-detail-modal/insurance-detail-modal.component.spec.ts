import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InsuranceDetailModalComponent } from './insurance-detail-modal.component';

describe('InsuranceDetailModalComponent', () => {
  let component: InsuranceDetailModalComponent;
  let fixture: ComponentFixture<InsuranceDetailModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [InsuranceDetailModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
