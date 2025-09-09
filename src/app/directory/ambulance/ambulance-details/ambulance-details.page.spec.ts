import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmbulanceDetailsPage } from './ambulance-details.page';

describe('AmbulanceDetailsPage', () => {
  let component: AmbulanceDetailsPage;
  let fixture: ComponentFixture<AmbulanceDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbulanceDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
