import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoutesListComponent } from './user-routes-list.component';

describe('UserRoutesListComponent', () => {
  let component: UserRoutesListComponent;
  let fixture: ComponentFixture<UserRoutesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoutesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoutesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
