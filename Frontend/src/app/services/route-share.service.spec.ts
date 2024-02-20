import { TestBed } from '@angular/core/testing';

import { RouteShareService } from './route-share.service';

describe('RouteShareService', () => {
  let service: RouteShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
