import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import { Calendar, Clock, Loader2 } from "lucide-react"; // Loader2 eklendi
import { IoPerson, IoPersonOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import generalService from "../../../utils/axios/generalService";
import Loading from "../../loading/Loading";
import { useCart } from "../../../context/CartContext";
import InstructorProfileCard from "../instructor-profile-card/InstructorProfileCard";
import SessionListSkeleton from "../../../components/ui/LoadingSkeleton/SessionListSkeleton";
import ErrorModal from "../../ui/ErrorModal/ErrorModal";
import SuccesMessageComp from "../../ui/SuccesModal/SuccesMessageComp";
import { echo } from "../../../utils/lib/echo";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import SessionDetailModal from "../sessionDetailModal/SessionDetailModal";
function CourseContentList({ mappedData, loading }) {
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [displaySessions, setDisplaySessions] = useState([]);
  const [quotaData, setQuotaData] = useState([]);
  const [quotaLoading, setQuotaLoading] = useState(true);

  // Butonlarda loading göstermek için tıklanan session'ın ID'sini tutar
  const [processingSessionId, setProcessingSessionId] = useState(null);

  // MODAL STATE'LERİ
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
  });
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    message: "",
  });

  const { addSession } = useCart();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const [sessionDetailCompModal, setSessionDetailCompModal] = useState(false);
  const [sessionDetailData, setSessionDetailData] = useState(null);

  // 1. ADIM: API İSTEĞİ
  useEffect(() => {
    const fetchQuotaInfo = async () => {
      setQuotaLoading(true);
      try {
        const data = await generalService.getCourseSessionQuotaInfo();
        if (data && Array.isArray(data)) {
          setQuotaData(data);
        }
      } catch (error) {
        console.error("Kontejan bilgisi alınamadı:", error);
      } finally {
        setQuotaLoading(false);
      }
    };
    fetchQuotaInfo();
  }, []);

  // 2. ADIM: WEBSOCKET DİNLEME
  useEffect(() => {
    if (!echo) return;
    const channel = echo.channel("course_sessions");
    channel.listen(".quota.updated", (event) => {
      if (event.sessions) {
        setQuotaData((prevQuota) => {
          const newQuota = [...prevQuota];
          event.sessions.forEach((u) => {
            const index = newQuota.findIndex((q) => q.id === u.id);
            if (index > -1) newQuota[index] = u;
            else newQuota.push(u);
          });
          return newQuota;
        });
      }
    });
    return () => {
      echo.leave("course_sessions");
    };
  }, []);

  // 3. ADIM: MERGE İŞLEMİ
  useEffect(() => {
    if (!mappedData) return;
    const mergedData = mappedData.map((session) => {
      const quotaInfo = quotaData.find((q) => q.id === session.id);
      if (quotaInfo) {
        return {
          ...session,
          users_count: quotaInfo.users_count,
          quota: quotaInfo.quota,
        };
      }
      return session;
    });

    setDisplaySessions(mergedData);
  }, [mappedData, quotaData]);

  // Yardımcı Render Fonksiyonları
  const renderQuotaIcons = (usersCount, quota) => {
    const filledCount = usersCount || 0;
    const totalQuota = quota || 0;
    return Array.from({ length: totalQuota }).map((_, index) => {
      if (index < filledCount) {
        return (
          <IoPerson
            key={index}
            className="text-2xl max-md:text-lg text-black"
          />
        );
      } else {
        return (
          <IoPersonOutline
            key={index}
            className="text-2xl  max-md:text-lg text-gray-400"
          />
        );
      }
    });
  };

  function getDate(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("tr-TR");
  }

  function getTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    const checkAndFetchSession = async () => {
      // 1. ID Yakalama
      const queryId = searchParams.get("id") || searchParams.get("sessionId");
      const pathId = params?.id
        ? Array.isArray(params.id)
          ? params.id[0]
          : params.id
        : null;

      const finalId = pathId || queryId;

      if (finalId) {
        try {
          // 2. API İsteği (getSessionIdHandler mantığı)
          const result = await generalService.getCourseSessionSingle(finalId);
          // 3. State Güncelleme ve Modal Açma
          if (result) {
            setSessionDetailData(result);
            setSessionDetailCompModal(true);
          }
        } catch (error) {
          console.error("Eğitim detayı çekilemedi:", error);
        }
      } else {
      }
    };

    checkAndFetchSession();
  }, [searchParams, params]);

  // 🔥 MODAL KAPATMA FONKSİYONU
  const handleCloseModal = () => {
    setSessionDetailCompModal(false);
    setSessionDetailData(null);

    // URL'i temizle
  };
  // --- SEPETE EKLEME İŞLEMİ ---
  const addedSessionBasket = async (sessionCourse) => {
    // 1. Loading başlat (Tıklanan ID'yi set et)
    setProcessingSessionId(sessionCourse.id);

    try {
      const response = await addSession({
        success: true,
        basket: sessionCourse,
      });

      // Başarılı durumu
      if (response?.success) {
        // setSuccessModal({
        //   isOpen: true,
        //   message: "Eğitim başarıyla sepete eklendi, yönlendiriliyorsunuz...",
        // });

        setTimeout(() => {
          setSuccessModal((prev) => ({ ...prev, isOpen: false }));
          // Yönlendirme sırasında butonun loading'i durmasın ki kullanıcı tekrar tıklamasın
          router.push("/sepet");
          setProcessingSessionId(null);
        }, 1000);
      } else {
        throw new Error(response?.message);
      }
    } catch (error) {
      // Hata durumu
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Beklenmedik bir hata oluştu.";

      setErrorModal({
        isOpen: true,
        message: errorMsg,
      });

      // Hata aldıysak loading'i durdur ki kullanıcı tekrar deneyebilsin
      setProcessingSessionId(null);
    }
  };

  const closeErrorModal = () =>
    setErrorModal((prev) => ({ ...prev, isOpen: false }));
  const closeSuccessModal = () =>
    setSuccessModal((prev) => ({ ...prev, isOpen: false }));

  const getMergedSessionDetail = () => {
    // 1. Eğer detay datası henüz yoksa null dön
    if (!sessionDetailData?.data) return null;

    // 2. Bu session'ın ID'sini al
    const currentId = sessionDetailData.data.id;

    // 3. Global quotaData içinde bu ID'ye sahip güncel bilgi var mı?
    const liveQuota = quotaData.find((q) => q.id === currentId);

    // 4. Varsa merge et, yoksa mevcut datayı kullan
    if (liveQuota) {
      return {
        ...sessionDetailData.data, // API'den gelen statik detaylar (resim, açıklama vs.)
        users_count: liveQuota.users_count, // WebSocket/Quota API'den gelen güncel sayı
        quota: liveQuota.quota, // WebSocket/Quota API'den gelen güncel kapasite
      };
    }

    // 5. Quota bilgisi henüz yüklenmediyse, detay API'sinden gelenle devam et
    return sessionDetailData.data;
  };

  const activeSessionForModal = getMergedSessionDetail();

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SessionListSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 z-20 max-lg:px-0">
      {/* MODALLAR */}
      {/* Sizin componentleriniz 'open' prop'u bekliyor, state'imiz 'isOpen' */}
      <ErrorModal
        open={errorModal.isOpen}
        onClose={closeErrorModal}
        message={errorModal.message}
      />

      <SuccesMessageComp
        open={successModal.isOpen}
        onClose={closeSuccessModal}
        message={successModal.message}
      />

      {selectedInstructor !== null && (
        <InstructorProfileCard
          selectedInstructor={selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
        />
      )}
      {/* <SessionDetailModal
        isOpen={sessionDetailCompModal}
        onClose={handleCloseModal}
        addedSessionBasket={addedSessionBasket}
        session={sessionDetailData?.data}
        user={true}
      /> */}
      <SessionDetailModal
        isOpen={sessionDetailCompModal}
        onClose={handleCloseModal}
        addedSessionBasket={addedSessionBasket}
        session={activeSessionForModal}
        user={true}
      />

      {displaySessions.length > 0 ? (
        displaySessions.map((item, i) => {
          // Kontenjan dolu mu kontrolü
          const isQuotaFull = (item.users_count || 0) >= item.quota;
          // Şu an bu butona mı basıldı kontrolü
          const isProcessing = processingSessionId === item.id;

          return (
            <div
              key={item.id || i}
              className="w-full bg-white border border-gray-300 shadow-2xl p-4 lg:p-5 flex flex-col lg:flex-row justify-between items-center lg:items-start gap-3 lg:gap-2"
            >
              {/* SOL KISIM */}
              <div className="flex flex-col md:flex-row gap-6 lg:gap-10 w-full lg:w-4/6">
                <div className="relative w-full md:w-auto flex justify-center md:block">
                  <Image
                    alt="Cafe Image"
                    src={item.google_cafe.image}
                    width={300}
                    height={200}
                    priority
                    className="object-cover w-full h-auto md:w-[300px] md:h-[200px]"
                  />
                </div>

                <div className="flex flex-col justify-between gap-2 text-black py-1 md:py-3 w-full">
                  <div className="flex flex-col gap-2">
                    <p className="font-bold text-lg">{item.session_title}</p>
                    <p className="font-bold text-md">{item.google_cafe.name}</p>
                    <p className="font-light text-md">
                      {item.google_cafe.address}
                    </p>
                    <p className="font-light text-md">
                      {item.google_cafe.phone}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2 sm:mt-0">
                    <div className="flex justify-start items-center">
                      <FaLocationDot className="inline-block mr-2" />
                      <span
                        onClick={() =>
                          window.open(`${item.google_cafe.map_url}`, "_blank")
                        }
                        className="font-light cursor-pointer hover:underline underline-offset-4"
                      >
                        Konumu Gör
                      </span>
                    </div>

                    <div className="flex justify-start items-center gap-1 h-8">
                      <span className="font-bold pr-2 max-md:pr-0 max-md:text-sm">
                        Kontenjan:
                      </span>
                      {quotaLoading ? (
                        <div className="flex items-center gap-2 animate-pulse">
                          <div className="h-4 w-12 max-md:w-6 bg-gray-200 rounded"></div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((k) => (
                              <div
                                key={k}
                                className="h-5 w-5 bg-gray-200 rounded-full"
                              ></div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm mr-1 max-md:hidden text-gray-500 font-mono">
                            ({item.users_count || 0}/{item.quota})
                          </span>
                          <div className="flex flex-wrap">
                            {renderQuotaIcons(item.users_count, item.quota)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ORTA KISIM */}
              {/* ORTA KISIM */}
              <div className="relative flex justify-center items-center w-full lg:w-auto my-4 max-md:my-1 lg:my-0">
                {/* YENİ DÜZENLEME: 
      İki kutuyu saran tek bir div oluşturduk. 
      absolute özelliği SADECE bu kapsayıcı div'de var. 
      İçeridekiler flex ile yan yana duruyor.
  */}
                <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto lg:absolute lg:-top-[1.3rem]">
                  {/* Kategori Kutusu */}
                  <div
                    className={`
        p-4 flex justify-center items-center flex-col 
        font-bold leading-[1] 
        rounded-lg lg:rounded-none 
        w-full lg:w-auto shadow-sm
        ${
          item?.program?.category?.slug?.includes("daily")
            ? "bg-[#f4a22a] text-black"
            : "bg-[#003f6f] text-white"
        }
      `}
                  >
                    <span>{item?.program?.category?.name}</span>
                  </div>

                  {/* Süre Kutusu */}
                  <div className="bg-[#FFD207] text-center text-black p-4 flex justify-center items-center flex-col font-bold leading-[1] rounded-lg lg:rounded-none w-full lg:w-auto shadow-sm">
                    <span>1 Saat</span>
                  </div>
                </div>
              </div>

              {/* SAĞ KISIM */}
              <div className="w-full lg:w-1/6 flex flex-col justify-between gap-4 lg:gap-1 lg:h-[-webkit-fill-available]">
                <div className="flex flex-col gap-2 text-black items-start lg:items-end w-full">
                  <div className="flex gap-3 font-medium w-full lg:w-auto justify-between lg:justify-end">
                    <div className="flex justify-center items-end">
                      <Calendar
                        strokeWidth={2}
                        className="inline-block text-lg font-bold mr-2 text-[#FFD207]"
                      />
                      <span className="text-sm">
                        {getDate(item.session_date)}
                      </span>
                    </div>
                    <div className="flex justify-center items-end">
                      <Clock
                        strokeWidth={2}
                        className="inline-block text-[#FFD207] mr-2"
                      />
                      <span className="text-sm">
                        {getTime(item.session_date)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FFD207] px-4 py-1 shadow-sm rounded-4xl text-black font-bold text-sm w-fit">
                    <p>
                      Eğitmen: {item.instructor.first_name}{" "}
                      {item.instructor.last_name}
                    </p>
                  </div>
                  <div
                    onClick={() => setSelectedInstructor(item)}
                    className="bg-black px-4 py-1 hover:bg-[#FFD207] hover:text-black text-white cursor-pointer shadow-sm rounded-4xl transition-colors font-bold text-sm w-fit"
                  >
                    <p>Eğitmen Bilgisi</p>
                  </div>
                </div>

                {/* ACTION BUTTON - Loading Logic Here */}
                <button
                  onClick={() => addedSessionBasket(item)}
                  disabled={isQuotaFull || isProcessing}
                  className={`w-full lg:w-auto px-4 py-2 rounded-4xl font-bold transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2
                    ${
                      isQuotaFull
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-[#FFD207] text-black hover:bg-gray-900 hover:text-white"
                    }
                    ${isProcessing ? "opacity-75 cursor-wait" : ""}
                `}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>İşleniyor...</span>
                    </>
                  ) : isQuotaFull ? (
                    "Kontenjan Dolu"
                  ) : (
                    "Eğitime Katıl"
                  )}
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex justify-center items-center text-black text-3xl">
          Filtrelere uygun eğitim bulunamadı.
        </div>
      )}
    </div>
  );
}

export default function SessionListComp({ mappedData, loading }) {
  return (
    <Suspense fallback={<Loading />}>
      <CourseContentList mappedData={mappedData} loading={loading} />
    </Suspense>
  );
}
