"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";

export default function RegisterComplete() {
  return (
    <div className="w-full min-h-screen bg-[#FFD207] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden text-center p-8 md:p-12 relative"
      >
        {/* Dekoratif Arka Plan Detayı (Opsiyonel) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>

        {/* İkon */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 size={48} className="text-green-600" />
          </motion.div>
        </div>

        {/* Başlık ve Metin */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Aramıza Hoş Geldin!
        </h1>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Kaydın başarıyla oluşturuldu. İngilizce öğrenme yolculuğunda sana
          eşlik etmek için sabırsızlanıyoruz.
        </p>

        {/* Aksiyon Butonları */}
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 font-semibold text-lg hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            Giriş Yap
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-3.5  font-medium hover:border-black hover:text-black transition-all duration-300"
          >
            <Home size={20} />
            Ana Sayfaya Dön
          </Link>
        </div>

        {/* Alt Bilgi */}
        <p className="mt-8 text-sm text-gray-400">
          E-postanıza bir doğrulama linki gönderdik, lütfen kontrol etmeyi
          unutma.
        </p>
      </motion.div>
    </div>
  );
}
