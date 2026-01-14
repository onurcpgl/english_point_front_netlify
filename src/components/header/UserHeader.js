"use client";
import { useUserSession } from "../../providers/UserSessionProvider";
import { useState, useMemo } from "react";
import { signOut } from "next-auth/react";
import EnglishPointLogoDisi from "../../assets/logo/logo.png";
import { LogIn, ChevronDown } from "lucide-react";
import AccountModal from "./accountModal/AccountModal";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import generalService from "../../utils/axios/generalService";

export default function UserHeader() {
  // Yan menü (Sadece çıkış yapılmışsa veya linkler için gerekirse)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Account Modal (Hem desktop hem mobil için)
  const [menuOpen, setMenuOpen] = useState(false);

  const { userSession, status } = useUserSession();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["myMessage"],
    queryFn: generalService.getMessage,
  });
  const unreadCount = useMemo(() => {
    if (!data?.data) return 0;
    return data.data.filter((notification) => notification.read_at === null)
      .length;
  }, [data]);

  // Hamburger butonuna tıklanınca çalışacak fonksiyon
  const handleMobileMenuClick = () => {
    if (status === "authenticated") {
      // Giriş yapılmışsa direkt AccountModal'ı aç/kapat
      setMenuOpen(!menuOpen);
    } else {
      // Giriş yapılmamışsa normal yan menüyü aç
      setMobileMenuOpen(true);
    }
  };

  return (
    <header className="relative w-full z-50">
      <nav
        aria-label="Global"
        className="container mx-auto flex items-center justify-between py-8 max-lg:px-4"
      >
        {/* --- SOL TARAF: LOGO --- */}
        <div className="flex pr-10">
          <Link href="/" className=" p-1.5">
            <span className="sr-only">English Point</span>
            <Image
              width={300}
              height={100}
              alt="Logo"
              src={EnglishPointLogoDisi}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* --- MOBİL TARAFI (Hamburger Butonu) --- */}
        <div className="flex lg:hidden relative">
          {/* relative verdik ki modal buna göre hizalansın */}
          <button
            type="button"
            onClick={handleMobileMenuClick}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-900"
          >
            <span className="sr-only">Open menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>

          {/* BURASI ÖNEMLİ: Mobilde butona basınca Modal burada açılacak */}
          {menuOpen && status === "authenticated" && userSession?.user && (
            <div className="absolute right-0 top-full mt-2 z-50 origin-top-right">
              {/* AccountModal'ın stilinin bozulmaması için bir wrapper div koyabilirsin veya direkt çağırabilirsin */}
              <AccountModal
                user={userSession?.user}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                signOut={signOut}
              />
            </div>
          )}
        </div>

        {/* --- DESKTOP TARAFI --- */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center relative">
          {status === "unauthenticated" && (
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-900 flex item-center gap-2 justify-center"
            >
              <p className="pt-1">Giriş Yap</p> <LogIn />
            </Link>
          )}

          {status === "authenticated" && userSession?.user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-black text-sm font-bold flex justify-center items-center cursor-pointer gap-1"
              >
                <ChevronDown
                  className={`text-sm transition-transform duration-300 ${
                    menuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
                <p>Hesabım</p>
                {unreadCount > 0 && (
                  <span className="absolute -top-3 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white text-[12px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {menuOpen && (
                <AccountModal
                  unreadCount={unreadCount}
                  user={userSession?.user}
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                  signOut={signOut}
                />
              )}
            </div>
          )}
        </div>
      </nav>

      {/* --- MOBİL YAN MENÜ (Sadece giriş YAPILMAMIŞSA açılır) --- */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <Image
                width={300}
                height={100}
                alt="Logo"
                src={EnglishPointLogoDisi}
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {/* Linkler buraya gelebilir */}
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Features
                </Link>
              </div>
              <div className="py-6">
                {/* Sadece giriş yapmamışsa Giriş Butonu Görünür */}
                <Link
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                >
                  Giriş Yap <LogIn className="size-5" />
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
