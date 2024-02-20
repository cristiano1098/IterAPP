import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedPlacesComponent } from './interested-places.component';

describe('InterestedPlacesComponent', () => {
  let component: InterestedPlacesComponent;
  let fixture: ComponentFixture<InterestedPlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestedPlacesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestedPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
