"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter, useSearchParams } from "next/navigation"; // URL parametrelerini okumak için eklendi
import generalService from "../../utils/axios/generalService";
import ErrorModal from "../ui/ErrorModal/ErrorModal";
import PaymentSucces from "../../assets/payment/payment-success.png";
import {
  ShoppingCart,
  Trash2,
  MousePointerClick,
  CreditCard,
  Check,
  ChevronRight,
  Clock,
  Users,
  BookOpen,
} from "lucide-react";
import Image from "next/image";

const SepetComp = () => {
  const { sessions, removeSession, clearCart, loading } = useCart();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingSendBtn, setLoadingSendBtn] = useState(false);
  const [sozlesmeChecked, setSozlesmeChecked] = useState(false);

  // URL Parametrelerini ve Router'ı al
  const searchParams = useSearchParams();
  const router = useRouter();

  // Adım Yönetimi (sepet -> odeme -> basarili)
  const [currentStep, setCurrentStep] = useState("sepet");

  // Sabit Değerler (Dinamik hale getirilebilir)
  const toplamFiyat = 249;
  const toplamIndirim = 250; // Örnek indirim
  const USER_ERRORS = {
    // Kart Bilgileri
    2029: "Kart numarası geçersiz. Lütfen kontrol edin.",
    "0014": "Kart numarası hatalı.",
    1051: "Kart numarası hatalı.",
    1052: "Son kullanma tarihi geçersiz.",
    2030: "Son kullanma tarihi hatalı.",
    "0312": "Güvenlik kodu (CVV) hatalı.",
    1050: "CVV kodu hatalı.",
    "0054": "Kartınızın süresi dolmuş.",

    // Bakiye & Limit
    "0051": "Kart bakiyeniz bu işlem için yetersiz.",
    "0315": "Sanal kart limitiniz yetersiz.",

    // Banka Yetki
    "0093": "Kartınız internet alışverişine kapalıdır.",
    "0057": "Kartınız bu işlem tipine kapalıdır.",
    "0570": "Kartınız yurt dışı işlemlerine kapalıdır.",
    "0005": "İşlem bankanız tarafından reddedildi.",

    // 3D Secure
    400: "3D Secure onayı alınamadı. Lütfen şifrenizi kontrol edin.",
    "0400": "3D Secure şifresi hatalı.",
    20: "Kartınız 3D Secure desteklememektedir.",
  };

  // Hata yönetim fonksiyonun
  const getFriendlyMessage = (errorCode) => {
    // Eğer hata kodu bizim listemizde varsa kullanıcıya özel mesajı göster
    if (USER_ERRORS[errorCode]) {
      return USER_ERRORS[errorCode];
    }

    // Eğer hata kodu listede yoksa (Teknik bir hataysa: IP, tutar, XML vb.)
    // Kullanıcıya teknik detay verme, genel bir mesaj göster.
    return "İşleminiz şu an gerçekleştirilemiyor. Lütfen birazdan tekrar deneyin.";
  };

  useEffect(() => {
    const handleMessage = (event) => {
      // Güvenlik: Sadece kendi domaininizden gelen mesajları kabul edin
      // if (event.origin !== window.location.origin) return;

      if (event.data && event.data.type === "PAYMENT_RESULT") {
        if (event.data.status === "success") {
          // Ödeme Başarılı
          setCurrentStep("basarili");
          clearCart();
        } else if (event.data.status === "error") {
          // Ödeme Hatalı
          setErrorMessage(event.data.msg || "Ödeme işlemi başarısız oldu.");
          setErrorModalOpen(true);
          setLoadingSendBtn(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [clearCart]);

  // ============================================================
  // 1. URL KONTROLÜ (BANKADAN DÖNÜŞ İÇİN)
  // ============================================================
  useEffect(() => {
    const status = searchParams.get("payment_status");
    const msg = searchParams.get("msg");

    if (status === "success") {
      // Ödeme Başarılıysa
      setCurrentStep("basarili");
      clearCart(); // Sepeti temizle (Context)
      // URL'i temizle ki F5 atınca tekrar işlem yapmaya çalışmasın
      router.replace(window.location.pathname);
    } else if (status === "error") {
      // Ödeme Başarısızsa
      setErrorMessage(
        decodeURIComponent(msg) || "Ödeme işlemi başarısız oldu.",
      );
      setErrorModalOpen(true);
      setLoadingSendBtn(false);
      // Hata durumunda da URL'i temizle
      router.replace(window.location.pathname);
    }
  }, [searchParams, clearCart, router]);

  // ============================================================
  // 2. SEPET FONKSİYONLARI
  // ============================================================
  const handleRemoveClick = () => setShowConfirm(true);

  const handleConfirmYes = async () => {
    try {
      if (sessions?.basket?.id) {
        await removeSession(sessions.basket.id);
      }
      setShowConfirm(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmNo = () => setShowConfirm(false);

  // ============================================================
  // 3. ÖDEME FORMU İŞLEMLERİ
  // ============================================================
  const [odemeForm, setOdemeForm] = useState({
    kartNo: "",
    kartIsim: "",
    sonKullanma: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "kartNo") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setOdemeForm({ ...odemeForm, [name]: formatted.slice(0, 19) });
    } else if (name === "sonKullanma") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2");
      setOdemeForm({ ...odemeForm, [name]: formatted.slice(0, 5) });
    } else if (name === "cvv") {
      setOdemeForm({
        ...odemeForm,
        [name]: value.replace(/\D/g, "").slice(0, 3),
      });
    } else {
      setOdemeForm({ ...odemeForm, [name]: value });
    }
  };

  // ============================================================
  // 4. ÖDEMEYİ BAŞLATMA (VAKIFBANK ENTEGRASYONU)
  // ============================================================
  const odemeYap = async () => {
    setLoadingSendBtn(true);

    if (sozlesmeChecked === false) {
      setErrorMessage("Lütfen hizmet sözleşmesini kabul ediniz.");
      setErrorModalOpen(true);
      setLoadingSendBtn(false);
      return;
    }
    try {
      // 1. Tarih Formatını Ayıkla (AA/YY formatından)
      const [month, year] = odemeForm.sonKullanma.split("/");

      if (!month || !year || month > 12 || month < 1) {
        setErrorMessage(
          "Lütfen geçerli bir son kullanma tarihi giriniz (AA/YY).",
        );
        setErrorModalOpen(true);
        setLoadingSendBtn(false);
        return;
      }

      // 2. Backend'e gidecek veri paketini hazırla
      const paymentPayload = {
        basket_id: sessions.basket.id,
        card_holder: odemeForm.kartIsim,
        card_number: odemeForm.kartNo.replace(/\s/g, ""), // Boşlukları temizle
        expiry_month: month,
        expiry_year: "20" + year, // 25 -> 2025 yapar
        cvv: odemeForm.cvv,
        amount: "1.00", // KRİTİK: 'Invalid Amount' hatasını önlemek için
      };

      // 3. Backend'den 3D bilgilerini iste
      const result = await generalService.initPayment(paymentPayload);

      // 4. Hata Kontrolü
      if (result.status === "error" || result.error) {
        // Teknik mesaj yerine çevrilmiş mesajı gösteriyoruz
        const userMessage = getFriendlyMessage(result.error_code);
        setErrorMessage(userMessage);

        setErrorModalOpen(true);
        setLoadingSendBtn(false);
        return; // Akışı burada kesiyoruz
      }
      const { url, fields } = result;

      if (!url) {
        setErrorMessage("Banka yönlendirme adresi alınamadı (URL undefined).");
        setErrorModalOpen(true);
        setLoadingSendBtn(false);
        return;
      }

      // --- POP-UP PENCERE AYARLARI ---
      const width = 600;
      const height = 700;
      // Pencereyi ekranın tam ortasına konumlandır
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popupName = "Vakifbank3DSecureWindow";

      // Boş bir pencere aç
      const popup = window.open(
        "about:blank",
        popupName,
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
      );

      // --- DİNAMİK FORM OLUŞTURMA VE POST ETME ---
      const form = document.createElement("form");
      form.method = "POST";
      form.action = url;
      form.target = "_self"; // KRİTİK: Formu az önce açtığımız pop-up ismine gönderiyoruz

      // PaReq, TermUrl ve MD alanlarını formun içine göm
      Object.keys(fields).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit(); // Formu gönder ve pop-up'ı banka sayfasına yönlendir
      document.body.removeChild(form); // İşi biten formu DOM'dan temizle

      // Buton loading durumunu kapat
      setLoadingSendBtn(false);
    } catch (e) {
      // Axios hatasından (400) gelen data içindeki hata kodunu alıyoruz
      const errorResponse = e.response?.data;

      let userFriendlyMsg =
        "Sunucuyla bağlantı kurulamadı. Lütfen tekrar deneyin.";

      if (errorResponse) {
        // Eğer bankadan gelen teknik bir hata verisi varsa çeviriyoruz
        userFriendlyMsg = getFriendlyMessage(errorResponse.error_code);
      }

      setErrorMessage(userFriendlyMsg);
      setErrorModalOpen(true);
      setLoadingSendBtn(false);
    }
  };

  // Yardımcı Fonksiyonlar
  function getDate(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("tr-TR");
  }

  // ============================================================
  // 5. RENDER (GÖRÜNÜM)
  // ============================================================

  // --- BAŞARI EKRANI ---
  if (currentStep === "basarili") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ödeme Başarılı!
          </h1>
          <div className="flex justify-center items-center">
            <Image
              width={250}
              height={250}
              src={PaymentSucces}
              alt="EnglishPoint Payment Success"
            />
          </div>

          <p className="text-gray-700 mb-8">
            Eğitimleriniz hesabınıza başarıyla eklendi! Keyifli bir başlangıç
            için, eğitimin yapılacağı kafeye 15 dakika önceden gelmenizi
            öneririz.
          </p>

          <button
            onClick={() => router.push("/account/my-educations")}
            className="mt-8 w-full bg-black text-white py-4 px-6 font-semibold flex justify-center items-center gap-2 border-2 border-transparent 
            transition-all duration-300 cursor-pointer hover:bg-white hover:text-black hover:border-black 
            focus:bg-white focus:text-black focus:border-black focus:ring-4"
          >
            Eğitimlerime Git
          </button>
        </div>
      </div>
    );
  }

  // --- LOADING EKRANI ---
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 animate-pulse h-24"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>

          <div className="lg:col-span-1">
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <ErrorModal
          open={errorModalOpen}
          message={errorMessage}
          onClose={() => setErrorModalOpen(false)}
        />

        {/* HEADER & STEPS */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-black" />
              Sepetim
            </h1>
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 ${
                  currentStep === "sepet" ? "text-black" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === "sepet"
                      ? "bg-[#ffd103] text-black"
                      : "bg-gray-200"
                  }`}
                >
                  1
                </div>
                <span className="font-medium">Sepet</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
              <div
                className={`flex items-center gap-2 ${
                  currentStep === "odeme" ? "text-black" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === "odeme"
                      ? "bg-[#ffd103] text-white"
                      : "bg-gray-200"
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Ödeme</span>
              </div>
            </div>
          </div>
        </div>

        {/* SİLME ONAY MODALI */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black opacity-20 w-full h-full z-20 absolute" />
            <div className="bg-white rounded-xl p-6 w-80 shadow-lg z-50">
              <h3 className="text-black font-semibold text-lg mb-4">
                Sepetinizi silmek istediğinize emin misiniz?
              </h3>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleConfirmNo}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Hayır
                </button>
                <button
                  onClick={handleConfirmYes}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Evet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* İÇERİK ALANI */}
        {currentStep === "sepet" ? (
          // --- ADIM 1: SEPET LİSTELEME ---
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {sessions?.basket ? (
                <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex gap-6">
                    <Image
                      width={50}
                      height={50}
                      src={sessions?.basket.course_session.cafe.image}
                      alt={sessions?.basket.course_session.cafe.name}
                      className="w-48 h-32 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {sessions.basket.course_session.session_title}
                          </h3>
                          <p className="text-gray-800 mb-3">
                            Eğitmen:{" "}
                            {
                              sessions.basket.course_session.instructor
                                .first_name
                            }{" "}
                            {
                              sessions.basket.course_session.instructor
                                .last_name
                            }
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />{" "}
                              {getDate(
                                sessions.basket.course_session.session_date,
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />{" "}
                              {sessions.basket.course_session.quota} öğrenci
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveClick}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-black">
                            ₺{toplamFiyat}
                          </span>
                          {/* İndirim Görseli - Opsiyonel */}
                          <span className="text-gray-400 line-through">
                            ₺{toplamFiyat + toplamIndirim}
                          </span>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-semibold">
                            %50 İndirim
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Sepetiniz Boş
                  </h3>

                  <button
                    onClick={() => router.push("/course-sessions")}
                    className="mt-4 text-gray-600 cursor-pointer font-semibold hover:underline group relative inline-flex items-center"
                  >
                    Eğitimleri Keşfet
                    {/* Bounce Efektli Tıklama İkonu */}
                    <div className="absolute -right-6 -bottom-2 animate-bounce">
                      <MousePointerClick className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Sepet Özeti */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
                {sessions?.basket ? (
                  <>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                      Sipariş Özeti
                    </h2>
                    <div className="space-y-3 mb-6">
                      {/* İndirimsiz Ham Fiyat */}
                      <div className="flex justify-between">
                        <span className="text-gray-700">Ara Toplam</span>
                        <span className="font-semibold text-gray-700">
                          ₺{(toplamFiyat + toplamIndirim).toFixed(2)}
                        </span>
                      </div>

                      {/* Uygulanan İndirim */}
                      <div className="flex justify-between text-green-600">
                        <span>İndirim</span>
                        <span className="font-semibold">
                          -₺{toplamIndirim.toFixed(2)}
                        </span>
                      </div>

                      {/* KDV Satırı (%20) */}
                      <div className="flex justify-between text-gray-700">
                        <span>KDV (%20)</span>
                        <span className="font-semibold">
                          ₺{(toplamFiyat * 0.2).toFixed(2)}
                        </span>
                      </div>

                      {/* KDV Dahil Genel Toplam */}
                      <div className="border-t pt-3 flex justify-between">
                        <span className="text-lg font-semibold text-black">
                          Genel Toplam
                        </span>
                        <span className="text-2xl font-bold text-black">
                          ₺{(toplamFiyat * 1.2).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentStep("odeme")}
                      className="w-full bg-black text-white py-4 px-6 font-semibold flex justify-center items-center gap-2 hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-all"
                    >
                      <CreditCard className="w-5 h-5" /> Ödemeye Geç
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/course-sessions")}
                    className="w-full bg-black text-white py-4 px-6 font-semibold flex justify-center items-center gap-2"
                  >
                    <BookOpen className="w-5 h-5 mr-2" /> Eğitimlere Git
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          // --- ADIM 2: ÖDEME FORMU ---
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Ödeme Bilgileri
                </h2>

                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Kart Bilgileri
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Numarası
                        </label>
                        <input
                          type="text"
                          name="kartNo"
                          value={odemeForm.kartNo}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-4 py-3 border text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Üzerindeki İsim
                        </label>
                        <input
                          type="text"
                          name="kartIsim"
                          value={odemeForm.kartIsim}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border uppercase text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Son Kullanma (AA/YY)
                          </label>
                          <input
                            type="text"
                            name="sonKullanma"
                            value={odemeForm.sonKullanma}
                            onChange={handleInputChange}
                            placeholder="AA/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 border text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={odemeForm.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength={3}
                            className="w-full px-4 py-3 border text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sozlesme"
                      required
                      // 1. State'i checkbox'a bağladık
                      checked={sozlesmeChecked}
                      // 2. Tıklandığında true/false olarak güncellemesini sağladık
                      onChange={(e) => setSozlesmeChecked(e.target.checked)}
                      className="w-4 h-4 text-black rounded cursor-pointer"
                    />

                    <label
                      htmlFor="sozlesme" // Checkbox id'si ile aynı olmalı
                      className="text-sm text-gray-600 select-none cursor-pointer"
                    >
                      <a
                        href="/kullanici-sozlesmesi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black underline cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Kullanım koşullarını
                      </a>{" "}
                      ve{" "}
                      <a
                        href="/kvkk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black underline cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        gizlilik politikasını
                      </a>{" "}
                      kabul ediyorum.
                    </label>
                  </div>

                  {/* ÖDEMEYİ TAMAMLA BUTONU */}
                  <button
                    onClick={odemeYap}
                    disabled={loadingSendBtn}
                    className={`w-full py-4 px-6 font-semibold flex justify-center items-center gap-2 border-2 border-transparent transition-all duration-300 cursor-pointer
                      ${
                        loadingSendBtn
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                          : "bg-black text-white hover:bg-white hover:text-black hover:border-black"
                      }`}
                  >
                    {loadingSendBtn ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Güvenli Ödeme Yap (3D Secure)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Ödeme Özeti */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Ödenecek Tutar
                </h3>

                {/* Sepet küçük önizleme */}
                {sessions?.basket && (
                  <div className="flex items-start gap-3 pb-3 border-b mb-4">
                    <Image
                      width={50}
                      height={50}
                      src={sessions.basket.course_session.cafe.image}
                      alt="Kurs"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                        {sessions.basket.course_session.session_title}
                      </h4>
                      <span className="text-sm font-bold text-black">
                        ₺{toplamFiyat}
                      </span>
                    </div>
                  </div>
                )}
                <div className="space-y-2 mb-4">
                  {/* İndirimsiz Tutar */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-800">Ara Toplam</span>
                    <span className="text-gray-800">
                      ₺{(toplamFiyat + toplamIndirim).toFixed(2)}
                    </span>
                  </div>

                  {/* Uygulanan İndirim */}
                  <div className="flex justify-between text-sm text-green-600">
                    <span>İndirim</span>
                    <span>-₺{toplamIndirim.toFixed(2)}</span>
                  </div>

                  {/* KDV Satırı (%20) */}
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>KDV (%20)</span>
                    <span>₺{(toplamFiyat * 0.2).toFixed(2)}</span>
                  </div>

                  {/* KDV Dahil Genel Toplam */}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Toplam</span>
                    <span className="text-xl font-bold text-black">
                      ₺{(toplamFiyat * 1.2).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep("sepet")}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Bilgileri Düzenle / Geri Dön
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Check className="w-4 h-4 text-green-500" /> 256-bit SSL
                  güvenli bağlantı
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SepetComp;
