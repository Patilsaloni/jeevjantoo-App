import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmitPetPage } from './submit-pet.page';

describe('SubmitPetPage', () => {
  let component: SubmitPetPage;
  let fixture: ComponentFixture<SubmitPetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
