// Firebase Cloud Messaging service worker (compat API)
// 背景通知の二重表示対策入り

// 1) SDK（compat）
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-messaging-compat.js');

// 2) 初期化（ページと同じ）
firebase.initializeApp({
  apiKey: "AIzaSyDUevNVtZEycMZ7jl9xSimUqg0PB5SbheY",
  authDomain: "dorm-manager-30ce8.firebaseapp.com",
  projectId: "dorm-manager-30ce8",
  storageBucket: "dorm-manager-30ce8.appspot.com",
  messagingSenderId: "775850695904",
  appId: "1:775850695904:web:0c1ee061060482c1368485",
  measurementId: "G-Y9XBHQKJW2"
});

const messaging = firebase.messaging();

// 直近表示のゆるい重複除去（同じ内容が2秒以内に来たら捨てる）
let __lastShown = { title: '', body: '', t: 0 };

// 3) バックグラウンド受信
messaging.onBackgroundMessage((payload) => {
  // ★ここが肝★
  // payload.notification が付いている通知は、ブラウザ/SDKが自動表示することがある。
  // → 自前の showNotification は呼ばない（重複防止）。
  if (payload && payload.notification && (payload.notification.title || payload.notification.body || payload.notification.icon)) {
    return;
  }

  // data-only メッセージだけ自前表示
  const d = (payload && payload.data) || {};
  const title = d.title || '通知';
  const body  = d.body  || '';
  const icon  = d.icon  || '/icons/icon-180.png';
  const url   = d.click_action || d.link || '/';
  const tag   = d.tag; // 送信側が tag を付けていれば置換・集約に使える

  const now = Date.now();
  if (__lastShown.title === title && __lastShown.body === body && (now - __lastShown.t) < 2000) {
    return; // 直近と同一 → スキップ
  }
  __lastShown = { title, body, t: now };

  self.registration.showNotification(title, { body, icon, tag, data: { url } });
});

// 4) クリックで復帰
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.waitUntil((async () => {
    const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if ('focus' in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow(targetUrl);
  })());
});