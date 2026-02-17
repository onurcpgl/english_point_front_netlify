import { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "../../../context/CartContext";

export default function BasketButton() {
  const { sessions, loading } = useCart(); // artık tek eğitim objesi

  const [open, setOpen] = useState(false);
  function getDate(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("tr-TR"); // "25.08.2025"
  }
  function getTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }); // "14:30"
  }

  return (
    <div className="relative">
      {/* Sepet Butonu */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-black -top-0.5 hover:text-gray-700 transition-all transform hover:scale-110 cursor-pointer flex justify-center items-center"
      >
        <ShoppingCart className="w-7 h-7 max-lg:w-5 max-lg:h-5" />
        {sessions?.basket && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            1
          </span>
        )}
      </button>

      {/* Sepet Popup */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-xl rounded-2xl p-4 z-50 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-black text-sm">Sepetim</h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-all"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {sessions?.basket !== null ? (
            <div
              onClick={() => (window.location.href = "/sepet")}
              className="flex justify-between items-center bg-gray-50 rounded-xl p-3 hover:bg-gray-200 cursor-pointer transition-all"
            >
              <div className="flex flex-col">
                <p className="font-medium text-sm text-black">
                  {sessions?.basket?.course_session.session_title}
                </p>
                <span className="text-gray-500 text-xs">
                  {sessions?.basket?.course_session.language_level}
                </span>
                <span className="text-gray-500 text-xs">
                  {getDate(sessions?.basket?.course_session.session_date)} -{" "}
                  {getTime(sessions?.basket?.course_session.session_date)}
                </span>
                <hr className="border w-full my-2" />
                <span className="text-gray-500 text-xs">298.80₺</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center text-sm py-6">
              Sepetin boş 😔
            </p>
          )}

          {sessions && (
            <button
              className="w-full bg-black cursor-pointer text-white py-2 mt-4 text-sm rounded-xl hover:bg-gray-800 transition-all"
              onClick={() => (window.location.href = "/sepet")}
            >
              Sepete Git
            </button>
          )}
        </div>
      )}
    </div>
  );
}
