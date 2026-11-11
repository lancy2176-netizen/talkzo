import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: 'AIzaSyACvkss5tEFh4go2P6xVWx8ubx7rDmHdvQ',
  authDomain: 'talkzo-45146.firebaseapp.com',
  databaseURL: 'https://talkzo-45146-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'talkzo-45146',
  storageBucket: 'talkzo-45146.firebasestorage.app',
  messagingSenderId: '862002529339',
  appId: '1:862002529339:web:e60c4f8ee489972c6c881e',
  measurementId: 'G-JTXCBVRDM0',
};

export const firebaseApp = initializeApp(firebaseConfig);

// Analytics is unavailable in some browsers and local environments, so initialize it only when supported.
export const analyticsReady = isSupported()
  .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
  .catch(() => null);
