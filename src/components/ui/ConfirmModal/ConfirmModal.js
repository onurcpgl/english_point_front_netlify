import React from "react";
import { X } from "lucide-react";

const ConfirmModal = ({ open, message, onConfirm, onCancel, lang = "tr" }) => {
  if (!open) return null;

  // Dil paketleri
  const translations = {
    tr: {
      title: "Onay",
      defaultMessage: "Bu işlemi yapmak istediğinize emin misiniz?",
      no: "Hayır",
      yes: "Evet",
    },
    en: {
      title: "Approval",
      defaultMessage: "Are you sure you want to perform this action?",
      no: "No",
      yes: "Yes",
    },
  };

  // Seçili dile göre metinleri al (lang props'u geçersizse varsayılan tr olsun)
  const t = translations[lang] || translations.tr;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-20"
        onClick={onCancel}
      />
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">{t.title}</h2>
          <button onClick={onCancel}>
            <X className="w-5 h-5 text-gray-500 hover:scale-105 transition-all cursor-pointer" />
          </button>
        </div>
        <p className="text-gray-700 mb-6">{message || t.defaultMessage}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="mt-4 w-full bg-black border text-white py-2 rounded-lg hover:scale-105 transition-all cursor-pointer"
          >
            {t.no}
          </button>
          <button
            onClick={onConfirm}
            className="mt-4 w-full bg-[#ffd207] text-black py-2 rounded-lg hover:scale-105 transition-all cursor-pointer"
          >
            {t.yes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
