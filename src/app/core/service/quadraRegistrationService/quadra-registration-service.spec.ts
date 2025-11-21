import { TestBed } from '@angular/core/testing';

import { QuadraRegistrationService } from './quadra-registration-service';

describe('QuadraRegistrationService', () => {
  let service: QuadraRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuadraRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
