"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { IoMenu, IoClose } from "react-icons/io5";
import { IoMdExit } from "react-icons/io";
import { signOut } from "next-auth/react";
import generalService from "../../../utils/axios/generalService";

export default function AccountSidebar() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: generalService.getUserInfo,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // --- RESİM MANTIĞI BURADA TEK SEFERDE HESAPLANIYOR ---
  // 1. profile_image var mı? Varsa onu al.
  // 2. Yoksa avatar var mı? Varsa onu al.
  // 3. İkisi de yoksa dummy resmi al.
  const userProfileImage =
    data?.user?.profile_image ||
    data?.user?.avatar ||
    "https://dummyimage.com/150x150/000/fff.png";

  const navigationItems = [
    { name: "Profil", slug: "profile" },
    { name: "Adreslerim", slug: "my-addresses" },
    { name: "Eğitimlerim", slug: "my-educations" },
    { name: "Mesajlar", slug: "message", badge: 3 },
    { name: "Ayarlar", slug: "settings" },
  ];

  // Mobilde scroll kilitleme
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "unset";
  }, [isSidebarOpen]);

  // Route değişince sidebar kapat
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const isActive = (slug) => {
    return pathname.includes(slug);
  };

  // --- ORTAK MENÜ İÇERİĞİ ---
  const MenuContent = ({ isMobile = false }) => (
    <div
      className={`flex flex-col ${
        isMobile ? "items-center text-center gap-6" : "gap-3 mt-6 "
      }`}
    >
      {/* Profil Resmi - Mobilde menü içine ekledim */}
      {isMobile && (
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 mb-2">
            {isLoading ? (
              <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
            ) : (
              <Image
                src={userProfileImage} // Değişkeni burada kullandık
                alt="User"
                className="rounded-full object-cover w-full h-full border-4 border-white"
                width={96}
                height={96}
                unoptimized={true}
                referrerPolicy="no-referrer"
              />
            )}
          </div>
          <p className="font-bold text-xl text-black">{data?.user?.name}</p>
        </div>
      )}

      {navigationItems.map((item, i) => (
        <Link
          href={item.slug}
          key={i}
          className={`
            inline-block w-full text-black transition-all hover:scale-105
            ${isMobile ? "text-2xl font-bold py-2" : "text-md text-left"}
            ${
              isActive(item.slug)
                ? "font-bold underline decoration-2 underline-offset-4"
                : "font-normal"
            }
          `}
        >
          {item.name}
        </Link>
      ))}

      {/* Çıkış Yap */}
      <div
        onClick={() => signOut({ callbackUrl: "/" })}
        className="cursor-pointer hover:scale-105 transition-all mt-4"
      >
        <div
          className={`flex items-center gap-2 ${
            isMobile
              ? "justify-center text-2xl font-bold text-red-600 bg-white/50 px-6 py-2 rounded-full"
              : ""
          }`}
        >
          <p className={`${!isMobile && "font-semibold text-black"}`}>
            Çıkış Yap
          </p>
          <IoMdExit
            className={`${isMobile ? "text-red-600" : "text-black"} text-2xl`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. MOBİL TETİKLEYİCİ */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed left-0 top-20 z-40 bg-[#FFD207] p-3 rounded-r-xl shadow-lg transition-transform hover:translate-x-1 flex items-center justify-center"
          aria-label="Menüyü Aç"
        >
          <IoMenu className="text-3xl text-black" />
        </button>
      )}

      {/* 2. MOBİL FULL EKRAN MENÜ */}
      <div
        className={`
            lg:hidden fixed inset-0 z-50 bg-[#FFD207]
            flex flex-col items-center justify-center
            transition-all duration-500 ease-in-out
            ${
              isSidebarOpen
                ? "opacity-100 visible translate-x-0"
                : "opacity-0 invisible -translate-x-full"
            }
        `}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-sm"
        >
          <IoClose className="text-3xl text-black" />
        </button>

        <MenuContent isMobile={true} />
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-[300px] shrink-0">
        <div className="bg-[#FFD207] px-10 py-10 rounded-3xl sticky top-4">
          <div className="flex flex-col justify-center items-center">
            {/* Desktop Profil Resmi */}
            <div className="w-28 h-28">
              {isLoading ? (
                <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse"></div>
              ) : (
                <Image
                  src={userProfileImage} // Değişkeni burada kullandık
                  alt={data?.user.name || "User"}
                  className="rounded-full object-cover w-full h-full"
                  width={112}
                  height={112}
                />
              )}
            </div>

            <p className="font-semibold text-black mt-2 text-center max-w-[175px]">
              {data?.user?.name}
            </p>

            <MenuContent isMobile={false} />
          </div>
        </div>
      </aside>
    </>
  );
}
