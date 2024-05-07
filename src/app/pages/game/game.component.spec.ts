import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameComponent} from './game.component';
import {AI_STRATEGY} from './providers/ai-strategy';
import {Signs} from '../../enums/signs';
import {provideRouter} from '@angular/router';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  const fakeStrategy = {
    getAiSign() {
      return Promise.resolve(Signs.Paper);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        {
          provide: AI_STRATEGY,
          useValue: fakeStrategy,
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
