"use client";
import React, { useState } from "react";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import generalService from "../../utils/axios/generalService"; // Kendi dosya yoluna göre düzenle

export default function ContactPage() {
  // Form verilerini tutacağımız state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // İstek atılırken butonun durumunu ve kullanıcıya gösterilecek mesajı yönetmek için
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'

  // Input alanları değiştikçe state'i güncelleyen fonksiyon
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await generalService.sendContactMessage(formData);
      setStatus("success");
      // Formu temizle
      setFormData({ name: "", email: "", message: "" });

      // 5 saniye sonra başarı mesajını gizleyebilirsin (opsiyonel)
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Mesaj gönderilirken hata oluştu:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#fdd207] selection:text-black">
      {/* Hero / Başlık Kısmı */}
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 uppercase">
          Hello! <br className="hidden md:block" />
          <span className="text-black inline-block relative mt-2">
            BİZE ULAŞIN.
            {/* Altı çizili vurgu efekti */}
            <span className="absolute -bottom-2 left-0 w-full h-4 bg-[#fdd207] -z-10 skew-x-[-15deg]"></span>
          </span>
        </h1>
        <p className="text-lg md:text-xl font-medium max-w-2xl mt-6">
          İngilizce serüveninde bir sorun mu var? Ya da sadece "How are you?"
          demek mi istiyorsun? Aşağıdaki formu doldur veya doğrudan bize ulaş!
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Sol Taraf: İletişim Formu */}
        <div className="relative mt-8 lg:mt-0">
          {/* Arkadan taşan siyah blok efekti */}
          <div className="absolute top-4 left-4 w-full h-full bg-black rounded-[2rem] rounded-bl-none"></div>

          <form
            onSubmit={handleSubmit}
            className="relative bg-[#fdd207] p-8 md:p-10 rounded-[2rem] rounded-bl-none z-10"
          >
            <h2 className="text-3xl font-black mb-6 uppercase">
              Mesaj Gönder!
            </h2>

            {/* Başarı ve Hata Mesajları */}
            {status === "success" && (
              <div className="mb-6 p-4 bg-black text-[#fdd207] font-bold rounded-2xl">
                Mesajın başarıyla bize ulaştı. En kısa sürede döneceğiz! 🚀
              </div>
            )}
            {status === "error" && (
              <div className="mb-6 p-4 bg-red-600 text-white font-bold rounded-2xl">
                Bir hata oluştu, lütfen daha sonra tekrar dene.
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block font-bold mb-2 ml-2">
                  Adın Soyadın
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-black focus:outline-none transition-colors font-medium"
                  placeholder="Ahmet Yılmaz"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 ml-2">
                  E-posta Adresin
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-black focus:outline-none transition-colors font-medium"
                  placeholder="ahmet@example.com"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 ml-2">Mesajın</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-black focus:outline-none transition-colors resize-none font-medium"
                  placeholder="Sana nasıl yardımcı olabiliriz?"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-8 px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Gönderiliyor..." : "Gönder"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Sağ Taraf: İletişim Bilgileri */}
        <div className="flex flex-col justify-center space-y-10">
          {/* Konum */}
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[#fdd207] rounded-2xl rounded-tr-none flex items-center justify-center flex-shrink-0">
              <MapPin className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2 uppercase">Konum</h3>
              <p className="text-gray-800 font-medium text-lg leading-relaxed">
                Kaptanpaşa Mah. Piyalepaşa Bulvarı No.77 <br />
                Famas Plaza B Blok No:71 Şişli / İstanbul
              </p>
            </div>
          </div>

          {/* Telefon */}
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[#fdd207] rounded-2xl rounded-tr-none flex items-center justify-center flex-shrink-0">
              <Phone className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2 uppercase">Telefon</h3>
              <p className="text-gray-800 font-medium text-lg">
                <a
                  href="tel:+905334300289"
                  className="hover:text-[#fdd207] hover:underline transition-colors"
                >
                  0533 430 02 89
                </a>
              </p>
              <p className="text-gray-800 font-medium text-lg mt-1">
                <a
                  href="tel:+902122810212"
                  className="hover:text-[#fdd207] hover:underline transition-colors"
                >
                  (0212) 281 02 12
                </a>
              </p>
            </div>
          </div>

          {/* E-posta */}
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[#fdd207] rounded-2xl rounded-tr-none flex items-center justify-center flex-shrink-0">
              <Mail className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2 uppercase">E-posta</h3>
              <p className="text-gray-800 font-medium text-lg">
                <a
                  href="mailto:info@englishpoint.com.tr"
                  className="hover:text-[#fdd207] hover:underline transition-colors"
                >
                  info@englishpoint.com.tr
                </a>
              </p>
            </div>
          </div>

          {/* Sitenin alt kısmındaki siyah baloncuk detayı */}
          <div className="mt-4 p-6 bg-black text-white rounded-[2rem] rounded-br-none inline-block self-start relative">
            <p className="font-bold text-lg text-[#fdd207] mb-1">
              Desteğe mi ihtiyacın var?
            </p>
            <p className="font-medium text-gray-300">
              Biz her zaman buradayız, çekinme yaz!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
