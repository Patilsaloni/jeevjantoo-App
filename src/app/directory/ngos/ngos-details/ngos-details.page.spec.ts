import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgosDetailsPage } from './ngos-details.page';

describe('NgosDetailsPage', () => {
  let component: NgosDetailsPage;
  let fixture: ComponentFixture<NgosDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgosDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
