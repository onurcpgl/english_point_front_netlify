import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import QRCode from "react-qr-code";

const EnterCard = ({ open, message, setOpenEnterDoc, doc }) => {
  const [mounted, setMounted] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  // YENİ: Animasyon sırasında veriyi korumak için state
  const [lastDoc, setLastDoc] = useState(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Eğer yeni bir doc geldiyse, onu hafızaya al
      if (doc) {
        setLastDoc(doc);
      }
      requestAnimationFrame(() => setShowAnimation(true));
    } else {
      setShowAnimation(false);
      const timeout = setTimeout(() => {
        setMounted(false);
        // Animasyon bittikten sonra hafızayı temizleyebiliriz (opsiyonel)
        setLastDoc(null);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [open, doc]); // doc değiştiğinde de tetiklenmeli

  if (!mounted) return null;

  // Görüntülenecek kod: Mevcut doc varsa onu kullan, yoksa (kapanıyorsa) hafızadakini kullan
  const displayDoc = doc || lastDoc;
  const codeValue = displayDoc?.uniqueCode || "";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Arka plan */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          showAnimation ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setOpenEnterDoc({ status: false, doc: null })}
      />

      {/* Modal */}
      <div
        className={`bg-white w-full max-w-sm z-50 relative transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${
            showAnimation
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-12 scale-95"
          }
          rounded-3xl shadow-2xl border border-gray-100 overflow-hidden`}
      >
        {/* Kapat Butonu */}
        <button
          onClick={() => setOpenEnterDoc({ status: false, doc: null })}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* İçerik */}
        <div
          className={`flex flex-col items-center justify-center pt-12 pb-8 px-8 bg-white space-y-6 transition-all duration-700 delay-100 ${
            showAnimation
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {/* Başlık */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {message || "Eğitim Giriş Kodu"}
            </h2>
            <p className="text-sm text-gray-500">
              Aşağıdaki kodu okutarak giriş yapın
            </p>
          </div>

          {/* QR Kod */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-200 rounded-full opacity-30 blur-xl group-hover:opacity-50 transition duration-1000 animate-pulse"></div>

            <div className="relative bg-white p-4 rounded-2xl border border-gray-100 shadow-xl shadow-yellow-500/5">
              {codeValue ? (
                <QRCode
                  value={codeValue}
                  size={160}
                  viewBox={`0 0 256 256`}
                  level="H"
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              ) : (
                <div className="w-[160px] h-[160px] flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 text-xs font-medium">
                  KOD YOK
                </div>
              )}
            </div>
          </div>

          {/* Manuel Kod Alanı */}
          <div className="w-full">
            <div className="bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 relative overflow-hidden group hover:border-yellow-400 transition-colors duration-300">
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest text-center mb-1">
                Manuel Kod
              </p>
              <p className="text-3xl font-mono font-black text-gray-800 tracking-widest text-center group-hover:text-yellow-600 transition-colors">
                {codeValue || "---"}
              </p>
            </div>
          </div>
        </div>

        {/* Alt Buton */}
        <div className="px-6 pb-6">
          <button
            onClick={() => setOpenEnterDoc({ status: false, doc: null })}
            className="w-full py-3.5 bg-black text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-gray-200 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Tamamdır, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterCard;
