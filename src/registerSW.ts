import { registerSW } from 'virtual:pwa-register'

if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      // Yeni içerik mevcut olduğunda yapılacak işlemler
    },
    onOfflineReady() {
      // Uygulama çevrimdışı kullanıma hazır olduğunda yapılacak işlemler
    },
  })
} 