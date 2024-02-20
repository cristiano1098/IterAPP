import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseRouteComponent } from './use-route.component';

describe('UseRouteComponent', () => {
  let component: UseRouteComponent;
  let fixture: ComponentFixture<UseRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
