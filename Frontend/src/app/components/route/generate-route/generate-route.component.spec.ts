import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRouteComponent } from './generate-route.component';

describe('GenerateRouteComponent', () => {
  let component: GenerateRouteComponent;
  let fixture: ComponentFixture<GenerateRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
