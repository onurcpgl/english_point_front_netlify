import React from "react";
import { X } from "lucide-react";

const SuccesMessageComp = ({ open, message, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="w-full h-full absolute top-0 left-0 z-20 bg-black opacity-20" />
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">İşlem başarılı</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:scale-105 transition-all cursor-pointer" />
          </button>
        </div>
        <p className="text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-[#ffd207] text-black py-2 rounded-lg hover:scale-105 transition-all cursor-pointer"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default SuccesMessageComp;
