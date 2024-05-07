import {TestBed} from '@angular/core/testing';

import {GeminiService} from './gemini.service';
import {Functions} from '@angular/fire/functions';

describe('GeminiService', () => {
  let service: GeminiService;
  const functionsMock = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Functions,
          useValue: functionsMock,
        },
      ],
    });
    service = TestBed.inject(GeminiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
