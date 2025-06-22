// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-messaging-compat.js');

// あなたの Firebase 設定をそのまま貼る
firebase.initializeApp({
  apiKey: "AIzaSyDUevNVtZEycMZ7jl9xSimUqg0PB5SbheY",
  authDomain: "dorm-manager-30ce8.firebaseapp.com",
  projectId: "dorm-manager-30ce8",
  storageBucket: "dorm-manager-30ce8.appspot.com",
  messagingSenderId: "775850695904",
  appId: "1:775850695904:web:0c1ee061060482c1368485"
});

const messaging = firebase.messaging();

// バックグラウンドで通知を受け取ったら表示
messaging.onBackgroundMessage(({ notification }) => {
  if (notification) self.registration.showNotification(notification.title, notification);
});