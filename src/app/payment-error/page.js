"use client";
import Link from "next/link";
import PaymentError from "../../assets/payment/payment-error.png";
import Logo from "../../assets/logo/logo.png";
import Image from "next/image";

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-10 flex justify-center items-center">
          <Image width={300} height={150} src={Logo} alt="EnglishPoint Logo" />
        </div>

        {/* Hata Mesajı */}
        <h2 className="text-2xl font-bold text-black mb-4 uppercase">
          ÖDEME BAŞARISIZ OLDU
        </h2>

        <div className="flex justify-center items-center">
          <Image
            width={250}
            height={250}
            src={PaymentError}
            alt="EnglishPoint Payment"
          />
        </div>
        <p className="text-gray-600 mb-10 text-lg">
          Lütfen daha sonra tekrar deneyin ya da bir sorun olduğunu
          düşünüyorsanız bizimle iletişime geçin.
        </p>

        {/* Aksiyon Butonları */}

        <button
          onClick={() => window.close()}
          className="block mt-8 text-sm font-semibold text-gray-400 hover:text-black"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}
