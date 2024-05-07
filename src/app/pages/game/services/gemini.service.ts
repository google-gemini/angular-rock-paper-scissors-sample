/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Injectable, inject} from '@angular/core';
import {Functions, HttpsCallable, httpsCallable} from '@angular/fire/functions';

interface AskGeminiRequest {
  prompt: string;
}

interface AskGeminiResponse {
  status: 'error' | 'success';
  data: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private readonly funcs: Functions = inject(Functions);
  private callableFunction: HttpsCallable<AskGeminiRequest, AskGeminiResponse> | null = null;

  async askGemini<T>(prompt: string): Promise<T> {
    const result = await this.getCallableFunction()({prompt});

    return result.data.data as T;
  }

  private getCallableFunction() {
    return this.callableFunction ?? this.loadCallableFunction();
  }

  private loadCallableFunction(): HttpsCallable<AskGeminiRequest, AskGeminiResponse> {
    this.callableFunction = httpsCallable(this.funcs, 'askGemini');

    return this.callableFunction;
  }
}
