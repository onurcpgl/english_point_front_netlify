"use client";
import { useEffect, useState } from "react";
import Logo from "../../assets/logo/logodisi.png";
import Image from "next/image";

export default function PaymentSuccessPage() {
  const [dots, setDots] = useState("");

  // 1. Nokta Animasyonu: . -> .. -> ... -> (boş)
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 450);

    return () => clearInterval(dotInterval);
  }, []);

  // 2. Mesaj Gönderme ve Kapanma Gecikmesi (2 Saniye)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.opener) {
        // Ana sayfaya başarı bilgisini ilet
        window.opener.postMessage(
          { type: "PAYMENT_RESULT", status: "success" },
          "*",
        );
        // Popup penceresini kapat
        window.close();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen text-black flex-col justify-center items-center gap-6 bg-[#fdd207] px-4">
      {/* Logo ve Pulse Efekti */}
      <div className="relative">
        <Image
          width={300}
          height={150}
          src={Logo}
          alt="EnglishPoint Logo"
          className="animate-pulse"
        />
        {/* Onay İkonu */}
      </div>

      <div className="text-center">
        <p className="text-2xl font-bold mb-1">Ödeme Başarılı!</p>
        <p className="text-lg opacity-90 mb-4">İşlem onaylandı.</p>

        {/* Sabit metin ve hareketli noktalar alanı */}
        <div className="flex justify-center items-center text-md font-medium opacity-75">
          <span>Yönlendiriliyorsunuz</span>
          <span className="w-8 text-left ml-1 font-bold">{dots}</span>
        </div>
      </div>
    </div>
  );
}
// import { useEffect, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import { useCart } from "../../context/CartContext"; // Kendi context yolun
// import PaymentSucces from "../../assets/payment/payment-success.png";
// import Logo from "../../assets/logo/logo.png";

// import Link from "next/link";
// import Image from "next/image";

// function SuccessContent() {
//   const searchParams = useSearchParams();
//   const { clearCart } = useCart();
//   const orderId = searchParams.get("id");

//   useEffect(() => {
//     clearCart();
//   }, []);

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
//       <div className="max-w-2xl w-full text-center">
//         {/* Logo Alanı */}
//         <div className="mb-8 flex justify-center items-center">
//           <Image width={300} height={150} src={Logo} alt="EnglishPoint Logo" />
//         </div>

//         {/* Ana Başlık */}
//         <h2 className="text-2xl font-extrabold text-black mb-6 uppercase tracking-tight">
//           ÖDEME BAŞARIYLA TAMAMLANDI
//         </h2>

//         {/* Açıklama Metni */}
//         <div className="space-y-4 mb-10 text-lg text-gray-700 leading-relaxed px-4 flex justify-center items-center">
//           <Image
//             width={250}
//             height={250}
//             src={PaymentSucces}
//             alt="EnglishPoint Payment"
//           />
//         </div>

//         {/* Alt Bilgi */}
//         <div className="text-gray-500 font-medium">
//           <p className="mb-2">Bizi tercih ettiğiniz için teşekkür ederiz.</p>
//           <p className="text-black font-bold tracking-wide">
//             Keyifli bir öğrenim süreci dileriz!
//           </p>
//         </div>

//         {/* Ana Sayfaya Dönüş */}
//         <Link
//           href="/"
//           className="block mt-8 text-sm font-semibold text-gray-400 hover:text-black"
//         >
//           Ana Sayfaya Dön
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default function PaymentSuccessPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex items-center justify-center min-h-screen">
//           Yükleniyor...
//         </div>
//       }
//     >
//       <SuccessContent />
//     </Suspense>
//   );
// }
