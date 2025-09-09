import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhelplineDetailsPage } from './ghelpline-details.page';

describe('GhelplineDetailsPage', () => {
  let component: GhelplineDetailsPage;
  let fixture: ComponentFixture<GhelplineDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GhelplineDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
