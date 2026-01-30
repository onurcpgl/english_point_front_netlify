"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

// DİKKAT: Bu resmin yolunu eski dosyandan kopyalayıp buraya düzeltmen gerekebilir.
// Örnek: import FınalImage from "../../assets/images/register-success.png";
import FınalImage from "../../../assets/final/finalimage.png"; // Yolu kontrol et!

function InstructorRegisterComplete() {
  return (
    <div className="w-full bg-[#FFD207] min-h-screen overflow-hidden flex justify-center items-center">
      <div className="container mx-auto px-10 max-w-4xl py-20 flex flex-col justify-center items-center">
        {/* Resim */}
        <div className="mb-6">
          <Image src={FınalImage} alt="English Point Success" />
        </div>

        {/* Başlık */}
        <p className="font-bold text-black text-[32px] md:text-[40px] text-center leading-tight">
          "Thanks for registering! We’ll get in touch with you shortly."
        </p>

        {/* Açıklama */}
        <p className="text-black text-center text-lg mt-4 max-w-2xl">
          After your account has been verified, a password setup screen will be
          sent to you.
        </p>

        {/* Buton */}
        <Link
          href="/instructor-login"
          className="rounded-full px-10 py-3 text-white bg-black cursor-pointer mt-8 text-xl font-medium hover:scale-105 hover:bg-gray-900 transition-all duration-300 shadow-lg"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default InstructorRegisterComplete;
