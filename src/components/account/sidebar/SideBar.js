"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import generalService from "../../../utils/axios/generalService";

// İkon Setleri (React Icons)
import {
  IoMenu,
  IoClose,
  IoPersonOutline,
  IoMapOutline,
  IoSchoolOutline,
  IoMailOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";

export default function AccountSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // --- DATA FETCHING ---
  const { data, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: generalService.getUserInfo,
  });

  const { data: userMessage } = useQuery({
    queryKey: ["myMessage"],
    queryFn: generalService.getMessage,
  });

  // --- LOGIC ---
  const unreadCount = useMemo(() => {
    if (!userMessage?.data) return 0;
    return userMessage.data.filter((n) => n.read_at === null).length;
  }, [userMessage]);

  const userProfileImage =
    data?.user?.profile_image ||
    data?.user?.avatar ||
    "https://dummyimage.com/150x150/000/fff.png";

  // Menü Elemanlarına İkon Eklendi
  const navigationItems = [
    { name: "Profil", slug: "profile", icon: IoPersonOutline },
    { name: "Adreslerim", slug: "my-addresses", icon: IoMapOutline },
    { name: "Eğitimlerim", slug: "my-educations", icon: IoSchoolOutline },
    { name: "Mesajlar", slug: "message", icon: IoMailOutline },
    { name: "Ayarlar", slug: "settings", icon: IoSettingsOutline },
  ];

  // --- EFFECTS ---
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "unset";
  }, [isSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const isActive = (slug) => pathname.includes(slug);

  // --- UI COMPONENTS ---

  return (
    <>
      {/* 1. MOBİL TETİKLEYİCİ BUTON (Sol üstte sabit asılı kalır) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed left-0 top-24 z-30 bg-[#FFD207] text-black p-3 rounded-r-xl shadow-md hover:pl-4 transition-all duration-300"
          aria-label="Menüyü Aç"
        >
          <IoMenu size={24} />
        </button>
      )}

      {/* 2. MOBİL OVERLAY (TAM EKRAN MENÜ) */}
      <div
        className={`
          fixed inset-0 z-50 bg-[#FFD207] flex flex-col items-center justify-center gap-8
          transition-all duration-500 ease-in-out lg:hidden
          ${
            isSidebarOpen
              ? "opacity-100 visible translate-x-0"
              : "opacity-0 invisible -translate-x-full"
          }
        `}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-6 right-6 p-3 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
        >
          <IoClose size={32} className="text-black" />
        </button>

        {/* Mobil Profil Kartı */}
        <div className="flex flex-col items-center animate-fadeIn">
          <div className="w-24 h-24 mb-4 rounded-full border-4 border-white overflow-hidden shadow-lg relative bg-gray-100">
            {isLoading ? (
              <div className="w-full h-full animate-pulse bg-gray-300" />
            ) : (
              <Image
                src={userProfileImage}
                alt="User"
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <h3 className="text-2xl font-bold text-black">{data?.user?.name}</h3>
          <p className="text-black/60 text-sm">Hoşgeldiniz</p>
        </div>

        {/* Mobil Linkler */}
        <nav className="flex flex-col w-full px-10 gap-3">
          {navigationItems.map((item, i) => {
            const active = isActive(item.slug);
            const Icon = item.icon;
            return (
              <Link
                key={i}
                href={item.slug}
                className={`
                  flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    active
                      ? "bg-white text-black font-bold shadow-md scale-105"
                      : "text-black hover:bg-white/20"
                  }
                `}
              >
                <Icon size={22} />
                <span className="text-lg">{item.name}</span>
                {item.slug === "message" && unreadCount > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 mt-4 text-red-700 font-semibold hover:scale-105 transition-transform"
          >
            <IoLogOutOutline size={24} />
            <span>Çıkış Yap</span>
          </button>
        </nav>
      </div>

      {/* 3. DESKTOP SIDEBAR (Sabit Sol Menü) */}
      <aside className="hidden lg:block w-[280px] shrink-0">
        <div className="sticky top-24 bg-[#FFD207] rounded-[30px] p-6 shadow-xl flex flex-col min-h-[500px]">
          {/* Desktop Profil */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 mb-3 rounded-full border-[3px] border-white shadow-md overflow-hidden relative bg-white">
              {isLoading ? (
                <div className="w-full h-full animate-pulse bg-gray-200" />
              ) : (
                <Image
                  src={userProfileImage}
                  alt={data?.user?.name || "User"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <h2 className="text-lg font-bold text-black text-center leading-tight">
              {data?.user?.name}
            </h2>
          </div>

          {/* Desktop Navigasyon */}
          <nav className="flex-1 flex flex-col gap-2">
            {navigationItems.map((item, i) => {
              const active = isActive(item.slug);
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  href={item.slug}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative
                    ${
                      active
                        ? "bg-white text-black font-bold shadow-sm translate-x-1"
                        : "text-black/80 hover:bg-white/30 hover:text-black hover:translate-x-1"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={`${
                      active
                        ? "text-black"
                        : "text-black/70 group-hover:text-black"
                    }`}
                  />
                  <span className="text-sm tracking-wide">{item.name}</span>

                  {/* Bildirim Badge - Sağa yaslı */}
                  {item.slug === "message" && unreadCount > 0 && (
                    <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold text-white bg-red-600 rounded-full shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Footer (Çıkış) */}
          <div className="mt-6 pt-4 border-t border-black/10">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-2 w-full text-black/70 hover:text-red-700 hover:bg-white/30 rounded-xl transition-all duration-200"
            >
              <IoLogOutOutline size={20} />
              <span className="text-sm font-semibold">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
