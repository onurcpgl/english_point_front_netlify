"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

// ✅ YENİ LOGO BİLEŞENİ (Üstteki Kısım)
const LoadingLogo = () => (
  <svg
    viewBox="0 0 90 111"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-24 h-auto drop-shadow-lg"
  >
    <g clipPath="url(#clip0_custom_shadow)">
      <path
        d="M88.3061 88.3925C89.986 92.8915 85.2441 97.095 80.991 94.8751L63.9338 85.9728L68.038 78.8543L72.1674 81.0096L77.9037 84.0033L75.6789 78.0525L72.8557 70.4979L76.8306 63.6017C77.2942 62.8055 77.7268 61.9923 78.1257 61.1651C80.5303 56.2132 81.7972 50.7435 81.7972 45.0741C81.7972 35.232 77.9712 25.9752 71.0213 19.0115C64.0686 12.0478 54.818 8.21286 44.986 8.21849C35.2325 8.22411 25.8246 12.135 18.9394 19.0509C12.0148 26.009 8.19995 35.2489 8.19995 45.0712C8.19995 54.8936 12.026 64.1729 18.9787 71.1338C25.9286 78.0975 35.1679 81.9296 45 81.9296C46.0141 81.9296 47.0254 81.8902 48.0255 81.8086L43.2358 90.1144C19.2006 89.1831 0 69.3753 0 45.0712C0 20.7672 20.2091 -0.061987 45.118 -8.74559e-05C69.9678 0.0646257 90.1882 20.5309 89.9972 45.4201C89.927 54.9442 86.9071 63.7621 81.8029 71.01L88.3033 88.3925H88.3061Z"
        fill="black"
      />
      {/* Beyaz Parlayan Damla */}
      <motion.path
        d="M45 11.9635C70.3696 11.9635 86.2273 39.4722 73.5411 61.4832L45 111L34.9348 93.5415C38.1822 94.214 41.5503 94.5685 45 94.5685L66.4395 57.3753C68.7487 53.3687 69.8808 49.0723 69.8021 44.6043C69.7291 40.426 68.5661 36.2675 66.4395 32.5789C64.313 28.8874 61.2988 25.8009 57.7227 23.6485C53.8966 21.3469 49.6183 20.1793 45 20.1793C40.3817 20.1793 36.1006 21.3469 32.2745 23.6485C28.6984 25.8009 25.6842 28.8874 23.5577 32.5789C21.4283 36.2675 20.2681 40.426 20.1951 44.6043C20.1164 49.0723 21.2485 53.3687 23.5577 57.3753L34.5836 76.5051C29.7519 74.9069 25.3274 72.1861 21.6278 68.4778C20.8159 67.6675 20.0715 66.8065 19.3748 65.9118C18.3579 64.6063 17.4533 63.2163 16.6246 61.7842L16.4505 61.4803C3.77271 39.4722 19.6304 11.9635 45 11.9635Z"
        initial={{ fill: "#FFFFFF" }}
        animate={{ fill: ["#FFFFFF", "#FFD207", "#FFFFFF"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <path
        d="M56.7778 47.8055C58.3131 41.2903 54.2844 34.762 47.7794 33.2243C41.2745 31.6865 34.7565 35.7216 33.2212 42.2369C31.6859 48.7521 35.7146 55.2804 42.2196 56.8181C48.7245 58.3559 55.2424 54.3208 56.7778 47.8055Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_custom_shadow">
        <rect width="90" height="111" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// ✅ YENİ 3D OVAL GÖLGE BİLEŞENİ (Alt Kısım)
const LoadingShadow = () => (
  <svg
    width="100"
    height="30"
    viewBox="0 0 100 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-24 h-auto mt-1" // Logonun altına boşluk
  >
    {/* Oval Şekil */}
    <ellipse cx="50" cy="15" rx="48" ry="12" fill="url(#shadow_gradient)" />

    {/* 3D Efekti Veren Renk Geçişi (Gradient) Tanımı */}
    <defs>
      <radialGradient
        id="shadow_gradient"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(50 15) rotate(90) scale(12 48)"
      >
        {/* Merkez: Daha koyu bir sarı/turuncu tonu (Gölgenin en koyu yeri) */}
        <stop stopColor="#C7A000" stopOpacity="0.7" />

        {/* Dış Kenar: Arka plan rengine (#FFD207) yakın ama şeffaf */}
        <stop offset="1" stopColor="#FFD207" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

function SocialCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Giriş yapılıyor...");

  useEffect(() => {
    const handleLogin = async () => {
      const token = searchParams.get("token");
      const role = searchParams.get("user_role") || "user";
      const userPayload = { role: role };

      if (!token) {
        setStatus("Giriş bilgisi bulunamadı.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      try {
        const res = await signIn("social-login-token", {
          token: token,
          user: JSON.stringify(userPayload),
          redirect: false,
        });

        if (res?.error) {
          setStatus("Oturum açma hatası.");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setStatus("Başarılı! Yönlendiriliyorsunuz...");
          router.refresh();
          router.push("/");
        }
      } catch (error) {
        setStatus("Beklenmedik bir hata oluştu.");
      }
    };

    handleLogin();
  }, [searchParams, router]);

  const floatDuration = 1.5;

  return (
    <div className="fixed inset-0 bg-[#FFD207] flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center mb-8 relative">
        {/* LOGO: Yukarı Aşağı Hareket */}
        <motion.div
          animate={{ y: [-15, 0, -15] }}
          transition={{
            duration: floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="z-10"
        >
          <LoadingLogo />
        </motion.div>

        {/* 3D GÖLGE: Büyüme/Küçülme Hareketi */}
        <motion.div
          animate={{
            scaleX: [0.8, 1.1, 0.8], // Yatayda daha fazla genleşir
            scaleY: [0.8, 1.0, 0.8], // Dikeyde daha az
            opacity: [0.5, 1, 0.5], // Logo inince netleşir
          }}
          transition={{
            duration: floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Yeni 3D SVG Gölge Bileşeni */}
          <LoadingShadow />
        </motion.div>
      </div>

      <h2 className="text-2xl font-bold text-black">{status}</h2>
    </div>
  );
}

export default function SocialCallback() {
  return (
    <Suspense fallback={<div className="bg-[#FFD207] h-screen w-full"></div>}>
      <SocialCallbackContent />
    </Suspense>
  );
}
