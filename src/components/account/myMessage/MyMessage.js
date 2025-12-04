"use client";
import React, { useEffect } from "react";
import { echo } from "../../../utils/lib/echo"; // Echo dosyanın yolu

export default function MyMessage() {
  useEffect(() => {
    // 1. Echo çalışıyor mu kontrol et
    if (!echo) {
      console.error("Echo bağlantısı kurulamadı!");
      return;
    }

    console.log("📡 Kanal dinlenmeye başlanıyor: course_sessions");

    // 2. Kanala Abone Ol
    const channel = echo.channel("course_sessions");

    // 3. Eventi Dinle
    // DİKKAT: Backend'de 'broadcastAs' kullandığın için event adının başına NOKTA (.) koymalısın.
    channel.listen(".quota.updated", (event) => {
      console.log("🚀 WEBSOCKET VERİSİ GELDİ! 🚀");
      console.log("-----------------------------");
      console.log("Session ID:", event.sessionId);
      console.log("Yeni Kişi Sayısı:", event.newCount);
      console.log("Tüm Event Objesi:", event);
      console.log("-----------------------------");
    });

    // 4. Temizlik (Component kapanınca dinlemeyi bırak)
    return () => {
      console.log("Dinleme durduruldu.");
      echo.leave("course_sessions");
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded text-sm font-mono text-blue-600">
      (Bu bileşen gizli olarak WebSocket dinliyor. F12 Console sekmesini aç.)
    </div>
  );
}
