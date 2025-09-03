import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhelplinePage } from './ghelpline.page';

describe('GhelplinePage', () => {
  let component: GhelplinePage;
  let fixture: ComponentFixture<GhelplinePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GhelplinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
