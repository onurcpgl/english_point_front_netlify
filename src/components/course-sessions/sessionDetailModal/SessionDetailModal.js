// components/SessionDetailModal.jsx
"use client";
import { useEffect } from "react";
import {
  FiX,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUser,
  FiAlertCircle, // Uyarı ikonu eklendi
} from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SessionDetailModal = ({
  isOpen,
  onClose,
  session,
  addedSessionBasket,
  user,
}) => {
  const router = useRouter();

  // Scroll kilitleme efekti
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  // 1. ADIM: Sadece modal kapalıysa hiçbir şey render etme.
  if (!isOpen) return null;

  // 2. ADIM: Modal açık ama session verisi YOKSA (null/undefined) uyarı göster.
  if (!session) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative flex flex-col items-center text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Kapatma Butonu */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
          >
            <FiX size={20} className="text-gray-600" />
          </button>

          {/* Uyarı İkonu */}
          <div className="bg-yellow-100 p-4 rounded-full mb-4">
            <FiAlertCircle className="w-10 h-10 text-yellow-600" />
          </div>

          {/* Mesaj */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Eğitim Bulunamadı
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Aradığınız eğitimin süresi geçmiş ya da iptal edilmiş olabilir.
            Lütfen güncel eğitimlerimize göz atın.
          </p>

          {/* Aksiyon Butonu */}
          <button
            onClick={onClose}
            className="bg-[#FFD207] hover:bg-[#e6bd06] text-black font-bold py-3 px-8 rounded-full transition-transform active:scale-95 w-full"
          >
            Eğitimler
          </button>
        </div>
      </div>
    );
  }

  // --- Buradan aşağısı session verisi VARSA çalışır ---

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

  const currentUsers = session.users_count || 0;
  const quota = session.quota || 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
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
          <div className="absolute top-4 right-4 bg-black/80 text-[#FFD207] font-bold px-3 py-1 rounded text-sm">
            English <span className="text-white">Point</span>
          </div>
        </div>

        {/* SAĞ TARAF: İçerik */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row justify-between gap-4">
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

            <div className="flex flex-col items-end gap-3 shrink-0">
              <div className="flex flex-col items-center">
                <div className="bg-[#FFD207] w-16 h-16 flex flex-col items-center justify-center font-bold text-black rounded-sm shadow-sm">
                  <span className="text-xl">
                    {session.duration_minutes
                      ? session.duration_minutes / 60
                      : 1}
                  </span>
                  <span className="text-xs uppercase">Saat</span>
                </div>
              </div>

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

              <div className="flex flex-col items-end gap-1 mt-1">
                <div className="bg-[#FFD207] px-4 py-1.5 rounded-full font-bold text-xs text-black shadow-sm flex items-center gap-1">
                  Eğitmen: {session?.instructor?.first_name}{" "}
                  {session?.instructor?.last_name}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-100 gap-4">
            <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
              <a
                href={`${session?.google_cafe?.map_url}`}
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
                Giriş Yap, Eğitime Katıl
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;
