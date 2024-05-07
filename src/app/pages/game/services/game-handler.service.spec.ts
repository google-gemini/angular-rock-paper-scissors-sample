import {TestBed} from '@angular/core/testing';

import {GameHandler} from './game-handler.service';

describe('GameHandler', () => {
  let service: GameHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
