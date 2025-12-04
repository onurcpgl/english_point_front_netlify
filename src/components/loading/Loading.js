"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// SVG Bileşeni (Daha temiz olması için dışarı aldım)
const LogoSvg = () => (
  <svg
    width="90"
    height="111"
    viewBox="0 0 90 111"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-24 h-auto" // Tailwind ile boyutlandırma
  >
    <g clipPath="url(#clip0_151_475)">
      <path
        d="M88.3061 88.3925C89.986 92.8915 85.2441 97.095 80.991 94.8751L63.9338 85.9728L68.038 78.8543L72.1674 81.0096L77.9037 84.0033L75.6789 78.0525L72.8557 70.4979L76.8306 63.6017C77.2942 62.8055 77.7268 61.9923 78.1257 61.1651C80.5303 56.2132 81.7972 50.7435 81.7972 45.0741C81.7972 35.232 77.9712 25.9752 71.0213 19.0115C64.0686 12.0478 54.818 8.21286 44.986 8.21849C35.2325 8.22411 25.8246 12.135 18.9394 19.0509C12.0148 26.009 8.19995 35.2489 8.19995 45.0712C8.19995 54.8936 12.026 64.1729 18.9787 71.1338C25.9286 78.0975 35.1679 81.9296 45 81.9296C46.0141 81.9296 47.0254 81.8902 48.0255 81.8086L43.2358 90.1144C19.2006 89.1831 0 69.3753 0 45.0712C0 20.7672 20.2091 -0.061987 45.118 -8.74559e-05C69.9678 0.0646257 90.1882 20.5309 89.9972 45.4201C89.927 54.9442 86.9071 63.7621 81.8029 71.01L88.3033 88.3925H88.3061Z"
        fill="black"
      />
      {/* Damla/Pin Kısmı: Animasyon için motion.path kullanıyoruz */}
      <motion.path
        id="drop"
        d="M45 11.9635C70.3696 11.9635 86.2273 39.4722 73.5411 61.4832L45 111L34.9348 93.5415C38.1822 94.214 41.5503 94.5685 45 94.5685L66.4395 57.3753C68.7487 53.3687 69.8808 49.0723 69.8021 44.6043C69.7291 40.426 68.5661 36.2675 66.4395 32.5789C64.313 28.8874 61.2988 25.8009 57.7227 23.6485C53.8966 21.3469 49.6183 20.1793 45 20.1793C40.3817 20.1793 36.1006 21.3469 32.2745 23.6485C28.6984 25.8009 25.6842 28.8874 23.5577 32.5789C21.4283 36.2675 20.2681 40.426 20.1951 44.6043C20.1164 49.0723 21.2485 53.3687 23.5577 57.3753L34.5836 76.5051C29.7519 74.9069 25.3274 72.1861 21.6278 68.4778C20.8159 67.6675 20.0715 66.8065 19.3748 65.9118C18.3579 64.6063 17.4533 63.2163 16.6246 61.7842L16.4505 61.4803C3.77271 39.4722 19.6304 11.9635 45 11.9635Z"
        // Renk animasyonu: Sarıdan beyaza gidip geliyor
        animate={{ fill: ["#FFD207", "#ffffff", "#FFD207"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <path
        d="M56.7778 47.8055C58.3131 41.2903 54.2844 34.762 47.7794 33.2243C41.2745 31.6865 34.7565 35.7216 33.2212 42.2369C31.6859 48.7521 35.7146 55.2804 42.2196 56.8181C48.7245 58.3559 55.2424 54.3208 56.7778 47.8055Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_151_475">
        <rect width="90" height="111" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const loadingMessages = [
  "Sizin için en uygun eğitmenleri buluyoruz...",
  "İhtiyaçlarınıza göre analiz yapılıyor...",
  "Uygun dil seviyeniz belirleniyor...",
  "Eğitmen eşleştirme tamamlanmak üzere...",
];

function Loading() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500); // Mesaj değişimi biraz daha yavaş olsun (2.5s)

    return () => clearInterval(interval);
  }, []);

  return (
    // Ana Kapsayıcı: Temiz sarı zemin
    <div className="fixed inset-0 bg-[#FFD207] flex flex-col items-center justify-center z-[9999]">
      <div className="flex flex-col items-center max-w-md px-6">
        {/* Logo Animasyonu: Hafifçe yukarı aşağı süzülme (Floating) */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8 filter drop-shadow-lg"
        >
          <LogoSvg />
        </motion.div>

        {/* Mesaj Alanı (Animasyonlu Geçiş) */}
        <div className="h-24 flex items-center justify-center w-full mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-xl md:text-2xl font-bold text-black leading-snug text-center"
            >
              {loadingMessages[currentMessageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Modern İlerleme Çubuğu */}
        <div className="w-64 h-2 bg-black/10 rounded-full overflow-hidden relative">
          {/* İçteki dolan kısım */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-black"
            initial={{ width: "0%" }}
            animate={{
              width: ["0%", "100%"],
              x: ["-100%", "100%"], // Soldan sağa kayan bir animasyon
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ borderRadius: "9999px" }}
          />
        </div>

        <p className="mt-4 text-sm font-semibold text-black/60">
          Lütfen bekleyin...
        </p>
      </div>
    </div>
  );
}

export default Loading;
