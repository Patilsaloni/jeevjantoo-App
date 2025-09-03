import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgosPage } from './ngos.page';

describe('NgosPage', () => {
  let component: NgosPage;
  let fixture: ComponentFixture<NgosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
