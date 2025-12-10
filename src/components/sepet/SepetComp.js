"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import generalService from "../../utils/axios/generalService";
import ErrorModal from "../ui/ErrorModal/ErrorModal";
import {
  ShoppingCart,
  Trash2,
  CreditCard,
  Check,
  ChevronRight,
  Clock,
  Users,
  Star,
  BookOpen,
} from "lucide-react";
import Image from "next/image";

const SepetComp = () => {
  const { sessions, removeSession, clearCart, loading } = useCart();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingSendBtn, setLoadingSendBtn] = useState(false);

  const handleRemoveClick = () => setShowConfirm(true);
  const handleConfirmYes = async () => {
    try {
      await removeSession(sessions.basket.id); // backend’den gelen basket_id
      setShowConfirm(false);
    } catch (e) {
      console.error(e);
    }
  };
  const handleConfirmNo = () => setShowConfirm(false);
  const [currentStep, setCurrentStep] = useState("sepet");
  const router = useRouter();
  const [odemeForm, setOdemeForm] = useState({
    kartNo: "",
    kartIsim: "",
    sonKullanma: "",
    cvv: "",
    email: "",
    ad: "",
    soyad: "",
    telefon: "",
  });
  const SABIT_FIYAT = 200;
  const toplamFiyat = 200;

  const toplamIndirim = 100;

  function getDate(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("tr-TR"); // "25.08.2025"
  }

  // Saati alma fonksiyonu
  function getTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }); // "14:30"
  }

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

  const odemeYap = async () => {
    setLoadingSendBtn(true);

    try {
      const result = await generalService.updatedBasket(sessions.basket.id);

      if (!result.success) {
        // Hata varsa modalı aç
        setErrorMessage(result.message || "Ödeme işlemi başarısız!");
        setErrorModalOpen(true);
        setLoadingSendBtn(false);
        return;
      }

      // Başarılı ise devam eden işlemler
      setTimeout(() => {
        setCurrentStep("basarili");
        clearCart();
      }, 500);
    } catch (e) {
      setErrorMessage("Sunucu hatası oluştu!");
      setErrorModalOpen(true);
      setLoadingSendBtn(false);
    }
  };

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

          <p className="text-gray-700 mb-8">
            Eğitimleriniz hesabınıza eklendi! Keyifli bir başlangıç için,
            eğitimin yapılacağı kafeye 15 dakika önceden gelmenizi öneririz.
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
  if (loading) {
    // Skeleton veya loading placeholder göster
    return (
      <div className="container mx-auto py-8">
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
                      ? "bg-[#ffd103]  text-black"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-4">
              <div className="animate-pulse flex flex-col sm:flex-row gap-6 bg-white rounded-2xl p-6">
                <div className="w-full h-48 sm:w-48 sm:h-32 bg-gray-200 rounded-xl shrink-0"></div>

                {/* Yazı Alanı */}
                <div className="flex-1 space-y-4 py-1 w-full">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="space-y-4 mb-6 p-4 border border-gray-100 rounded-2xl">
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-full animate-pulse mt-4"></div>
              <div className="h-6 bg-gray-200 rounded w-full animate-pulse mt-2"></div>
              <div className="h-12 bg-gray-200 rounded w-full animate-pulse mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    !loading && (
      <div className="min-h-screen  py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorModal
            open={errorModalOpen}
            message={errorMessage}
            onClose={() => setErrorModalOpen(false)}
          />
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 ">
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
                        ? "bg-[#ffd103]  text-black"
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
          {showConfirm && (
            <div className="fixed inset-0  flex items-center justify-center z-50">
              <div className="bg-black opacity-20 w-full h-full z-20 absolute " />
              <div className="bg-white rounded-xl p-6 w-80 shadow-lg z-50">
                <h3 className="text-black font-semibold text-lg mb-4">
                  Sepetinizi silmek istediğinize emin misiniz?
                </h3>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleConfirmNo}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Hayır
                  </button>
                  <button
                    onClick={handleConfirmYes}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                  >
                    Evet
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === "sepet" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sol Taraf - Sepet Öğeleri */}
              <div className="lg:col-span-2 space-y-4">
                {sessions?.basket !== null ? (
                  <div
                    key={sessions.basket.course_session.id}
                    className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300"
                  >
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
                                <Clock className="w-4 h-4" />
                                {getDate(
                                  sessions.basket.course_session.session_date
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
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
                            {/* Sabit fiyat */}
                            <span className="text-2xl font-bold text-black">
                              ₺200
                            </span>

                            {/* Eski fiyat */}
                            <span className="text-gray-400 line-through">
                              ₺250
                            </span>

                            {/* İndirim yüzdesi otomatik */}
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-semibold">
                              %{Math.round(((250 - 200) / 250) * 100)} İndirim
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
                    <p className="text-gray-500">
                      Eğitimleri keşfedin ve öğrenmeye başlayın!
                    </p>
                  </div>
                )}
              </div>

              {/* Sağ Taraf - Özet */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
                  {sessions.basket !== null ? (
                    <>
                      <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Sipariş Özeti
                      </h2>

                      <div className="space-y-3 mb-6">
                        {/* Sabit değerler */}
                        {(() => {
                          const eskiFiyat = 250;
                          const yeniFiyat = 200;
                          const indirim = eskiFiyat - yeniFiyat;
                          const indirimOrani = Math.round(
                            (indirim / eskiFiyat) * 100
                          );

                          return (
                            <>
                              {/* Ara Toplam */}
                              <div className="flex justify-between">
                                <span className="text-gray-700">
                                  Ara Toplam
                                </span>
                                <span className="font-semibold text-gray-700">
                                  ₺{eskiFiyat.toFixed(2)}
                                </span>
                              </div>

                              {/* İndirim */}
                              <div className="flex justify-between text-green-600">
                                <span>İndirim (%{indirimOrani})</span>
                                <span className="font-semibold">
                                  -₺{indirim.toFixed(2)}
                                </span>
                              </div>

                              {/* Toplam */}
                              <div className="border-t pt-3 flex justify-between">
                                <span className="text-lg font-semibold text-black">
                                  Toplam
                                </span>
                                <span className="text-2xl font-bold text-black">
                                  ₺{yeniFiyat.toFixed(2)}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      <button
                        onClick={() => setCurrentStep("odeme")}
                        className="w-full bg-black text-white py-4 px-6 font-semibold flex justify-center items-center group 
             border-2 border-transparent transition-all duration-300 cursor-pointer 
             hover:bg-white hover:text-black hover:border-black 
             focus:bg-white focus:text-black focus:border-black focus:ring-4"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Ödemeye Geç
                      </button>

                      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-blue-800 flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          30 gün içinde koşulsuz iade garantisi
                        </p>
                        <p className="text-sm text-blue-800 flex items-start gap-2 mt-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          Ömür boyu erişim hakkı
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                      <p className="text-gray-500 mb-2">
                        Sepetinizde eğitim bulunmuyor!
                      </p>
                      <p className="text-gray-500 mb-6">
                        Eğitimleri görüntülemek için tıklayınız
                      </p>

                      <button
                        onClick={() => router.push("/course-sessions")} // istediğin eğitim sayfasına yönlendir
                        className="w-full bg-black text-white py-4 px-6 font-semibold flex justify-center items-center gap-2 border-2 border-transparent 
      transition-all duration-300 cursor-pointer hover:bg-white hover:text-black hover:border-black 
      focus:bg-white focus:text-black focus:border-black focus:ring-4"
                      >
                        {/* İkon isteğe bağlı */}
                        <BookOpen className="w-5 h-5 mr-2" />
                        Eğitimlere Git
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sol Taraf - Ödeme Formu */}
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
                            className="w-full px-4 py-3 border text-black placeholder:text-gray-500 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300  focus:border-transparent"
                            required
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
                            className="w-full px-4 py-3 border text-black placeholder:text-gray-500 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Son Kullanma
                            </label>
                            <input
                              type="text"
                              name="sonKullanma"
                              value={odemeForm.sonKullanma}
                              onChange={handleInputChange}
                              placeholder="AA/YY"
                              className="w-full px-4 py-3 border text-black placeholder:text-gray-500 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                              required
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
                              className="w-full px-4 py-3 border text-black placeholder:text-gray-500 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                              required
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
                        className="w-4 h-4 text-black rounded"
                      />
                      <label
                        htmlFor="sozlesme"
                        className="text-sm text-gray-600"
                      >
                        <span className="text-black underline cursor-pointer">
                          Kullanım koşullarını
                        </span>{" "}
                        ve{" "}
                        <span className="text-black underline cursor-pointer">
                          gizlilik politikasını
                        </span>{" "}
                        kabul ediyorum.
                      </label>
                    </div>

                    <button
                      onClick={odemeYap}
                      disabled={loadingSendBtn} // loading sırasında tıklanmasın
                      className={`w-full py-4 px-6 font-semibold flex justify-center items-center gap-2 border-2 border-transparent transition-all duration-300 cursor-pointer
    ${
      loadingSendBtn
        ? "bg-gray-300 text-gray-700 cursor-not-allowed"
        : "bg-black text-white hover:bg-white hover:text-black hover:border-black focus:bg-white focus:text-black focus:border-black focus:ring-4"
    }`}
                    >
                      {loadingSendBtn ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Ödemeyi Tamamla
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sağ Taraf - Sepet Özeti */}

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Sepet Özeti
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div
                      key={sessions.basket.course_session.id}
                      className="flex items-start gap-3 pb-3 border-b"
                    >
                      <Image
                        width={50}
                        height={50}
                        src={sessions.basket.course_session.cafe.image}
                        alt={sessions.basket.course_session.session_title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                          {sessions.basket.course_session.baslik}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {sessions.basket.course_session.egitmen}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-black">
                        ₺{sessions.basket.course_session.fiyat}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm ">
                      <span className="text-gray-800">Ara Toplam</span>
                      <span className="text-gray-800">
                        ₺{(toplamFiyat + toplamIndirim).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>İndirim</span>
                      <span>-₺{toplamIndirim.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">Toplam</span>
                      <span className="text-xl font-bold text-black">
                        ₺{toplamFiyat.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep("sepet")}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Sepete Geri Dön
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Check className="w-4 h-4 text-green-500" />
                    256-bit SSL güvenli bağlantı
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default SepetComp;
