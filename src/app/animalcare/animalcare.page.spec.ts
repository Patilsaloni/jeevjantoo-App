import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalcarePage } from './animalcare.page';

describe('AnimalcarePage', () => {
  let component: AnimalcarePage;
  let fixture: ComponentFixture<AnimalcarePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalcarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
