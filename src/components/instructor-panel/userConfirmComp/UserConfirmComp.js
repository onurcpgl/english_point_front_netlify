"use client";
import React, { useState } from "react";
import { X, Camera, QrCode, ChevronRight } from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner"; // YENİ EKLENDİ
import instrocturPanelService from "../../../utils/axios/instructorPanelService";
import SuccesModal from "../../ui/SuccesModal/SuccesMessageComp";
import ErrorModal from "../../ui/ErrorModal/ErrorModal";

function UserConfirmComp({
  userConfirmSelectedUser,
  setUserConfirmModal,
  getSessionUsers,
  openCourseInfo,
}) {
  const [manualCode, setManualCode] = useState("");
  const [activeTab, setActiveTab] = useState("camera");

  // Modal States
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Kamera duraklatma (tarama başarılı olduktan sonra tekrar taramasın diye)
  const [pauseScan, setPauseScan] = useState(false);

  // Doğrulama Fonksiyonu (Hem manuel hem kamera için ortak)
  const handleConfirm = async (codeToVerify) => {
    // Eğer bir kod parametre olarak gelmezse state'deki manualCode'u kullan
    const code = codeToVerify || manualCode;

    if (!code) return;

    try {
      const response = await instrocturPanelService.confirmCourseUser({
        code: code,
        user: userConfirmSelectedUser,
        course: openCourseInfo,
      });

      if (response.status) {
        setSuccessMessage(
          response.message || "Kullanıcı başarıyla doğrulandı ve kursa eklendi."
        );
        setSuccessModalOpen(true);
        getSessionUsers(openCourseInfo);
      } else {
        setErrorMessage(response.message || "Bir hata meydana geldi!");
        setErrorModalOpen(true);
        setPauseScan(false); // Hata alırsa taramaya devam etsin
      }
    } catch (error) {
      console.error("Confirmation Error:", error);
      const message =
        error?.response?.data?.message ||
        "Doğrulama sırasında bir hata oluştu.";
      setErrorMessage(message);
      setErrorModalOpen(true);
      setPauseScan(false); // Hata alırsa taramaya devam etsin
    }
  };

  // QR Tarama Başarılı Olduğunda
  const handleScan = async (result) => {
    // 1. Sonuç kontrolü (Kütüphaneye göre result bazen null gelebilir)
    if (!result || result.length === 0) return;

    const rawValue = result[0].rawValue;

    if (rawValue) {
      // 2. İşlem başlarken kamerayı durdur (Çoklu istek gitmemesi için)
      setPauseScan(true);
      setManualCode(rawValue); // İsteğe bağlı: UI'daki inputu da günceller

      try {
        // 3. Servis isteği

        const response = await instrocturPanelService.confirmCourseUser({
          code: rawValue,
          user: userConfirmSelectedUser,
          course: openCourseInfo,
        });

        // 4. Servisten gelen cevabın kontrolü (handleConfirm ile aynı mantık)
        if (response.status) {
          setSuccessMessage(
            response.message ||
              "Kullanıcı başarıyla doğrulandı ve kursa eklendi."
          );

          setSuccessModalOpen(true);
          getSessionUsers(openCourseInfo);
          // Başarılı olursa tarama duruk kalabilir veya modal kapanınca açılabilir
        } else {
          setErrorMessage(response.message || "Bir hata meydana geldi!");
          setErrorModalOpen(true);
          setPauseScan(false); // Hata durumunda kullanıcı tekrar okutabilsin
        }
      } catch (error) {
        // 5. Catch bloğu (Network hatası veya sunucu hatası)
        console.error("Scan Error:", error);
        const message =
          error?.response?.data?.message ||
          "Tarama ve doğrulama sırasında bir hata oluştu.";

        setErrorMessage(message);
        setErrorModalOpen(true);
        setPauseScan(false); // Hata durumunda taramaya devam et
      }
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    setUserConfirmModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Backdrop */}
        <div
          className="w-full h-full absolute top-0 left-0 z-20 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setUserConfirmModal(false)}
        />

        {/* Modal Content */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md z-50 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Doğrulama</h2>
              <p className="text-xs text-gray-500">
                İşlemi tamamlamak için QR kodu okutun
              </p>
            </div>
            <button
              onClick={() => setUserConfirmModal(false)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-5 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {userConfirmSelectedUser?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                  Seçilen Kullanıcı
                </p>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {userConfirmSelectedUser?.name || "İsimsiz Kullanıcı"}
                </h3>
                {userConfirmSelectedUser?.email && (
                  <p className="text-sm text-gray-500">
                    {userConfirmSelectedUser.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4 overflow-y-auto">
            {/* Tab Switcher */}
            <div className="flex p-1 bg-gray-100 rounded-lg mb-2">
              <button
                onClick={() => setActiveTab("camera")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "camera"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Camera className="w-4 h-4" />
                Kamera
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "manual"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <QrCode className="w-4 h-4" />
                Kod Gir
              </button>
            </div>

            {/* GERÇEK KAMERA ALANI */}
            {activeTab === "camera" && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden shadow-inner">
                  {/* Scanner Component */}
                  <Scanner
                    onScan={handleScan}
                    onError={(error) => console.log(error)}
                    enabled={!pauseScan} // İşlem başarılıysa kamerayı dondur
                    components={{
                      audio: false, // Bip sesini kapatmak istersen
                      finder: false, // Kütüphanenin kendi çerçevesini kapatıp custom kullanıyoruz
                    }}
                    styles={{
                      container: { width: "100%", height: "100%" },
                      video: { objectFit: "cover" },
                    }}
                  />

                  {/* Görsel Süslemeler (Overlay) */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Tarama Çizgisi Animasyonu */}
                    {!pauseScan && (
                      <div className="absolute w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] top-0 animate-[scan_2s_ease-in-out_infinite] z-10" />
                    )}

                    {/* Köşe Çerçeveleri */}
                    <div className="absolute top-4 left-4 w-10 h-10 border-l-4 border-t-4 border-white/70 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-10 h-10 border-r-4 border-t-4 border-white/70 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-10 h-10 border-l-4 border-b-4 border-white/70 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-10 h-10 border-r-4 border-b-4 border-white/70 rounded-br-lg" />

                    {/* Bilgilendirme Metni */}
                    <div className="absolute bottom-6 left-0 w-full text-center">
                      <p className="inline-block bg-black/50 px-3 py-1 rounded-full text-white/90 text-xs font-medium backdrop-blur-sm">
                        QR Kodu çerçeveye hizalayın
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Code Entry Area */}
            {activeTab === "manual" && (
              <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <label className="text-sm font-medium text-gray-700">
                  Kamerayı kullanamıyor musunuz?
                </label>
                <div className="relative">
                  <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Kodu buraya girin..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                  />
                </div>
                <button
                  onClick={() => handleConfirm()}
                  disabled={!manualCode}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Doğrula
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CSS Animation for Scanner Line */}
        <style>{`
          @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}</style>
      </div>

      <SuccesModal
        open={successModalOpen}
        message={successMessage}
        onClose={handleSuccessClose}
      />

      <ErrorModal
        open={errorModalOpen}
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </>
  );
}

export default UserConfirmComp;
