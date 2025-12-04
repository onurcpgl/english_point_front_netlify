import { createPortal } from "react-dom";
import { useEffect } from "react";

const AlertMessage = ({ type = "success", message, onClose }) => {
  const bgColor =
    type === "success"
      ? "bg-white"
      : type === "error"
      ? "bg-white"
      : "bg-gray-600";

  // Eğer "document" yoksa (örneğin SSR ortamında) render etme
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div
        className={`w-[90%] max-w-sm ${bgColor} text-black p-6 rounded-2xl shadow-2xl text-center`}
      >
        <p className="text-lg font-medium mb-4">{message}</p>
        <button
          onClick={onClose}
          className=" text-black px-6 bg-[#ffd207] py-2 cursor-pointer rounded-lg font-semibold hover:scale-105 transition-all"
        >
          Ok
        </button>
      </div>
    </div>,
    document.body
  );
};

export default AlertMessage;
