import Link from "next/link";
import Image from "next/image";
// Logo yolunu kontrol et
import Logo from "../assets/logo/logo.png";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          {Logo && (
            <Image
              src={Logo}
              alt="English Point"
              width={400}
              height={80}
              priority
            />
          )}
        </div>

        {/* 404 Görseli / Metni */}
        <h1 className="text-9xl font-black text-gray-100 select-none">404</h1>

        <div className="-mt-12 relative z-10">
          <h2 className="text-3xl font-bold text-black mb-2">
            Sayfa Bulunamadı
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak
            kullanım dışı kalmış olabilir.
          </p>
        </div>

        {/* Aksiyon Butonu */}
        <Link
          href="/"
          className="inline-block px-10 py-3 bg-[#FFD700] hover:bg-yellow-400 text-black font-bold rounded-full transition-colors duration-300 shadow-md"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
