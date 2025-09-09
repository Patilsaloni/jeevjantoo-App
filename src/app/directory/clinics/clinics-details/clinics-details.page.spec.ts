import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicsDetailsPage } from './clinics-details.page';

describe('ClinicsDetailsPage', () => {
  let component: ClinicsDetailsPage;
  let fixture: ComponentFixture<ClinicsDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicsDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
