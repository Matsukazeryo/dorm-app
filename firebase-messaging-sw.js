// Firebaseライブラリをインポート
importScripts("https://www.gstatic.com/firebasejs/9.6.7/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.7/firebase-messaging-compat.js");

// あなたのFirebaseプロジェクトの設定情報をここに貼り付け
const firebaseConfig = {
    apiKey: "AIzaSyDUevNVtZEycMZ7jl9xSimUqg0PB5SbheY",
    authDomain: "dorm-manager-30ce8.firebaseapp.com",
    projectId: "dorm-manager-30ce8",
    storageBucket: "dorm-manager-30ce8.appspot.com",
    messagingSenderId: "775850695904",
    appId: "1:775850695904:web:0c1ee061060482c1368485",
    measurementId: "G-Y9XBHQKJW2"
};

// Firebaseアプリを初期化
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// バックグラウンドで通知を受信したときの処理
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://placehold.co/192x192/3498db/ffffff?text=寮'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
