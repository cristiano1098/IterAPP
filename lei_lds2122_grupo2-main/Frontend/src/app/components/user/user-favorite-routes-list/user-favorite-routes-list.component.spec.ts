import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavoriteRoutesListComponent } from './user-favorite-routes-list.component';

describe('UserFavoriteRoutesListComponent', () => {
  let component: UserFavoriteRoutesListComponent;
  let fixture: ComponentFixture<UserFavoriteRoutesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFavoriteRoutesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFavoriteRoutesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
