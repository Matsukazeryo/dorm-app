// Firebase Cloud Messaging service worker (compat API)
// 注意: SW では onMessage は使わず、onBackgroundMessage を使う。
//      ページ側の前景通知/UI はクライアントJSで実装すること。

// 1) SDK を SW 側で読み込む（互換APIで統一）
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-messaging-compat.js');

// 2) Web と同じ設定で初期化
firebase.initializeApp({
  apiKey: "AIzaSyDUevNVtZEycMZ7jl9xSimUqg0PB5SbheY",
  authDomain: "dorm-manager-30ce8.firebaseapp.com",
  projectId: "dorm-manager-30ce8",
  storageBucket: "dorm-manager-30ce8.appspot.com",
  messagingSenderId: "775850695904",
  appId: "1:775850695904:web:0c1ee061060482c1368485",
  measurementId: "G-Y9XBHQKJW2"
});

// 3) SW 内でも messaging を生成
const messaging = firebase.messaging();

// 4) バックグラウンド受信時の通知表示（アプリがバックグラウンド/非アクティブ時）
messaging.onBackgroundMessage((payload) => {
  // FCM の payload.notification を利用
  const n = payload && payload.notification ? payload.notification : {};
  const title = n.title || '通知';
  const body  = n.body  || '';
  const icon  = n.icon  || '/icons/icon-180.png'; // あるアイコンパスに調整可
  const clickAction = n.click_action || (payload && payload.fcmOptions && payload.fcmOptions.link) || '/';

  self.registration.showNotification(title, {
    body,
    icon,
    data: { url: clickAction }
  });
});

// 5) 通知クリックでウィンドウをフォーカス/オープン
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      if ('focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(targetUrl);
  })());
});

// （参考）
// これまで SW にあった `messaging.onMessage(...)` はページ用APIなので削除。
// フォアグラウンド表示をしたい場合は、クライアント側で onMessage を使って
// in-app toast を出すなどの実装にすること。