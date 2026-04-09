// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  SUPA_BASE:{
    supaBaseUrl: 'https://avqpoxjbkjiqnfsuiaxx.supabase.co',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cXBveGpia2ppcW5mc3VpYXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjkxNzAsImV4cCI6MjA4OTgwNTE3MH0.gxjcj5Cb-JGJhRwzGayMvTucYVNp4IEvKIo8ydBlHQQ',
  },

  FIREBASE_CONFIG: {
    apiKey: "AIzaSyAhPPFA8-2lrzx8PEAKYdOPgyQdVhyEL9I",
    authDomain: "fire-database-e3fa6.firebaseapp.com",
    projectId: "fire-database-e3fa6",
    storageBucket: "fire-database-e3fa6.firebasestorage.app",
    messagingSenderId: "86123398212",
    appId: "1:86123398212:web:32fada019688e783ae6811"
  },

  // FCM Push Notifications — reemplaza estos valores con los reales de Firebase Console
  // Project Settings > Cloud Messaging > Web Push certificates > Add certificate
  FCM: {
    vapidKey: 'BG-G1kQAbY0vsPhAmnxK2r5eR3vn1jYweUpySaDErlySJCOU5Mz5DnF5saBx1x7GzNj22tCAIFN5peRE62y5aVs',   // Firebase Console > Cloud Messaging > Web Push certificates
  },
};



// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
