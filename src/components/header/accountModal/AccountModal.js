"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Home,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  X,
} from "lucide-react";
import Image from "next/image";

const AccountModal = ({
  user,
  unreadCount,
  setMenuOpen,
  menuOpen,
  signOut,
}) => {
  const sidebarRef = useRef(null);
  const router = useRouter();

  // Kapanma animasyonunu yönetmek için yeni state
  const [isClosing, setIsClosing] = useState(false);

  const menuItems = [
    { icon: Home, label: "Ana sayfa", href: "/" },
    { icon: User, label: "Profilim", href: "/account/profile" },
    { icon: Settings, label: "Ayarlar", href: "/account/settings" },
    { icon: Bell, label: "Mesajlar", href: "/account/message" },
    { icon: Shield, label: "Gizlilik", href: "/kvkk" },
  ];

  const supportItems = [
    { icon: HelpCircle, label: "Yardım & Destek", href: "/account/help" },
  ];

  // --- KAPATMA FONKSİYONU ---
  // Bu fonksiyon önce animasyonu tetikler, 300ms (animasyon süresi) bekler, sonra menüyü gerçekten kapatır.
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false); // State'i sıfırla
    }, 300); // CSS animasyon süresiyle aynı olmalı (0.3s)
  };

  const handleMenuClick = (href) => {
    if (href) router.push(href);
    handleClose(); // Linke tıklandığında da animasyonlu kapansın
  };

  // Dışarı tıklama ve ESC kontrolü
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
  }, [menuOpen]); // setMenuOpen bağımlılığını kaldırdım, handleClose içinde kullanıyoruz.

  // Menü kapalıysa render etme
  if (!menuOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* CSS Animasyonları */}
      <style>{`
        /* GİRİŞ ANİMASYONLARI */
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* ÇIKIŞ ANİMASYONLARI */
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

      {/* BACKDROP (Arka plan) */}
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-all
                   ${
                     isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
                   }`}
        aria-hidden="true"
        onClick={handleClose} // Arka plana tıklayınca kapat
      />

      {/* SIDEBAR (Çekmece) */}
      <div
        ref={sidebarRef}
        className={`absolute top-0 right-0 h-full w-[320px] bg-white shadow-2xl flex flex-col
                   ${isClosing ? "animate-drawer-out" : "animate-drawer-in"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg overflow-hidden shrink-0">
              {user?.image ? (
                <Image
                  width={40}
                  height={40}
                  src={user.profile_image}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0) || "U"
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">
                {user?.name || "Kullanıcı"}
              </h3>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 py-6">
          <div className="flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <SidebarItem
                unreadCount={unreadCount}
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
                unreadCount={unreadCount}
                key={index}
                item={item}
                onClick={() => handleMenuClick(item.href)}
              />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => {
              handleClose();
              setTimeout(() => signOut(), 300); // Çıkış yapmadan önce animasyonu bekle
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 
                       text-red-600 bg-white border border-gray-200 rounded-xl
                       hover:bg-red-50 hover:border-red-200 transition-all duration-200 font-medium text-sm"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
};

// Alt Bileşen
const SidebarItem = ({ item, onClick, unreadCount }) => {
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

      {/* --- BİLDİRİM ROZETİ MANTIĞI --- */}
      {item.label === "Mesajlar" && unreadCount > 0 && (
        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-100 px-1.5 text-xs font-bold text-red-600">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default AccountModal;
