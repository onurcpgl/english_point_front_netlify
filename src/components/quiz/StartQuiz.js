"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import generalService from "../../utils/axios/generalService";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../loading/Loading";
// import Loading from "../loading/Loading";
import { useRouter } from "next/navigation";
import Image from "next/image";

const loadingMessages = [
  "Sizin için en uygun eğitmenleri buluyoruz...",
  "İhtiyaçlarınıza göre analiz yapılıyor...",
  "Uygun dil seviyeniz belirleniyor...",
  "Eğitmen eşleştirme tamamlanmak üzere...",
];

export default function Quiz() {
  const { data: session, status } = useSession();

  const { data, error, isLoading } = useQuery({
    queryKey: ["startQuestions"],
    queryFn: generalService.fetchQuestions,
  });
  const router = useRouter();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [started, setStarted] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  const handleNext = async () => {
    if (selectedOption == null) return;

    const newAnswers = [
      ...answers,
      { question: data[currentQuestion].question, answers: selectedOption },
    ];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion + 1 < data.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setFinished(true);
      //Bu veriyi kayıt edicez
      const uniq_id = await saveAnswersHandler(newAnswers);
      if (uniq_id) localStorage.setItem("uniq_id", uniq_id);

      //Kullanıcı varsa eğitim sayfasına yoksa giriş yap sayfasına git
      if (status == "unauthenticated") {
        setTimeout(() => {
          router.push(`/login?callbackUrl=/course-sessions`);
        }, 2000);
      } else {
        router.push(`/course-sessions`);
      }
    }
  };

  const saveAnswersHandler = async (answers) => {
    const response = await generalService.saveAnswers(answers);
    return response.response;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) =>
        prev + 1 < loadingMessages.length ? prev + 1 : 0
      );
    }, 2000);

    const timeout = setTimeout(() => {
      // 8 saniye sonra login ekranına geç
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (error) return <div>Hata: {error.message}</div>;

  return (
    data && (
      <>
        {/* Ana Uygulama Container */}
        {/* Responsive: Mobilde flex-col (alt alta), Masaüstünde flex-row (yan yana) */}
        <div className="min-h-screen w-full flex flex-col lg:flex-row transition-all duration-1000">
          {/* Sol taraf (Mobilde Üst) - Resim Bölümü */}
          {/* Responsive: Mobilde yükseklik 30vh veya 300px, Masaüstünde full. Genişlik mobilde full, masaüstünde yarım. */}
          <div className="w-full h-[30vh] lg:h-auto lg:w-1/2 relative overflow-hidden bg-white flex justify-center items-center p-4 lg:p-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={data?.[currentQuestion].banner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full h-full flex justify-center items-center"
              >
                <Image
                  width={500}
                  height={500}
                  src={data?.[currentQuestion].banner}
                  alt={data?.[currentQuestion].question}
                  className="rounded-xl object-contain h-full w-auto max-h-full "
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sağ taraf (Mobilde Alt) - İçerik Bölümü */}
          {/* Responsive: Mobilde min-h 70vh, arka plan sarı devam ediyor */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FFD207] min-h-[70vh] lg:min-h-screen">
            <div className="w-full max-w-2xl px-6 py-8 lg:px-12">
              {/* Soru Ekranı */}
              {started && !finished && (
                // Mobilde margin-top değerini düşürdük (mt-5), masaüstünde mt-20 korundu
                <div className="mt-5 lg:mt-20 mb-10">
                  {/* Progress Header (Hidden idi, logic korundu) */}
                  <div className="items-center justify-between mb-8 hidden">
                    <div className="text-sm font-medium text-black px-3 py-1 rounded-full">
                      SORU {currentQuestion + 1} / {data.length}
                    </div>
                    {/* ... progress dots ... */}
                  </div>

                  {/* Soru Başlığı */}
                  {/* Responsive: Mobilde text-2xl, Masaüstünde text-3xl */}
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 lg:mb-8 leading-tight text-center lg:text-left">
                    {data?.[currentQuestion].question}
                  </h2>

                  {/* Seçenekler */}
                  <div className="my-5">
                    {data?.[currentQuestion]?.question_type === "single" ? (
                      <div className="space-y-3">
                        {JSON.parse(data[currentQuestion].options).map(
                          (option, index) => {
                            const isSelected = selectedOption === option;
                            return (
                              <div
                                key={index}
                                className={`group relative text-base lg:text-lg px-5 py-3 lg:py-4 rounded-4xl cursor-pointer transition-all duration-200 border-2 border-transparent ${
                                  isSelected
                                    ? "shadow-lg bg-black scale-[1.01] lg:scale-[1.02] text-white"
                                    : "shadow-md bg-white hover:scale-[1.01] lg:hover:scale-[1.02] text-black"
                                }`}
                                onClick={() => setSelectedOption(option)}
                              >
                                {option}
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      // Multiple Choice
                      <div className="space-y-3 flex flex-wrap justify-center items-center gap-2 lg:gap-3 p-2 lg:p-4 rounded-xl">
                        {JSON.parse(data[currentQuestion].options).map(
                          (option, index) => {
                            const selectedArray = selectedOption || [];
                            const isSelected = selectedArray.includes(option);

                            return (
                              <div
                                key={index}
                                className={`group relative text-base lg:text-lg px-4 lg:px-5 py-2 lg:py-3 rounded-4xl cursor-pointer transition-all duration-200 ${
                                  isSelected
                                    ? "shadow-lg bg-black scale-[1.02] text-white"
                                    : "shadow-md bg-white scale-[1.02] text-black"
                                }`}
                                onClick={() => {
                                  if (!selectedOption)
                                    setSelectedOption([option]);
                                  else if (selectedArray.includes(option)) {
                                    setSelectedOption(
                                      selectedArray.filter((o) => o !== option)
                                    );
                                  } else {
                                    setSelectedOption([
                                      ...selectedArray,
                                      option,
                                    ]);
                                  }
                                }}
                              >
                                {option}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer Action Area */}
                  {/* Responsive: Mobilde flex-col-reverse (buton üstte olsun istersen) veya flex-col.
                      Burada yan yana (row) tuttum ama mobilde sıkışırsa wrap ekledim. */}
                  <div className="flex flex-col-reverse gap-4 sm:flex-row justify-between items-center mt-8">
                    <div className="text-sm text-black opacity-70 sm:opacity-100">
                      💡 Bir seçenek işaretleyip devam edin
                    </div>
                    <button
                      onClick={handleNext}
                      disabled={selectedOption == null}
                      // Mobilde buton tam genişlik (w-full), masaüstünde w-auto
                      className={`w-full sm:w-auto group relative px-8 py-3 rounded-4xl text-lg font-semibold transition-all duration-200 justify-center ${
                        selectedOption != null
                          ? "bg-black text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                          : "bg-gray-800 text-white/50 cursor-not-allowed"
                      }`}
                    >
                      <span className="flex items-center justify-center">
                        {currentQuestion < data.length - 1
                          ? "Devam Et!"
                          : "Bitir"}
                        <span
                          className={`ml-2 transform transition-transform ${
                            selectedOption != null
                              ? "group-hover:translate-x-1"
                              : ""
                          }`}
                        >
                          →
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Bitiş Ekranı (Loading Overlay) */}
              {finished && <Loading />}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scale-in {
            from {
              transform: scale(0);
            }
            to {
              transform: scale(1);
            }
          }
          .animate-scale-in {
            animation: scale-in 0.2s ease-out;
          }
        `}</style>
      </>
    )
  );
}
