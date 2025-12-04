"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

// SVG Loading Bileşeni (Tasarımına uygun)
const LoadingLogo = () => (
  <svg
    width="90"
    height="111"
    viewBox="0 0 90 111"
    fill="none"
    className="w-24 h-auto"
  >
    <path
      d="M45 11.9635C70.3696 11.9635 86.2273 39.4722 73.5411 61.4832L45 111L34.9348 93.5415C38.1822 94.214 41.5503 94.5685 45 94.5685L66.4395 57.3753C68.7487 53.3687 69.8808 49.0723 69.8021 44.6043C69.7291 40.426 68.5661 36.2675 66.4395 32.5789C64.313 28.8874 61.2988 25.8009 57.7227 23.6485C53.8966 21.3469 49.6183 20.1793 45 20.1793C40.3817 20.1793 36.1006 21.3469 32.2745 23.6485C28.6984 25.8009 25.6842 28.8874 23.5577 32.5789C21.4283 36.2675 20.2681 40.426 20.1951 44.6043C20.1164 49.0723 21.2485 53.3687 23.5577 57.3753L34.5836 76.5051C29.7519 74.9069 25.3274 72.1861 21.6278 68.4778C20.8159 67.6675 20.0715 66.8065 19.3748 65.9118C18.3579 64.6063 17.4533 63.2163 16.6246 61.7842L16.4505 61.4803C3.77271 39.4722 19.6304 11.9635 45 11.9635Z"
      animate={{ fill: ["#FFD207", "#000000", "#FFD207"] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </svg>
);

function SocialCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Giriş yapılıyor...");

  useEffect(() => {
    const handleLogin = async () => {
      // 1. URL'den token ve role bilgisini al
      const token = searchParams.get("token");
      const role = searchParams.get("user_role") || "user";

      // Laravel'den eğer isim/email vb göndermediysen, burada token'ı decode edebilirsin
      // veya basitçe 'user' rolüyle başlatırsın. Backend token'ı doğruladığı sürece sorun yok.
      // Şimdilik dummy data ile NextAuth session'ını başlatıyoruz, token session'a işlenecek.
      const userPayload = {
        role: role,
        // Diğer bilgiler (name, email) aslında token'ın içinde şifreli (JWT).
        // NextAuth session callback'inde bu token'ı backend'e sorup user detayını alabilirsin
        // VEYA Laravel redirect URL'ine &name=...&email=... diye ekleyip buraya taşıyabilirsin.
      };

      if (!token) {
        setStatus("Giriş bilgisi bulunamadı.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      try {
        // 2. NextAuth signIn fonksiyonunu 'social-login-token' ID'si ile çağır
        const res = await signIn("social-login-token", {
          token: token,
          user: JSON.stringify(userPayload),
          redirect: false,
        });

        if (res?.error) {
          setStatus("Oturum açma hatası.");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          // Başarılı
          setStatus("Başarılı! Yönlendiriliyorsunuz...");
          router.refresh(); // Session'ı güncelle
          router.push("/"); // Ana sayfaya git
        }
      } catch (error) {
        setStatus("Beklenmedik bir hata oluştu.", error);
      }
    };

    handleLogin();
  }, [searchParams, router]);

  return (
    <div className="fixed inset-0 bg-[#FFD207] flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8"
      >
        <LoadingLogo />
      </motion.div>
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
