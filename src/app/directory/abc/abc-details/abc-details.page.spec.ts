import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbcDetailsPage } from './abc-details.page';

describe('AbcDetailsPage', () => {
  let component: AbcDetailsPage;
  let fixture: ComponentFixture<AbcDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AbcDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
