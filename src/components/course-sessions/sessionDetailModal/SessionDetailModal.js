// components/SessionDetailModal.jsx
"use client";
import { useEffect } from "react";
import {
  FiX,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUser,
  FiInfo,
} from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SessionDetailModal = ({
  isOpen,
  onClose,
  session,
  onJoin,
  addedSessionBasket,
  user,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);
  const router = useRouter();
  if (!isOpen || !session) return null;

  // Tarih Formatlama
  const sessionDate = session?.session_date
    ? new Date(session.session_date)
    : null;
  const formattedDate = sessionDate
    ? sessionDate.toLocaleDateString("tr-TR")
    : "-";
  const formattedTime = sessionDate
    ? sessionDate.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  // Kontenjan Doluluk Oranı (Örnek: 0/6)
  // Backend'den 'users_count' gelirse onu kullan, yoksa 0 varsayalım.
  const currentUsers = session.users_count || 0;
  const quota = session.quota || 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Kartın Kendisi (Maksimum genişlik artırıldı) */}
      <div
        className="bg-white rounded-xl w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kapatma Butonu */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
        >
          <FiX size={20} className="text-gray-600" />
        </button>

        {/* SOL TARAF: Görsel */}
        <div className="w-full md:w-[350px] h-64 md:h-auto relative bg-gray-200 shrink-0">
          <Image
            src={
              session?.google_cafe?.image || "https://via.placeholder.com/500"
            }
            alt={session?.google_cafe?.name || "Session Image"}
            fill
            className="object-cover"
          />
          {/* Logo Overlay (Örn: English Point) */}
          <div className="absolute top-4 right-4 bg-black/80 text-[#FFD207] font-bold px-3 py-1 rounded text-sm">
            English <span className="text-white">Point</span>
          </div>
        </div>

        {/* SAĞ TARAF: İçerik */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Üst Kısım: Başlık ve Sağ Bilgiler */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Sol: Başlık ve Mekan */}
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                {session?.session_title}
              </h2>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {session?.google_cafe?.name}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {session?.google_cafe?.address}
              </p>
            </div>

            {/* Sağ: Sarı Kutu ve Tarih/Saat */}
            <div className="flex flex-col items-end gap-3 shrink-0">
              {/* Sarı Süre Kutusu */}
              <div className="flex flex-col items-center">
                <div className="bg-[#FFD207] w-16 h-16 flex flex-col items-center justify-center font-bold text-black rounded-sm shadow-sm">
                  <span className="text-xl">
                    {session.duration_minutes
                      ? session.duration_minutes / 60
                      : 1}
                  </span>
                  <span className="text-xs uppercase">Saat</span>
                </div>
                <span className="text-xs font-bold text-black mt-1">
                  Eğitim süresi
                </span>
              </div>

              {/* Tarih ve Saat */}
              <div className="flex items-center gap-4 text-sm font-bold text-black mt-2">
                <div className="flex items-center gap-1">
                  <FiCalendar className="text-[#FFD207] text-lg" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock className="text-[#FFD207] text-lg" />
                  <span>{formattedTime}</span>
                </div>
              </div>

              {/* Eğitmen Bilgisi Butonu (Sarı Hap) */}
              <div className="flex flex-col items-end gap-1 mt-1">
                <div className="bg-[#FFD207] px-4 py-1.5 rounded-full font-bold text-xs text-black shadow-sm flex items-center gap-1">
                  Eğitmen: {session?.instructor?.first_name}{" "}
                  {session?.instructor?.last_name}
                </div>
              </div>
            </div>
          </div>

          {/* Alt Kısım: Konum, Kontenjan ve Buton */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-100 gap-4">
            {/* Sol Alt: Konum ve Kontenjan */}
            <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
              {/* Konumu Gör Linki */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${session?.google_cafe?.latitude},${session?.google_cafe?.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
              >
                <FiMapPin className="text-black" />
                <span className="underline decoration-gray-300 underline-offset-4">
                  Konumu Gör
                </span>
              </a>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-black">Kontenjan:</span>
                <span className="text-sm font-mono text-gray-500">
                  ({currentUsers}/{quota})
                </span>

                {/* İnsan İkonları (Dolu/Boş) */}
                <div className="flex gap-1 text-gray-300">
                  {Array.from({ length: quota }).map((_, i) => (
                    <FiUser
                      key={i}
                      className={`w-4 h-4 ${
                        i < currentUsers
                          ? "text-gray-800 fill-gray-800"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sağ Alt: Sarı Katıl Butonu */}
            {user ? (
              <button
                onClick={() => {
                  addedSessionBasket(session);
                }}
                className="w-full md:w-auto bg-[#FFD207] cursor-pointer hover:bg-[#e6bd06] text-black font-bold text-sm px-10 py-3 rounded-full shadow-md transition-all active:scale-95"
              >
                Eğitime Katıl
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push(
                    `/login?callbackUrl=/course-sessions/${session.id}`
                  );
                }}
                className="w-full md:w-auto bg-[#FFD207] cursor-pointer hover:bg-[#e6bd06] text-black font-bold text-sm px-10 py-3 rounded-full shadow-md transition-all active:scale-95"
              >
                Kayıt Ol, Eğitime Katıl
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;
