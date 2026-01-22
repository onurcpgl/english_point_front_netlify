"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import generalService from "../../../utils/axios/generalService";
import LoadingSimple from "../../../components/loading/LoadingSimple";

// Senin gönderdiğin Modallar
import ErrorModal from "../../../components/ui/ErrorModal/ErrorModal";
import SuccesMessageComp from "../../../components/ui/SuccesModal/SuccesMessageComp";

export default function SurveyPage() {
  const { id: educationId } = useParams();
  const router = useRouter();
  const { status } = useSession();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  // Modal States
  const [successModal, setSuccessModal] = useState({
    open: false,
    message: "",
  });
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/survey/${educationId}`);
      return;
    }

    const fetchQuestions = async () => {
      try {
        const res = await generalService.getSurveyQuestions(educationId);

        if (res.status) {
          setQuestions(res.data);
        } else {
          // EĞER DAHA ÖNCE DOLDURMUŞSA
          if (res.already_submitted) {
            setIsRedirect(true); // Yönlendirme modunu aç
          }
          setErrorModal({ open: true, message: res.message });
        }
      } catch (err) {
        setErrorModal({
          open: true,
          message: "Sorular yüklenirken bir ağ hatası oluştu.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [status, educationId, router]);
  const handleOptionChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };
  const handleErrorModalClose = () => {
    setErrorModal({ open: false, message: "" });

    // Eğer yönlendirme gerekiyorsa ana sayfaya gönder
    if (isRedirect) {
      router.push("/");
      // Veya pencereyi kapatmak istersen: window.close(); (Sadece scriptle açılan pencerelerde çalışır)
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(answers).length !== questions.length) {
      setErrorModal({
        open: true,
        message: "Lütfen tüm soruları cevaplayınız.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = { education_id: educationId, answers: answers };
      const res = await generalService.postSurveyAnswers(payload);

      if (res.status === true) {
        setSuccessModal({ open: true, message: res.message });
      } else {
        setErrorModal({ open: true, message: res.message });
      }
    } catch (error) {
      setErrorModal({
        open: true,
        message: "Sunucu bağlantısında bir sorun oluştu.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Başarı modalı kapandığında dashboard'a yönlendir
  const handleSuccessClose = () => {
    setSuccessModal({ open: false, message: "" });
    router.push("/");
  };

  if (status === "loading" || loading) return <LoadingSimple />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Senin Modalların */}
        <SuccesMessageComp
          open={successModal.open}
          message={successModal.message}
          onClose={handleSuccessClose}
        />
        <ErrorModal
          open={errorModal.open}
          message={errorModal.message}
          onClose={handleErrorModalClose} // Güncellenmiş fonksiyon
        />

        {/* Başlık Kartı */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-[#FFD207] rounded-3xl flex items-center justify-center shadow-inner">
            <ClipboardCheck size={40} className="text-black" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-black tracking-tight">
              Eğitim Değerlendirme
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Görüşleriniz bizim için değerli, lütfen formu eksiksiz doldurunuz.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 transition-all hover:border-[#FFD207]"
            >
              <div className="flex items-start gap-4 mb-6">
                <span className="bg-[#FFD207] text-black font-black w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  {index + 1}
                </span>
                <p className="font-bold text-gray-900 text-xl leading-snug">
                  {q.question_text}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["a", "b", "c", "d"].map((opt) => (
                  <label
                    key={opt}
                    className={`group relative flex items-center p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${answers[q.id] === opt ? "bg-[#FFD207] border-[#FFD207] text-black shadow-md" : "bg-gray-50 border-transparent hover:border-gray-200 text-gray-700"}`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      className="hidden"
                      onChange={() => handleOptionChange(q.id, opt)}
                    />
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${answers[q.id] === opt ? "border-black bg-black" : "border-gray-300 bg-white"}`}
                    >
                      {answers[q.id] === opt && (
                        <div className="w-2 h-2 bg-[#FFD207] rounded-full" />
                      )}
                    </div>
                    <span className="font-bold uppercase mr-2">{opt})</span>
                    <span className="font-medium">{q[`option_${opt}`]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${submitting ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-[#FFD207] hover:text-black"}`}
            >
              {submitting ? "Gönderiliyor..." : "Değerlendirmeyi Tamamla"}
              {!submitting && <ArrowRight size={24} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
