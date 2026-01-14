import Echo from "laravel-echo";
import Pusher from "pusher-js";

if (typeof window !== "undefined") {
  window.Pusher = Pusher;

  window.Echo = new Echo({
    broadcaster: "reverb",
    key: "englishpointsecretkey123_", // Sunucudaki REVERB_APP_KEY ile AYNI olmalı
    wsHost: "api.englishpoint.com.tr",
    wsPort: 443, // SSL Portu
    wssPort: 443,
    forceTLS: true, // SSL zorlamayı kapat
    encrypted: false, // Şifrelemeyi kapat
    disableStats: true, // İstatistik isteklerini kapat (Log kirliliğini önler)
    enabledTransports: ["ws", "wss"],
  });
}

export const echo = typeof window !== "undefined" ? window.Echo : null;
