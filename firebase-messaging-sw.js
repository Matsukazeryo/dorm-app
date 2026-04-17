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

// SW を即時適用してコントローラ化（トークン取得の安定化に寄与）
self.addEventListener('install', () => {
  try { self.skipWaiting(); } catch(_) {}
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try { await self.clients.claim(); } catch(_) {}
  })());
});

// 直近表示のゆるい重複除去（同じ内容が2秒以内に来たら捨てる）
let __lastShown = { title: '', body: '', t: 0 };

// 3) バックグラウンド受信
messaging.onBackgroundMessage((payload) => {
  // 受信ログ（Safari のリモートデバッグで確認可）
  try { console.log('[SW] onBackgroundMessage payload:', payload); } catch(_) {}
  if (!payload || typeof payload !== 'object') return;
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
  const icon  = d.icon  || (payload.notification && payload.notification.icon) || '/icons/icon-180.png';
  const url   = d.click_action || d.link || '/';
  const tag   = d.tag; // 送信側が tag を付けていれば置換・集約に使える

  const now = Date.now();
  if (__lastShown.title === title && __lastShown.body === body && (now - __lastShown.t) < 2000) {
    return; // 直近と同一 → スキップ
  }
  __lastShown = { title, body, t: now };

  self.registration.showNotification(title, { body, icon, tag, data: { url } });
});

// 4) クリックで復帰（同一オリジンの既存タブを優先し、なければ新規）
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const raw = (event.notification && event.notification.data && event.notification.data.url) || '/';
  const targetUrl = (() => {
    try { return new URL(raw, self.location.origin).toString(); }
    catch(_) { return self.location.origin + '/'; }
  })();

  event.waitUntil((async () => {
    try {
      const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      // 1) 同一オリジンの既存クライアントを探す
      let best = null;
      for (const c of all) {
        try {
          if (new URL(c.url).origin === self.location.origin) { best = c; break; }
        } catch(_) {}
      }
      if (best) {
        await best.focus();
        // URL が違う場合は遷移（navigate はフォアグラウンドでのみ有効）
        try {
          if (typeof best.navigate === 'function' && best.url !== targetUrl) {
            await best.navigate(targetUrl);
          }
        } catch(_) {}
        return;
      }
      // 2) 無ければ新規で開く
      if (clients.openWindow) return clients.openWindow(targetUrl);
    } catch(_) {}
  })());
});