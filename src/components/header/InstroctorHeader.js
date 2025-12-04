"use client";
import { useInstructorSession } from "../../providers/InstructorSessionProvider";
import { useState } from "react";
import { signOut } from "next-auth/react";
import EnglishPointLogoDisi from "../../assets/logo/logo.png";
import { LogIn, ChevronDown } from "lucide-react";
import InstructorAccountModal from "./instructorAccountModal/InstructorAccountModal";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  PopoverGroup,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import instructorPanelService from "../../utils/axios/instructorPanelService";

export default function InstructorHeader() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["instructorProfile"],
    queryFn: instructorPanelService.getInstructorProfile,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { instructorSession, status } = useInstructorSession();

  return (
    <header className="relative w-full z-50 max-lg:hidden">
      <nav
        aria-label="Global"
        className="container mx-auto flex items-center justify-between py-8 max-lg:px-4"
      >
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
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-900"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center relative">
          {status === "unauthenticated" && (
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-900 flex item-center gap-2 justify-center"
            >
              <p className="pt-1">Giriş Yap</p> <LogIn />
            </Link>
          )}

          {status === "authenticated" && instructorSession?.user && (
            <div className="relative ">
              {/* Profil fotoğrafı veya ikon */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-black text-sm font-bold flex justify-center items-center cursor-pointer gap-1"
              >
                <ChevronDown
                  className={`text-sm transition-transform duration-300 ${
                    menuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
                <p>Account</p>
              </button>

              {/* Menü */}
              {menuOpen && (
                <InstructorAccountModal
                  user={data?.user}
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                  signOut={signOut}
                />
              )}
            </div>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
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
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-900"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-white/5">
                    Product
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none group-data-open:rotate-180"
                    />
                  </DisclosureButton>
                </Disclosure>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-white/5"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-white/5"
                >
                  Marketplace
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-white/5"
                >
                  Company
                </Link>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-white/5"
                >
                  Giriş Yap <LogIn />
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
