import {TestBed} from '@angular/core/testing';

import {GlobalScore} from './global-score.service';

describe('GlobalScore', () => {
  let service: GlobalScore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalScore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
