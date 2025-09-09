import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardingDetailsPage } from './boarding-details.page';

describe('BoardingDetailsPage', () => {
  let component: BoardingDetailsPage;
  let fixture: ComponentFixture<BoardingDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardingDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
