import {TestBed} from '@angular/core/testing';

import {ThemeManager} from './theme-manager.service';

describe('ThemeManager', () => {
  let service: ThemeManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
