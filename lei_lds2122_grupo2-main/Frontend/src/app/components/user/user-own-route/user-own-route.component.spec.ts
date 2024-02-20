import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOwnRouteComponent } from './user-own-route.component';

describe('UserOwnRouteComponent', () => {
  let component: UserOwnRouteComponent;
  let fixture: ComponentFixture<UserOwnRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOwnRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOwnRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
