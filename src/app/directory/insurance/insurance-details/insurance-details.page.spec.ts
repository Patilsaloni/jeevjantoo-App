import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceDetailsPage } from './insurance-details.page';

describe('InsuranceDetailsPage', () => {
  let component: InsuranceDetailsPage;
  let fixture: ComponentFixture<InsuranceDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
