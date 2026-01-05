"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react"; // useMemo eklendi
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import EnglishPointLogoDisi from "../../assets/logo/logodisi.png";
import EnglishPointLogo from "../../assets/logo/logo.png";

import AccountModal from "./accountModal/AccountModal";
import BasketButton from "./basketButton/BasketButton";
import { useQuery } from "@tanstack/react-query";

import { ChevronDown, Menu } from "lucide-react";
import { LogIn, UserPlus } from "react-feather";
import Link from "next/link";
import AuthLinks from "./headerLink/AuthLinks";
import generalService from "../../utils/axios/generalService";
import GuestLinks from "./headerLink/GuestLink";
import GuestModal from "./accountModal/GuestModal";
import Image from "next/image";

export default function SecondHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpenGuest, setMenuOpenGuest] = useState(false);

  // 1. ADIM: useSession'ı en tepeye aldık.
  // Böylece 'status' değişkenini aşağıda kullanabiliriz.
  const { data: session, status } = useSession();

  // 2. ADIM: useQuery'ye 'enabled' ayarı ekledik.
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["myMessage"],
    queryFn: generalService.getMessage,
    // Sadece kullanıcı giriş yapmışsa (authenticated) istek at:
    enabled: status === "authenticated",
  });

  // --- OKUNMAMIŞ MESAJ SAYISINI HESAPLAMA ---
  const unreadCount = useMemo(() => {
    // Veri yoksa veya kullanıcı giriş yapmamışsa 0 döndür
    if (!data?.data || status !== "authenticated") return 0;

    return data.data.filter((notification) => notification.read_at === null)
      .length;
  }, [data, status]);

  const pathname = usePathname();
  const isActive = pathname.startsWith("/course-sessions");
  return (
    <header className="absolute w-full z-50">
      <nav
        aria-label="Global"
        className="container mx-auto flex items-center justify-between py-8 max-lg:px-4 max-lg:py-2 z-40"
      >
        <div className="flex pr-10">
          <Link href="/" className="p-1.5">
            <span className="sr-only">English Point</span>
            {/* <svg
              viewBox="0 0 90 111"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="logo w-14 h-auto md:w-[90px]"
            >
              <g clipPath="url(#clip0_151_475)">
                <path
                  d="M88.3061 88.3925C89.986 92.8915 85.2441 97.095 80.991 94.8751L63.9338 85.9728L68.038 78.8543L72.1674 81.0096L77.9037 84.0033L75.6789 78.0525L72.8557 70.4979L76.8306 63.6017C77.2942 62.8055 77.7268 61.9923 78.1257 61.1651C80.5303 56.2132 81.7972 50.7435 81.7972 45.0741C81.7972 35.232 77.9712 25.9752 71.0213 19.0115C64.0686 12.0478 54.818 8.21286 44.986 8.21849C35.2325 8.22411 25.8246 12.135 18.9394 19.0509C12.0148 26.009 8.19995 35.2489 8.19995 45.0712C8.19995 54.8936 12.026 64.1729 18.9787 71.1338C25.9286 78.0975 35.1679 81.9296 45 81.9296C46.0141 81.9296 47.0254 81.8902 48.0255 81.8086L43.2358 90.1144C19.2006 89.1831 0 69.3753 0 45.0712C0 20.7672 20.2091 -0.061987 45.118 -8.74559e-05C69.9678 0.0646257 90.1882 20.5309 89.9972 45.4201C89.927 54.9442 86.9071 63.7621 81.8029 71.01L88.3033 88.3925H88.3061Z"
                  fill="black"
                />
                <path
                  id="drop"
                  d="M45 11.9635C70.3696 11.9635 86.2273 39.4722 73.5411 61.4832L45 111L34.9348 93.5415C38.1822 94.214 41.5503 94.5685 45 94.5685L66.4395 57.3753C68.7487 53.3687 69.8808 49.0723 69.8021 44.6043C69.7291 40.426 68.5661 36.2675 66.4395 32.5789C64.313 28.8874 61.2988 25.8009 57.7227 23.6485C53.8966 21.3469 49.6183 20.1793 45 20.1793C40.3817 20.1793 36.1006 21.3469 32.2745 23.6485C28.6984 25.8009 25.6842 28.8874 23.5577 32.5789C21.4283 36.2675 20.2681 40.426 20.1951 44.6043C20.1164 49.0723 21.2485 53.3687 23.5577 57.3753L34.5836 76.5051C29.7519 74.9069 25.3274 72.1861 21.6278 68.4778C20.8159 67.6675 20.0715 66.8065 19.3748 65.9118C18.3579 64.6063 17.4533 63.2163 16.6246 61.7842L16.4505 61.4803C3.77271 39.4722 19.6304 11.9635 45 11.9635Z"
                  fill={
                    isActive && status === "authenticated" ? "#ffd207" : "white"
                  }
                />
                <path
                  d="M56.7778 47.8055C58.3131 41.2903 54.2844 34.762 47.7794 33.2243C41.2745 31.6865 34.7565 35.7216 33.2212 42.2369C31.6859 48.7521 35.7146 55.2804 42.2196 56.8181C48.7245 58.3559 55.2424 54.3208 56.7778 47.8055Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_151_475">
                  <rect width="90" height="111" fill="white" />
                </clipPath>
              </defs>
            </svg> */}
            <Image
              src={
                isActive && status === "authenticated"
                  ? EnglishPointLogo
                  : EnglishPointLogoDisi
              }
              alt="English Point Logo"
              className="logo w-52 h-auto"
            />
          </Link>
        </div>
        {menuOpenGuest && (
          <GuestModal menuOpen={menuOpenGuest} setMenuOpen={setMenuOpenGuest} />
        )}
        {status === "loading" ? (
          <div className="hidden lg:flex lg:gap-x-12 items-center">
            <span className="text-lg text-gray-900/40 blur-[3px] animate-pulse select-none">
              En yakın kafeyi/noktayı bul!
            </span>
          </div>
        ) : status === "authenticated" ? (
          <AuthLinks />
        ) : (
          <GuestLinks />
        )}
        <div className=" lg:flex lg:flex-1 lg:justify-end items-center relative">
          {status === "unauthenticated" && (
            <>
              <Link
                href="/login"
                className="hidden lg:flex text-sm font-semibold text-gray-900  item-center gap-2 justify-center"
              >
                <p className="pt-1">Giriş Yap</p> <LogIn />
              </Link>

              <button
                onClick={() => setMenuOpenGuest(true)}
                className="text-black text-sm font-bold flex justify-center items-center cursor-pointer gap-1 lg:hidden"
              >
                <Menu className="text-xl transition-transform duration-300" />
              </button>
            </>
          )}

          {status === "authenticated" && session?.user && (
            <div className="relative flex items-center gap-4">
              {/* Sepet ikonu */}
              <BasketButton />

              {/* Hesabım menüsü */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-black text-sm font-bold flex justify-center items-center cursor-pointer gap-1 relative" // relative eklendi ki badge düzgün konumlanabilsin
                >
                  <ChevronDown
                    className={`hidden lg:block text-sm transition-transform duration-300 ${
                      menuOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                  <Menu
                    className={`block lg:hidden text-xl transition-transform duration-300`}
                  />
                  <p className="hidden lg:block">Hesabım</p>

                  {/* --- 2. KIRMIZI BİLDİRİM ROZETİ (BADGE) --- */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-3 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white text-[12px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {menuOpen && (
                  <AccountModal
                    unreadCount={unreadCount}
                    user={session?.user}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    signOut={signOut}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
