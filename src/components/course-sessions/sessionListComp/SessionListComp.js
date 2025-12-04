import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { IoPerson, IoPersonOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import generalService from "../../../utils/axios/generalService";
import { useCart } from "../../../context/CartContext";
import InstructorProfileCard from "../instructor-profile-card/InstructorProfileCard";
import { useRouter } from "next/navigation";
import SessionListSkeleton from "../../../components/ui/LoadingSkeleton/SessionListSkeleton";
import { echo } from "../../../utils/lib/echo";

function SessionListComp({ mappedData, loading }) {
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [displaySessions, setDisplaySessions] = useState([]);
  const [quotaData, setQuotaData] = useState([]);
  const [quotaLoading, setQuotaLoading] = useState(true);

  const { addSession } = useCart();
  const router = useRouter();

  // 1. ADIM: API İSTEĞİ (Sadece Sayfa Açılışında 1 Kere)
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

  const renderQuotaIcons = (usersCount, quota) => {
    const filledCount = usersCount || 0;
    const totalQuota = quota || 0;
    return Array.from({ length: totalQuota }).map((_, index) => {
      if (index < filledCount) {
        return <IoPerson key={index} className="text-2xl text-black" />;
      } else {
        return (
          <IoPersonOutline key={index} className="text-2xl text-gray-400" />
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

  const addedSessionBasket = async (sessionCourse) => {
    const success = await addSession(sessionCourse);
    if (success) {
      router.push("/sepet");
    } else {
      alert("Sepete ekleme başarısız oldu!");
    }
  };

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
    <div className="flex flex-col gap-4 z-20 max-lg:px-4">
      {selectedInstructor !== null && (
        <InstructorProfileCard
          selectedInstructor={selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
        />
      )}

      {displaySessions &&
        displaySessions.map((item, i) => (
          <div
            key={item.id || i}
            // Değişiklik 1: Flex yönü mobilde column, lg'de row yapıldı. Pading mobilde biraz azaltıldı.
            className="w-full bg-white border border-gray-300 shadow-2xl p-4 lg:p-5 flex flex-col lg:flex-row justify-between items-center lg:items-start gap-6 lg:gap-2"
          >
            {/* SOL KISIM (Resim + Bilgiler) */}
            {/* Değişiklik 2: Genişlik mobilde full, lg'de 4/6 yapıldı. Flex yönü mobilde column, md'de row. */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-10 w-full lg:w-4/6">
              <div className="relative w-full md:w-auto flex justify-center md:block">
                <Image
                  alt="Cafe Image"
                  src={item.cafe.image}
                  width={300}
                  height={200}
                  priority
                  // Resim mobilde responsive davranması için style eklendi
                  className="object-cover w-full h-auto md:w-[300px] md:h-[200px]"
                />
              </div>

              <div className="flex flex-col justify-between gap-2 text-black py-1 md:py-3 w-full">
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-lg">{item.session_title}</p>
                  <p className="font-bold text-md">{item.cafe.name}</p>
                  <p className="font-light text-md">{item.cafe.address}</p>
                  <p className="font-light text-md">{item.cafe.phone}</p>
                </div>

                {/* Konum ve Kota Satırı */}
                {/* Mobilde alt alta, md üstü yan yana */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2 sm:mt-0">
                  <div className="flex justify-start items-center">
                    <FaLocationDot className="inline-block mr-2" />
                    <span
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps?q=${item.cafe.latitude},${item.cafe.longitude}`,
                          "_blank"
                        )
                      }
                      className="font-light cursor-pointer hover:underline underline-offset-4"
                    >
                      Konumu Gör
                    </span>
                  </div>

                  {/* KOTA ALANI */}
                  <div className="flex justify-start items-center gap-1 h-8">
                    <span className="font-bold pr-2">Kontenjan:</span>
                    {quotaLoading ? (
                      <div className="flex items-center gap-2 animate-pulse">
                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
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
                        <span className="text-sm mr-1 text-gray-500 font-mono">
                          ({item.users_count || 0}/{item.quota})
                        </span>
                        {/* Mobilde ikonların aşağı taşmaması için flex-wrap */}
                        <div className="flex flex-wrap">
                          {renderQuotaIcons(item.users_count, item.quota)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ORTA KISIM (Süre Sarı Etiket) */}
            <div className="relative flex justify-center items-center w-full lg:w-auto my-4 lg:my-0">
              {/* Değişiklik 3: Mobilde 'static' (akışta), Masaüstünde 'absolute' (yukarı taşmış) */}
              <div className="bg-[#FFD207] relative lg:absolute lg:-top-[1.3rem] p-4 flex justify-center items-center flex-col font-bold leading-[1] rounded-lg lg:rounded-none w-full lg:w-auto">
                <p>1</p>
                <span>Saat</span>
              </div>
              {/* Mobilde yazıyı gizleyebilir veya margin ile gösterebiliriz, burada masaüstü yapısı korundu */}
              <p className="mt-2 lg:mt-12 font-bold text-sm lg:text-base max-lg:hidden">
                Eğitim süresi
              </p>
            </div>

            {/* SAĞ KISIM (Tarih, Eğitmen, Buton) */}
            {/* Değişiklik 4: Genişlik mobilde full, lg'de 1/6. Hizalama mobilde center/stretch */}
            <div className="w-full lg:w-1/6 flex flex-col justify-between gap-4 lg:gap-1 lg:h-[-webkit-fill-available]">
              <div className="flex flex-col gap-2 text-black items-start lg:items-end w-full">
                {/* Tarih Saat */}
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

              <button
                onClick={() => addedSessionBasket(item)}
                disabled={(item.users_count || 0) >= item.quota}
                className={`w-full lg:w-auto px-4 py-2 rounded-4xl font-bold transition-colors duration-200 cursor-pointer 
                    ${
                      (item.users_count || 0) >= item.quota
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-[#FFD207] text-black hover:bg-gray-900 hover:text-white"
                    }`}
              >
                {(item.users_count || 0) >= item.quota
                  ? "Kontenjan Dolu"
                  : "Eğitime Katıl"}
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default SessionListComp;
