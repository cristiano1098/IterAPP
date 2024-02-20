import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticatedHomePageComponent } from './authenticated-home-page.component';

describe('AuthenticatedHomePageComponent', () => {
  let component: AuthenticatedHomePageComponent;
  let fixture: ComponentFixture<AuthenticatedHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticatedHomePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticatedHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
