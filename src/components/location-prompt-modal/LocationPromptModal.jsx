"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import generalService from "../../utils/axios/generalService";
import ilDataRaw from "../../utils/helpers/il.json";
import ilceDataRaw from "../../utils/helpers/ilce.json";

export default function LocationPromptModal() {
  const { status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Başarı durumu için yeni state

  // 1. React Query Optimizasyonu
  const { data: locationResponse, isLoading: isCheckingLocation } = useQuery({
    queryKey: ["checkLocation"],
    queryFn: () => generalService.getLocationInfo(),
    enabled: status === "authenticated",
    // Sürekli istek atmasını engellemek için eklendi:
    staleTime: Infinity, // Veri asla bayatlamaz (tekrar fetch etmez)
    refetchOnWindowFocus: false, // Sekme değiştirip dönünce tekrar istek atmaz
    retry: 1, // Hata olursa sadece 1 kez tekrar dener
  });

  useEffect(() => {
    if (locationResponse) {
      const userData =
        locationResponse.user || locationResponse.data || locationResponse;
      if (!userData?.city_id || !userData?.district_id) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  }, [locationResponse]);

  useEffect(() => {
    const cityList =
      Array.isArray(ilDataRaw) && ilDataRaw[0]?.data
        ? ilDataRaw[0].data
        : ilDataRaw.data || [];
    setCities(cityList);
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const ilceList =
        Array.isArray(ilceDataRaw) && ilceDataRaw[0]?.data
          ? ilceDataRaw[0].data
          : ilceDataRaw.data || [];

      const filteredDistricts = ilceList.filter(
        (ilce) => String(ilce.il_id) === String(selectedCity),
      );
      setDistricts(filteredDistricts);
      setSelectedDistrict("");
    } else {
      setDistricts([]);
    }
  }, [selectedCity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCity || !selectedDistrict) return;

    setIsSubmitting(true);

    try {
      const payload = {
        city_id: selectedCity,
        district_id: selectedDistrict,
      };

      const data = await generalService.setLocationInfo(payload);

      if (data?.status === true) {
        // İşlem başarılı state'ini aktif et
        setIsSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["checkLocation"] });
        // 2 saniye (2000 ms) bekleyip sayfayı öyle yenile
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      } else {
        console.error("İşlem başarısız:", data.message);
        alert(data?.message || "Lütfen il ve ilçe seçimini kontrol ediniz.");
      }
    } catch (error) {
      console.error("Konum kaydedilirken hata oluştu:", error);
      alert(
        "Sunucuya ulaşılamadı veya bir hata oluştu. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || isCheckingLocation) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white relative rounded-[24px] shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-300">
        {/* İşlem başarılıysa yeşil tik ekranını göster */}
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Harika!</h2>
            <p className="text-gray-500 font-medium">
              Konum bilginiz başarıyla kaydedildi.
            </p>
          </div>
        ) : (
          /* Başarılı değilse (başlangıç durumu) normal formu göster */
          <>
            {/* Kapatma Butonu */}
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="absolute top-5 cursor-pointer right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
              aria-label="Kapat"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Başlık ve İkon Alanı */}
            <div className="text-center mb-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Konumunu Belirle
              </h2>
              <p className="text-gray-500 text-sm">
                Sana uygun eğitimleri ve en yakın kafeleri daha kolay
                bulabilmemiz için lütfen bulunduğun şehir bilgisini seç.
              </p>
            </div>

            {/* Form Alanı */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* İl Seçimi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  İl
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#fcd34d] focus:border-transparent transition-all"
                >
                  <option value="">İl Seçiniz</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* İlçe Seçimi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  İlçe
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  required
                  disabled={!selectedCity}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#fcd34d] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">İlçe Seçiniz</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gönder Butonu */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedCity || !selectedDistrict}
                className="w-full bg-[#fcd34d] hover:bg-[#fbbf24] text-black font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-4 flex items-center justify-center"
              >
                {isSubmitting && (
                  <span className="animate-spin border-2 border-black border-t-transparent rounded-full w-5 h-5 mr-2"></span>
                )}
                {isSubmitting ? "Kaydediliyor..." : "Devam Et"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
