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