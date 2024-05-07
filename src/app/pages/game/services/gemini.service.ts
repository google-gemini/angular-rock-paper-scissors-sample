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
