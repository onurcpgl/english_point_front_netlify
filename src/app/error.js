"use client";

import { useEffect } from "react";
// Logonun yolunu kendi proje yapına göre düzenle
// Genelde app klasörü içinden çıkmak için ../ kullanılır
import Image from "next/image";
// Eğer logo importun farklıysa burayı düzelt
import Logo from "../assets/logo/logo.png";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Uygulama Hatası:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo Alanı - Eğer logo yüklenmezse diye optional chaining */}
        <div className="mb-8 flex justify-center">
          {Logo && (
            <Image
              src={Logo}
              alt="English Point"
              width={200}
              height={80}
              priority
            />
          )}
        </div>

        {/* İkon / Görsel */}
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 bg-yellow-400 rounded-full flex items-center justify-center bg-opacity-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-black mb-3">
          Beklenmedik Bir Hata!
        </h2>

        <p className="text-gray-600 mb-10 text-lg">
          Sistemde geçici bir sorun oluştu. Mühendislerimiz durumdan haberdar
          edildi.
        </p>

        {/* Butonlar - Sitenin Tasarımına Uygun */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-[#FFD700] hover:bg-yellow-400 text-black font-bold rounded-full transition-colors duration-300 shadow-md"
          >
            Tekrar Dene
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-full transition-colors duration-300 shadow-md"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}
