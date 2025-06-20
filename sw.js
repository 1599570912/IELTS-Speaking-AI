// Service Worker for IELTS Speaking App PWA
const CACHE_NAME = 'ielts-speaking-app-v1.0.0';
const urlsToCache = [
  './',
  './ielts-speaking-app-ai.html',
  './speech-recognition-module.js',
  './manifest.json'
];

// 安装Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('缓存文件中...');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker 激活中...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有，直接返回
        if (response) {
          return response;
        }
        
        // 否则从网络获取
        return fetch(event.request).then((response) => {
          // 检查是否是有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆响应用于缓存
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// 后台同步（可选）
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('后台同步触发');
    // 这里可以添加离线时的数据同步逻辑
  }
});

// 推送通知（可选）
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '您有新的IELTS练习提醒',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '开始练习',
        icon: './icon-192.png'
      },
      {
        action: 'close',
        title: '稍后提醒',
        icon: './icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('IELTS Speaking Practice', options)
  );
});

// 处理通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // 打开应用
    event.waitUntil(
      clients.openWindow('./ielts-speaking-app-ai.html')
    );
  } else if (event.action === 'close') {
    // 关闭通知
    console.log('用户选择稍后提醒');
  } else {
    // 默认行为：打开应用
    event.waitUntil(
      clients.openWindow('./ielts-speaking-app-ai.html')
    );
  }
}); 