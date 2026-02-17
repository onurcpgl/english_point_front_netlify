"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import generalService from "../../../utils/axios/generalService"; // Dosya yolunu projene göre ayarla
import {
  IoTicketOutline,
  IoCopyOutline,
  IoCheckmarkCircle,
  IoClose,
  IoTimeOutline,
} from "react-icons/io5";
import { Loader2 } from "lucide-react"; // Yükleniyor ikonu için (opsiyonel)

export default function Kuponlar() {
  // --- 1. React Query Entegrasyonu ---
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch, // İhtiyaç duyarsan manuel tetiklemek için
  } = useQuery({
    queryKey: ["myCoupons"],
    queryFn: generalService.getCoupons,

    // Verinin ne kadar süre "taze" kabul edileceği.
    // 0 yaparsan sayfa her açıldığında (mount) arka planda mutlaka tekrar çeker.
    staleTime: 0,

    // Sayfa/Component her yüklendiğinde veriyi kontrol eder ve gerekirse çeker.
    refetchOnMount: true,

    // Kullanıcı başka taba gidip geri geldiğinde otomatik çeksin mi?
    // (Genelde true olması istenir)
    refetchOnWindowFocus: true,
  });
  // API'den dönen asıl dizi verisi (Backend yapına göre data.data)
  const kuponListesi = apiResponse?.data || [];

  // --- 2. Modal ve Kopyalama State'leri ---
  const [secilenKupon, setSecilenKupon] = useState(null);
  const [kopyalandi, setKopyalandi] = useState(false);

  useEffect(() => {
    if (secilenKupon) {
      setKopyalandi(false);
    }
  }, [secilenKupon]);

  const kopyala = (kod) => {
    navigator.clipboard.writeText(kod);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  // --- 3. Yüklenme Durumu (Skeleton yerine basit loader) ---
  if (isLoading) {
    return (
      <div className="flex flex-col w-full max-w-full bg-[#F5F5F5] p-10 h-[500px] rounded-3xl items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={40} />
        <p className="text-gray-500 mt-2">Kuponlar yükleniyor...</p>
      </div>
    );
  }

  // --- 4. Hata Durumu ---
  if (error) {
    return (
      <div className="flex flex-col w-full max-w-full bg-[#F5F5F5] p-10 h-[500px] rounded-3xl items-center justify-center text-center">
        <p className="text-red-500 font-bold">Bir hata oluştu</p>
        <p className="text-gray-500 text-sm mt-1">
          Kuponlarınız yüklenirken bir sorun oluştu.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden bg-[#F5F5F5] p-10 max-lg:p-4 h-auto rounded-3xl relative min-h-[500px]">
      {/* Sayfa Başlığı */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Kuponlarım</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Aktif kodlarınızı buradan yönetin
          </p>
        </div>
      </div>

      {/* --- Kupon Listesi --- */}
      <div className="flex flex-col gap-4">
        {/* Eğer hiç kupon yoksa */}
        {kuponListesi.length === 0 && (
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
            <div className="inline-block p-4 bg-gray-50 rounded-full mb-3 text-gray-400">
              <IoTicketOutline size={30} />
            </div>
            <h3 className="font-bold text-gray-900">Henüz Kuponunuz Yok</h3>
            <p className="text-gray-500 text-sm">
              Size tanımlanmış aktif bir indirim kodu bulunmuyor.
            </p>
          </div>
        )}

        {/* Kuponları Listele */}
        {kuponListesi.map((kupon) => (
          <div
            key={kupon.id}
            className="bg-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Sol Taraf: İkon ve Bilgi */}
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700">
                <IoTicketOutline size={26} />
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-gray-900">
                  {kupon.indirim}
                </h3>
                {/* Başlık Etiketi (Backend'den gelen başlık örn: HEDİYE ÇEKİ) */}
                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded w-fit font-bold mb-1">
                  {kupon.baslik}
                </span>
                <p className="text-gray-500 text-sm">{kupon.aciklama}</p>

                {/* Mobil Görünüm Tarih */}
                <div className="flex md:hidden items-center gap-1 text-gray-400 text-xs mt-2">
                  <IoTimeOutline />
                  <span>Son: {kupon.sonTarih}</span>
                </div>
              </div>
            </div>

            {/* Sağ Taraf: Buton ve Tarih */}
            <div className="flex items-center justify-between w-full md:w-auto gap-6 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
              <span className="hidden md:block text-gray-400 text-sm font-medium whitespace-nowrap">
                Son: {kupon.sonTarih}
              </span>

              <button
                onClick={() => setSecilenKupon(kupon)}
                className="bg-[#FFD700] hover:bg-[#ffca00] text-black font-bold h-11 px-6 rounded-xl text-sm transition-colors w-full md:w-auto shadow-sm"
              >
                Kodu Görüntüle
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL ALANI --- */}
      {secilenKupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animation-fade-in-up">
            <button
              onClick={() => setSecilenKupon(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <IoClose size={24} />
            </button>

            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-50 text-[#FFD700] rounded-full flex items-center justify-center mb-4">
                <IoTicketOutline size={32} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {secilenKupon.indirim}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {secilenKupon.aciklama}
              </p>

              <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 mb-6 relative group">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                  KUPON KODUNUZ
                </p>
                <p className="text-2xl font-mono font-bold text-gray-800 tracking-wide select-all">
                  {secilenKupon.kod}
                </p>
              </div>

              <button
                onClick={() => kopyala(secilenKupon.kod)}
                className={`
                  w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300
                  ${
                    kopyalandi
                      ? "bg-green-500 text-white shadow-green-200 shadow-lg"
                      : "bg-[#1A1A1A] text-white hover:bg-black shadow-lg"
                  }
                `}
              >
                {kopyalandi ? (
                  <>
                    <IoCheckmarkCircle size={20} />
                    Kopyalandı!
                  </>
                ) : (
                  <>
                    <IoCopyOutline size={20} />
                    Kodu Kopyala
                  </>
                )}
              </button>
            </div>

            <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
              Bu kod {secilenKupon.sonTarih} tarihine kadar geçerlidir.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
