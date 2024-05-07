import {InjectionToken} from '@angular/core';
import {AiStrategy} from '../interfaces/ai-strategy';

export const AI_STRATEGY = new InjectionToken<AiStrategy>('AI_STRATEGY');
