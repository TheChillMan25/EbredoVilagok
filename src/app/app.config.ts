import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ebredo-vilagok',
        appId: '1:966343917836:web:b6058487c232219ff44929',
        storageBucket: 'ebredo-vilagok.firebasestorage.app',
        apiKey: 'AIzaSyBbryq9GKDAhDcXPOxtGxN_20nOOhNkWkY',
        authDomain: 'ebredo-vilagok.firebaseapp.com',
        messagingSenderId: '966343917836',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
