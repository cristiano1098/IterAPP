import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAuthenticatedHomePageComponent } from './not-authenticated-home-page.component';

describe('NotAuthenticatedHomePageComponent', () => {
  let component: NotAuthenticatedHomePageComponent;
  let fixture: ComponentFixture<NotAuthenticatedHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotAuthenticatedHomePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAuthenticatedHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
