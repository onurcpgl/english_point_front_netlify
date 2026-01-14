"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { IoSearch, IoLocationSharp, IoMenu, IoClose } from "react-icons/io5";
import { IoMdExit } from "react-icons/io";
import "react-calendar/dist/Calendar.css";
import instructorPanelService from "../../../utils/axios/instructorPanelService";

export default function InstructorSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["instructorProfile"],
    queryFn: instructorPanelService.getInstructorProfile,
  });

  const pathname = usePathname();

  const menuItems = [
    {
      id: 0,
      text: "Dashboard",
      key: "dashboard",
      path: "/instructor/dashboard",
      class: "",
    },
    {
      id: 1,
      text: "Profile",
      key: "profile",
      path: "/instructor/profile",
      class: "",
    },
    {
      id: 2,
      text: "My sessions",
      key: "mysessions",
      path: "/instructor/my-sessions",
      class: "",
      // ÖNEMLİ: Bu menünün aktif sayılacağı diğer sayfaları buraya ekliyoruz
      activeIncludes: [
        "/instructor/create-session",
        "/instructor/edit-session",
      ],
    },
    {
      id: 3,
      text: "Weekly Program",
      key: "weeklyprogram",
      path: "/instructor/weekly-program",
      class: "",
    },
    {
      id: 4,
      text: "Payment",
      key: "payment",
      path: "/instructor/payment",
      class: "",
    },
    {
      id: 5,
      text: "Settings",
      key: "settings",
      path: "/instructor/settings",
      class: "",
    },
  ];

  // Mobilde menü açıkken body scroll'u kapat
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  // Route değiştiğinde mobil menüyü kapat
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header - Hamburger Menu Button */}
      <div className="lg:hidden fixed  top-0 left-0 right-0 bg-[#FFD207] z-40 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : (
              <Image
                src={data?.user.photo || "/images/dummy-avatar.png"}
                alt="Instructor"
                className="rounded-full object-cover w-full h-full"
                width={40}
                height={40}
              />
            )}
          </div>
          <p className="font-semibold text-black text-sm">
            {data?.user?.first_name} {data?.user?.last_name}
          </p>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-black text-3xl focus:outline-none"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <IoClose /> : <IoMenu />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 mt-[60px]"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className="flex flex-col md:flex-row gap-4 h-min w-full">
        <aside
          className={`
  bg-[#FFD207] px-6 lg:px-10 rounded-none lg:rounded-3xl w-full lg:w-auto
  fixed lg:relative top-[60px] lg:top-0 left-0 right-0 lg:right-auto
  h-[calc(100vh-60px)] lg:h-auto
  z-50 lg:z-auto
  transform transition-transform duration-300 ease-in-out
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  overflow-y-auto lg:overflow-visible
`}
        >
          <div className="flex flex-col justify-center items-center py-6 md:py-10">
            {/* Desktop Profile Picture (hidden on mobile as it's in header) */}
            <div className="hidden md:block w-28 h-28">
              {isLoading ? (
                <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse"></div>
              ) : (
                <Image
                  src={data?.user.photo || "/images/dummy-avatar.png"}
                  alt="Instructor"
                  loading="lazy"
                  className="rounded-full object-cover w-full h-full"
                  width={112}
                  height={112}
                />
              )}
            </div>

            {/* Desktop Name (hidden on mobile as it's in header) */}
            <p className="hidden md:block font-semibold text-black mt-2 text-center max-w-[175px]">
              {data?.user?.first_name} {data?.user?.last_name}
            </p>

            {/* Search Bar */}
            <div className="relative w-full md:w-[200px] mt-4 md:mt-4">
              <input
                type="text"
                placeholder="Search"
                className="bg-white rounded-full text-black w-full py-2 pl-4 pr-10 outline-none text-sm"
              />
              <IoSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-black" />
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-3 mt-6 w-full pl-2 md:pl-5">
              {menuItems.map((item) => {
                // 1. Durum: Tam eşleşme (kendi sayfası)
                // 2. Durum: activeIncludes dizisi varsa ve şu anki sayfa bu dizinin içindeyse
                const isActive =
                  pathname === item.path ||
                  (item.activeIncludes &&
                    item.activeIncludes.includes(pathname));

                return (
                  <Link
                    href={item.path}
                    key={item.id}
                    className={`inline-block w-full ${
                      item.class
                    } text-black text-base md:text-md text-left hover:scale-105 transition-all py-2 md:py-0 ${
                      isActive ? "font-semibold" : "font-light"
                    }`}
                  >
                    {item.text}
                  </Link>
                );
              })}
              {/* Exit Button */}
              <div onClick={() => signOut({ callbackUrl: "/" })}>
                <div className="flex items-center gap-2 mt-2 cursor-pointer py-2 md:py-0 hover:scale-105 transition-all">
                  <p className="font-semibold text-black">Exit</p>
                  <IoMdExit className="text-black text-2xl" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
