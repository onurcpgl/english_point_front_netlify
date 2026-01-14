"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Info,
  HelpCircle,
  Phone,
  LogIn,
  X,
  User, // Misafir ikonu
} from "lucide-react";

const GuestModal = ({ setMenuOpen, menuOpen }) => {
  const sidebarRef = useRef(null);
  const router = useRouter();

  // Kapanma animasyonunu yönetmek için state (AccountModal ile aynı mantık)
  const [isClosing, setIsClosing] = useState(false);

  // MİSAFİR MENÜ LİNKLERİ
  const guestItems = [
    { icon: Home, label: "Ana Sayfa", href: "/" },
    {
      icon: BookOpen,
      label: "En yakın kafeyi/noktayı bul!",
      href: "/course-sessions",
    },
    { icon: Info, label: "Be An Instructor", href: "/become-instructors" },
  ];

  // DESTEK LİNKLERİ
  const supportItems = [
    { icon: HelpCircle, label: "Yardım Merkezi", href: "/help" },
    { icon: Phone, label: "İletişim", href: "/contact" },
  ];

  // --- KAPATMA VE YÖNLENDİRME FONKSİYONLARI ---
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);
    }, 300); // 300ms animasyon süresi
  };

  const handleMenuClick = (href) => {
    if (href) router.push(href);
    handleClose();
  };

  // Dışarı tıklama, ESC ve Scroll Kilidi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") handleClose();
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Menü kapalıysa render etme
  if (!menuOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* CSS Animasyonları (AccountModal ile BİREBİR AYNI) */}
      <style>{`
        /* GİRİŞ */
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* ÇIKIŞ */
        @keyframes slideOutRight {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        /* CLASSES */
        .animate-drawer-in {
          animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-drawer-out {
          animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-backdrop-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-backdrop-out {
          animation: fadeOut 0.3s ease-out forwards;
        }
      `}</style>

      {/* BACKDROP */}
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-all
                   ${
                     isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
                   }`}
        aria-hidden="true"
        onClick={handleClose}
      />

      {/* SIDEBAR (Çekmece) */}
      <div
        ref={sidebarRef}
        className={`absolute top-0 right-0 h-full w-[320px] bg-white shadow-2xl flex flex-col
                   ${isClosing ? "animate-drawer-out" : "animate-drawer-in"}`}
      >
        {/* HEADER: Misafir Karşılama */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Hoşgeldiniz
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY: Linkler */}
        <div className="flex-1 overflow-y-auto p-4 py-6">
          <div className="flex flex-col gap-1">
            {guestItems.map((item, index) => (
              <SidebarItem
                key={index}
                item={item}
                onClick={() => handleMenuClick(item.href)}
              />
            ))}
          </div>

          <div className="my-6 border-t border-gray-100" />

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-400 px-4 mb-2 uppercase tracking-wider">
              Destek
            </span>
            {supportItems.map((item, index) => (
              <SidebarItem
                key={index}
                item={item}
                onClick={() => handleMenuClick(item.href)}
              />
            ))}
          </div>
        </div>

        {/* FOOTER: Giriş Yap Butonu */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => handleMenuClick("/login")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 
                       text-white bg-black border border-black rounded-xl
                       hover:bg-gray-800 transition-all duration-200 font-medium text-sm shadow-md"
          >
            <LogIn size={18} />
            Giriş Yap
          </button>

          <div className="mt-3 text-center">
            <span className="text-xs text-gray-500">Hesabınız yok mu? </span>
            <button
              onClick={() => handleMenuClick("/register")}
              className="text-xs font-bold text-black hover:underline"
            >
              Kayıt Ol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Alt Bileşen
const SidebarItem = ({ item, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 
                 hover:bg-gray-50 hover:text-black transition-all duration-200 group"
    >
      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
        <Icon
          size={18}
          className="text-gray-500 group-hover:text-amber-500 transition-colors"
        />
      </div>
      <span className="font-medium text-sm">{item.label}</span>
    </button>
  );
};

export default GuestModal;
