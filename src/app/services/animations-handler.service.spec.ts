import { TestBed } from '@angular/core/testing';

import { AnimationsHandlerService } from './animations-handler.service';

describe('AnimationsHandlerService', () => {
  let service: AnimationsHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationsHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
