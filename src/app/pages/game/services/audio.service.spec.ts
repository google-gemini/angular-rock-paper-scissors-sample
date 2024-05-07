import {TestBed} from '@angular/core/testing';

import {AudioHandler} from './audio-handler.service';

describe('AudioHandler', () => {
  let service: AudioHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
