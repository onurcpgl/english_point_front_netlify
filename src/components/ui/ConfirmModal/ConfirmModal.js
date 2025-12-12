// components/ConfirmModal.js
import React from "react";
import { X } from "lucide-react";

const ConfirmModal = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Arka plan */}
      <div
        className="absolute inset-0 bg-black opacity-20"
        onClick={onCancel}
      />

      {/* Modal içerik */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Onay</h2>
          <button onClick={onCancel}>
            <X className="w-5 h-5 text-gray-500 hover:scale-105 transition-all cursor-pointer" />
          </button>
        </div>
        <p className="text-gray-700 mb-6">
          {message || "Bu işlemi yapmak istediğinize emin misiniz?"}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="mt-4 w-full bg-black border text-white py-2  hover:scale-105 transition-all cursor-pointer"
          >
            Hayır
          </button>
          <button
            onClick={onConfirm}
            className="mt-4 w-full bg-[#ffd207] text-black py-2  hover:scale-105 transition-all cursor-pointer"
          >
            Evet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
