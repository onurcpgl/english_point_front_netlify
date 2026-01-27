"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  X,
} from "lucide-react";
import Image from "next/image";

const InstructorAccountPopup = ({
  user,
  onMenuClick, // Parent bileşenden gelen opsiyonel click handler
  setMenuOpen,
  menuOpen,
  signOut,
}) => {
  const sidebarRef = useRef(null);
  const router = useRouter();

  // Kapanma animasyonu için state
  const [isClosing, setIsClosing] = useState(false);

  // --- VERİLER (İlk koddan korundu) ---
  const menuItems = [
    {
      icon: User,
      label: "My Profile", // Profilim -> My Profile
      href: "/instructor/profile",
      status: true,
    },
    {
      icon: Settings,
      label: "Settings", // Ayarlar -> Settings
      href: "/instructor/settings",
      status: true,
    },
    {
      icon: Bell,
      label: "Notifications", // Bildirimler -> Notifications
      href: "/instructor/notifications",
      status: false, // Disabled durumu
    },
    {
      icon: Shield,
      label: "Privacy", // Gizlilik -> Privacy
      href: "/mentor-kvkk",
      status: false, // Disabled durumu
    },
  ];

  const supportItems = [
    {
      icon: HelpCircle,
      label: "Help & Support", // Yardım & Destek -> Help & Support
      href: "/instructor/help",
      status: true,
    },
  ];

  // --- FONKSİYONLAR ---

  // Animasyonlu Kapatma
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);
    }, 300); // CSS animasyon süresi (0.3s) ile aynı
  };

  // Menü Tıklama Yönetimi
  const handleItemClick = (item) => {
    if (!item.status) return; // Disabled ise işlem yapma

    if (onMenuClick) onMenuClick(item);

    if (item.href) {
      router.push(item.href);
    }
    handleClose();
  };

  // Çıkış Yapma Yönetimi
  const handleLogout = () => {
    handleClose();
    setTimeout(() => {
      if (signOut) signOut();
    }, 300);
  };

  // Dışarı Tıklama ve ESC Kontrolü
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
      // Scroll'u kilitle
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  if (!menuOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* CSS Animasyon Tanımları */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-drawer-in { animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-drawer-out { animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-backdrop-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-backdrop-out { animation: fadeOut 0.3s ease-out forwards; }
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

      {/* SIDEBAR (ÇEKMECE) */}
      <div
        ref={sidebarRef}
        className={`absolute top-0 right-0 h-full w-[320px] bg-white shadow-2xl flex flex-col
                   ${isClosing ? "animate-drawer-out" : "animate-drawer-in"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden shrink-0 relative">
              <Image
                src={user?.photo || "/images/dummy-avatar.png"}
                alt={user?.first_name || "Instructor"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-xs text-gray-500 truncate max-w-[160px]">
                {user?.email}
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

        {/* BODY (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 py-6">
          {/* Ana Menü */}
          <div className="flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <SidebarItem
                key={index}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>

          <div className="my-6 border-t border-gray-100" />

          {/* Destek Menüsü */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-400 px-4 mb-2 uppercase tracking-wider">
              Destek
            </span>
            {supportItems.map((item, index) => (
              <SidebarItem
                key={index}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 
                       text-red-600 bg-white border border-gray-200 rounded-xl
                       hover:bg-red-50 hover:border-red-200 transition-all duration-200 font-medium text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

// Alt Bileşen: Sidebar Item
const SidebarItem = ({ item, onClick }) => {
  const Icon = item.icon;
  const isDisabled = item.status === false;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                 ${
                   isDisabled
                     ? "opacity-50 cursor-not-allowed bg-gray-50/50"
                     : "hover:bg-gray-50 hover:text-black text-gray-600 cursor-pointer"
                 }`}
    >
      <div
        className={`p-2 rounded-lg transition-all 
                    ${
                      isDisabled
                        ? "bg-gray-100 text-gray-600"
                        : "bg-gray-50 group-hover:bg-white group-hover:shadow-sm text-gray-500 group-hover:text-amber-500"
                    }`}
      >
        <Icon size={18} />
      </div>

      <div className="flex flex-1 items-center justify-between">
        <span className="font-medium text-sm text-gray-500">{item.label}</span>
        {/* Disabled olanlar için kilit ikonu veya badge eklenebilir (Opsiyonel) */}
        {isDisabled && (
          <span className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded">
            Soon
          </span>
        )}
      </div>
    </button>
  );
};

export default InstructorAccountPopup;
