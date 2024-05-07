import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFunctions, provideFunctions} from '@angular/fire/functions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom([
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'ng-rock-paper-scissors-demo',
          // appId: '',
          // storageBucket: '',
          // apiKey: '',
          // authDomain: '',
          // messagingSenderId: '',
        }),
      ),
      provideFunctions(() => getFunctions()),
    ]),
  ],
};
