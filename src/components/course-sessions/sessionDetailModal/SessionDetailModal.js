"use client";
import { useEffect } from "react";
import {
  FiX,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUser,
  FiAlertCircle,
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

  // --- SEO & METADATA ---
  useEffect(() => {
    if (isOpen && session) {
      const prevTitle = document.title;
      document.title = `${session.session_title} | English Point`;

      const updateMeta = (attribute, key, content) => {
        if (!content) return;
        let element = document.querySelector(`meta[${attribute}="${key}"]`);
        if (!element) {
          element = document.createElement("meta");
          element.setAttribute(attribute, key);
          document.head.appendChild(element);
        }
        element.setAttribute("content", content);
      };

      const description = `${session.google_cafe?.name || "Kafe"} - Eğitmen: ${
        session.instructor?.first_name
      } ${session.instructor?.last_name}`;
      const currentUrl =
        typeof window !== "undefined" ? window.location.href : "";
      const imageUrl = session.google_cafe?.image;

      updateMeta("name", "description", description);
      updateMeta("property", "og:title", session.session_title);
      updateMeta("property", "og:description", description);
      updateMeta("property", "og:image", imageUrl);
      updateMeta("property", "og:type", "website");
      updateMeta("property", "og:url", currentUrl);
      updateMeta("name", "twitter:title", session.session_title);
      updateMeta("name", "twitter:description", description);
      updateMeta("name", "twitter:image", imageUrl);

      return () => {
        document.title = prevTitle;
      };
    }
  }, [isOpen, session]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  // --- HATA MODALI ---
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
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
          >
            <FiX size={20} className="text-gray-600" />
          </button>
          <div className="bg-yellow-100 p-4 rounded-full mb-4">
            <FiAlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Eğitim Bulunamadı
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Aradığınız eğitimin süresi geçmiş ya da iptal edilmiş olabilir.
          </p>
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

  // --- DATA ---
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
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/10 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4 py-8">
        <div
          // DÜZELTME: md:flex-row yerine lg:flex-row yapıldı.
          // Artık tabletlerde de (md) alt alta duracak, sıkışmayacak.
          className="bg-white rounded-xl w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col lg:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-50 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-colors"
          >
            <FiX size={20} className="text-gray-600" />
          </button>

          {/* SOL TARAF (RESİM) */}
          {/* DÜZELTME: Mobilde ve Tablette (md) tam genişlik ve yatay resim.
              Sadece LG (Büyük ekran) olunca sola geçiyor. */}
          <div className="w-full lg:w-[400px] h-64 lg:h-auto relative bg-gray-200 shrink-0">
            <Image
              fill
              src={
                session?.google_cafe?.image || "https://via.placeholder.com/500"
              }
              alt={session?.google_cafe?.name || "Session Image"}
              className="object-cover"
            />
            <div className="absolute top-4 left-4 lg:left-auto lg:right-4 bg-black/80 text-[#FFD207] font-bold px-3 py-1 rounded text-sm shadow-sm">
              English <span className="text-white">Point</span>
            </div>
          </div>

          {/* SAĞ TARAF (İÇERİK) */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
            {/* Üst Bilgiler */}
            {/* DÜZELTME: lg:flex-row yaparak büyük ekranda yan yana alıyoruz */}
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              {/* Başlık ve Adres */}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                  {session?.session_title}
                </h1>
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
                  {session?.google_cafe?.name}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {session?.google_cafe?.address}
                </p>
              </div>

              {/* Tarih / Saat / Süre Kutusu */}
              {/* DÜZELTME: Mobilde ve Tablette YATAY şerit (flex-row),
                  Büyük ekranda (LG) DİKEY (flex-col items-end) */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 shrink-0 border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
                {/* Süre Yuvarlağı */}
                <div className="flex flex-col items-center">
                  <div className="bg-[#FFD207] w-14 h-14 lg:w-20 lg:h-20 flex flex-col items-center justify-center font-bold text-black rounded-xl shadow-sm">
                    <span className="text-lg lg:text-2xl">
                      {session.duration_minutes
                        ? session.duration_minutes / 60
                        : 1}
                    </span>
                    <span className="text-[10px] lg:text-sm uppercase">
                      Saat
                    </span>
                  </div>
                </div>

                <div className="flex flex-col lg:items-end gap-1">
                  <div className="flex flex-col lg:items-end gap-1 text-sm font-bold text-black">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-[#FFD207] text-lg" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-[#FFD207] text-lg" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>

                  <div className="mt-1 lg:mt-2">
                    <div className="bg-gray-100 lg:bg-[#FFD207] px-3 py-1.5 rounded-full font-bold text-xs text-black flex items-center gap-1">
                      <FiUser className="lg:hidden" />
                      <span>
                        {session?.instructor?.first_name}{" "}
                        {session?.instructor?.last_name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alt Kısım: Butonlar */}
            <div className="flex flex-col lg:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-100 gap-4">
              {/* Konum Linki */}
              <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                <a
                  href={`${session?.google_cafe?.map_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors group"
                >
                  <div className="p-2 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
                    <FiMapPin className="text-black group-hover:text-blue-600" />
                  </div>
                  <span className="underline decoration-gray-300 underline-offset-4 group-hover:decoration-blue-300">
                    Konumu Gör
                  </span>
                </a>
              </div>

              {/* Kontenjan (Sadece User varsa veya LG ekranda gösterelim) */}
              {user && (
                <div className="flex items-center gap-3 w-full lg:w-auto justify-center">
                  <span className="text-sm font-bold text-black">
                    Kontenjan:
                  </span>
                  <span className="text-sm font-mono text-gray-500">
                    ({currentUsers}/{quota})
                  </span>
                  <div className="hidden sm:flex gap-1 text-gray-300">
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

              {/* Aksiyon Butonu */}
              {user ? (
                <button
                  onClick={() => {
                    addedSessionBasket(session);
                  }}
                  className="w-full lg:w-auto bg-[#FFD207] hover:bg-[#e6bd06] text-black font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-all active:scale-95"
                >
                  Eğitime Katıl
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push(
                      `/login?callbackUrl=/course-sessions/${session.id}`,
                    );
                  }}
                  className="w-full lg:w-auto bg-[#FFD207] hover:bg-[#e6bd06] text-black font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-all active:scale-95"
                >
                  Giriş Yap ve Katıl
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;
