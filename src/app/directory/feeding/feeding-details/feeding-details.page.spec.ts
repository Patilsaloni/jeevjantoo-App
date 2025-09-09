import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedingDetailsPage } from './feeding-details.page';

describe('FeedingDetailsPage', () => {
  let component: FeedingDetailsPage;
  let fixture: ComponentFixture<FeedingDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedingDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
