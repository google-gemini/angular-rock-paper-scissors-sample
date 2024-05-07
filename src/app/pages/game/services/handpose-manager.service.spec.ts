import {TestBed} from '@angular/core/testing';

import {HandposeManager} from './handpose-manager.service';

describe('HandposeManager', () => {
  let service: HandposeManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandposeManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
