"use client";
import Logo from "../../assets/logo/logodisi.png";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Next.js yönlendirme için

export default function PaymentSuccessPage() {
  const router = useRouter();

  const handleGoToEducations = () => {
    // Kullanıcıyı eğitimlerim sayfasına yönlendirir
    router.push("/account/my-educations");
  };

  return (
    <div className="flex min-h-screen text-black flex-col justify-center items-center gap-6 bg-[#fdd207] px-4">
      {/* Logo ve Pulse Efekti */}
      <div className="relative">
        <Image
          width={300}
          height={150}
          src={Logo}
          alt="EnglishPoint Logo"
          className="animate-bounce" // Başarıyı kutlamak için zıplama efekti
        />
      </div>

      <div className="text-center">
        {/* Onay İkonu (Opsiyonel: SVG Tik İşareti) */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <p className="text-3xl font-bold mb-2">Ödeme Başarılı!</p>
        <p className="text-lg opacity-90 mb-8">
          Eğitim paketiniz başarıyla tanımlandı.
        </p>

        {/* Eğitimlerime Git Butonu */}
        <button
          onClick={handleGoToEducations}
          className="bg-black text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg active:bg-gray-800"
        >
          Eğitimlerime Git
        </button>
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
