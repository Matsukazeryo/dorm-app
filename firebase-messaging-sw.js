// フォアグラウンドでの OS 通知は Service Worker 側のみで行う
messaging.onMessage(payload => {
    console.log('Foreground FCM message received:', payload);
    const { notification } = payload;
    // ページ側での OS 通知は無効化
    // if (notification && Notification.permission === 'granted') {
    //     new Notification(notification.title, { body: notification.body });
    // }
    // 必要に応じて in-page toast を表示するなどの処理を追加
});
// Import Firebase scripts for messaging in the service worker
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Initialize Firebase in this service worker
firebase.initializeApp({
    apiKey: "AIzaSyDUevNVtZEycMZ7jl9xSimUqg0PB5SbheY",
    authDomain: "dorm-manager-30ce8.firebaseapp.com",
    projectId: "dorm-manager-30ce8",
    storageBucket: "dorm-manager-30ce8.appspot.com",
    messagingSenderId: "775850695904",
    appId: "1:775850695904:web:0c1ee061060482c1368485",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title, { body });
});