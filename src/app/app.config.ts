import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';

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
    /* provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), */
    provideAuth(() => {
      const auth = getAuth();
      // Ha localhost-on vagyunk, csatlakozunk a 9099-es porthoz
      if (
        location.hostname === 'localhost' ||
        location.hostname.includes('192.168.1.240') ||
        location.hostname === '127.0.0.1'
      ) {
        connectAuthEmulator(auth, `http://${location.hostname}:9099`, {
          disableWarnings: true,
        });
      }
      return auth;
    }),
    // Firestore konfiguráció módosítása
    provideFirestore(() => {
      const firestore = getFirestore();
      // Ha localhost-on vagyunk, csatlakozunk a 8080-as porthoz
      if (
        location.hostname === 'localhost' ||
        location.hostname.includes('192.168.1.240') ||
        location.hostname === '127.0.0.1'
      ) {
        // Itt is a location.hostname-t használjuk
        connectFirestoreEmulator(firestore, location.hostname, 8080);
      }
      return firestore;
    }),
  ],
};
