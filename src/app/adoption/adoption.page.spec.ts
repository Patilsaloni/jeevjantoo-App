import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdoptionPage } from './adoption.page';

describe('AdoptionPage', () => {
  let component: AdoptionPage;
  let fixture: ComponentFixture<AdoptionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdoptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
