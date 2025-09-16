import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityReportsPage } from './activity-reports.page';

describe('ActivityReportsPage', () => {
  let component: ActivityReportsPage;
  let fixture: ComponentFixture<ActivityReportsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
