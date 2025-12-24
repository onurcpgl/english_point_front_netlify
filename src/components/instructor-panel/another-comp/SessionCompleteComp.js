import React, { useState } from "react";
import {
  CheckCircle2,
  Calendar,
  Clock,
  BarChart3,
  X,
  Loader2,
} from "lucide-react";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
const SessionCompleteComp = ({ data, onCancel, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!data) return null;

  const handleConfirmClick = async () => {
    // 1. Loading'i başlat
    setIsSubmitting(true);

    try {
      // 2. API isteğini burada yapıyoruz
      const result = await instructorPanelService.courseSessionCompletedHandler(
        data.id
      );

      if (onConfirm) {
        await onConfirm(result);
      }
    } catch (error) {
      // 4. Hata yönetimi
      console.error("Session update failed:", error);
      // Kullanıcıya hata mesajı göster (Alert yerine Toast önerilir)
      alert("İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.");

      // Hata olduğunda loading'i durdur ki kullanıcı tekrar basabilsin
      setIsSubmitting(false);
    }
  };

  // --- TARİH FORMATLAMA ---
  const formatDate = (dateString) => {
    if (!dateString) return { date: "-", time: "-" };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDate(data.session_date);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Arka Plan */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isSubmitting ? onCancel : undefined}
      />

      {/* Modal Kartı */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Üst Şerit */}
        <div className="h-2 bg-[#FFD207] w-full" />

        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Session Completed?
            </h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
              Are you sure you want to mark this session as completed?
            </p>
          </div>

          {/* Detay Kartı */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
            <h4 className="font-bold text-lg text-gray-900 mb-3 text-center leading-tight">
              {data.session_title}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                <Calendar className="w-4 h-4 text-[#FFD207]" />{" "}
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                <Clock className="w-4 h-4 text-[#FFD207]" /> <span>{time}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                <BarChart3 className="w-4 h-4 text-[#FFD207]" />
                <span className="font-medium">
                  Level: {data.language_level}
                </span>
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Not Yet
            </button>

            <button
              onClick={handleConfirmClick}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  Yes, Confirm
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Kapatma Butonu */}
        {!isSubmitting && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCompleteComp;
