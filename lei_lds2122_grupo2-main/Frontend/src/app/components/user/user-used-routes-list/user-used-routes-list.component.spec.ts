import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUsedRoutesListComponent } from './user-used-routes-list.component';

describe('UserUsedRoutesListComponent', () => {
  let component: UserUsedRoutesListComponent;
  let fixture: ComponentFixture<UserUsedRoutesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserUsedRoutesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUsedRoutesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
