import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { IoLocationSharp, IoPerson, IoPersonOutline } from "react-icons/io5";
import { FiCalendar, FiClock, FiRefreshCw } from "react-icons/fi";
import "react-calendar/dist/Calendar.css";
import userimage from "../../../assets/instructor_sidebar/dummy_user.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronRight } from "react-icons/fa";
import generalService from "../../../utils/axios/generalService";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
import { echo } from "../../../utils/lib/echo";
import UserConfirmComp from "../userConfirmComp/UserConfirmComp";
import { toast } from "react-toastify";
import { enFormatDate, enFormatTime } from "../../../utils/helpers/formatters";
// Basit bir Loading Spinner (Veri çekilirken dönecek)
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-8 text-yellow-500">
    <FiRefreshCw className="animate-spin h-8 w-8 mb-2" />
    <p className="text-gray-500 text-sm">Katılımcılar yükleniyor...</p>
  </div>
);

const CourseSessionCard = ({ data, status }) => {
  const [openCourseInfo, setOpenCourseInfo] = useState(null);

  // 🔥 API'den gelen kullanıcıları burada tutacağız
  const [selectedSessionUsers, setSelectedSessionUsers] = useState([]);
  // 🔥 Kullanıcılar yükleniyor mu?
  const [usersLoading, setUsersLoading] = useState(false);

  // 🔥 SPAM KORUMASI: Buton basılabilir mi? (Başlangıçta true)
  const [canRefresh, setCanRefresh] = useState(true);

  const [userConfirmModal, setUserConfirmModal] = useState(false);
  const [userConfirmSelectedUser, setUserConfirmSelectedUser] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const openCourseRef = useRef(null);
  const [sessionList, setSessionList] = useState([]);
  const [quotaLoading, setQuotaLoading] = useState(true);

  // 1. Props'tan gelen veriyi state'e atıyoruz
  useEffect(() => {
    if (data?.course_sessions) {
      setSessionList(data.course_sessions);
    }
  }, [data]);

  // 2. API'den Güncel Kontenjan Bilgisini Çekme
  const fetchQuotaInfo = async () => {
    setQuotaLoading(true);
    try {
      const response = await generalService.getCourseSessionQuotaInfo();
      if (response && Array.isArray(response)) {
        updateSessionList(response);
      }
    } catch (error) {
      console.error("Kontenjan bilgisi alınamadı:", error);
    } finally {
      setQuotaLoading(false);
    }
  };

  useEffect(() => {
    if (data && data.course_sessions.length > 0) {
      fetchQuotaInfo();
    } else {
      setQuotaLoading(false);
    }
  }, [data]);

  // 3. WebSocket
  useEffect(() => {
    if (!echo) return;
    const channel = echo.channel("course_sessions");
    channel.listen(".quota.updated", (event) => {
      if (event.sessions) {
        updateSessionList(event.sessions);
      }
    });
    return () => {
      echo.leave("course_sessions");
    };
  }, []);

  const updateSessionList = (updates) => {
    setSessionList((prevSessions) => {
      return prevSessions.map((session) => {
        const updatedData = updates.find((u) => u.id === session.id);
        if (updatedData) {
          return {
            ...session,
            users_count: updatedData.users_count,
            quota: updatedData.quota,
          };
        }
        return session;
      });
    });
  };

  // 🔥 KULLANICILARI GETİREN FONKSİYON
  const getSessionUsers = async (sessionId) => {
    setUsersLoading(true); // Yükleme başlasın
    setSelectedSessionUsers([]); // Önceki datayı temizle
    try {
      const response = await instructorPanelService.getMySessionUsers(
        sessionId
      );

      if (Array.isArray(response)) {
        setSelectedSessionUsers(response);
      } else {
        setSelectedSessionUsers([]);
      }
    } catch (error) {
      console.error("Katılımcılar alınamadı:", error);
      setSelectedSessionUsers([]);
    } finally {
      setUsersLoading(false); // Yükleme bitsin
    }
  };

  // 🔥 GÜVENLİ YENİLEME FONKSİYONU (SPAM ENGELLEYİCİ)
  const handleSafeRefresh = (e, sessionId) => {
    e.stopPropagation(); // Kartın kapanmasını engelle

    // 1. Eğer zaten yükleniyorsa işlem yapma
    if (usersLoading) return;

    // 2. Eğer soğuma süresindeyse (cooldown) işlem yapma
    if (!canRefresh) {
      toast.warning(
        "Çok sık yenileme yapıyorsunuz, lütfen 10 saniye bekleyin."
      );
      return;
    }

    // İşlemleri başlat
    getSessionUsers(sessionId);

    // 3. Butonu kilitle
    setCanRefresh(false);

    // 4. 10 Saniye sonra kilidi aç
    setTimeout(() => {
      setCanRefresh(true);
    }, 10000); // 10000ms = 10 saniye
  };

  // 🔥 KART AÇMA/KAPAMA MANTIĞI
  const handleToggleCard = (item) => {
    if (openCourseInfo?.id === item.id) {
      setOpenCourseInfo(null);
      setSelectedSessionUsers([]);
    } else {
      setOpenCourseInfo(item);
      getSessionUsers(item.id);
    }
  };

  const renderQuotaIcons = (usersCount, quota) => {
    const filledCount = usersCount || 0;
    const totalQuota = quota || 0;
    return Array.from({ length: totalQuota }).map((_, index) => {
      if (index < filledCount) {
        return <IoPerson key={index} className="text-lg text-black" />;
      } else {
        return (
          <IoPersonOutline key={index} className="text-lg text-gray-400" />
        );
      }
    });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openCourseRef.current &&
        !userConfirmModal &&
        !openCourseRef.current.contains(event.target) &&
        !event.target.closest(".session-card-trigger")
      ) {
        setOpenCourseInfo(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openCourseInfo, userConfirmModal]);

  const NextArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 -translate-y-1/2 right-0 z-10 cursor-pointer"
      onClick={onClick}
    >
      <FaChevronRight size={24} color="black" />
    </div>
  );
  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 -translate-y-1/2 left-[-20px] z-10 cursor-pointer"
      onClick={onClick}
    >
      <FaChevronRight size={24} color="black" className="rotate-180" />
    </div>
  );

  // Bu ayarları componentinizin içinde bir yerde tanımlamış olmalısınız.
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4, // Masaüstünde varsayılan 4 tane göster
    slidesToScroll: 4,
    initialSlide: 0,
    // İŞTE BURASI ÖNEMLİ KISIM:
    responsive: [
      {
        breakpoint: 1024, // Tablet yatay vb.
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600, // Tablet dikey / Büyük telefonlar
        settings: {
          slidesToShow: 2, // Ekrana 2 tane sığdır
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480, // Küçük mobil ekranlar
        settings: {
          // MOBİLDE İÇ İÇE GEÇMEMESİ İÇİN GENELDE 1 veya 1.5 VERİLİR
          slidesToShow: 1, // Ekranda sadece 1 tane göster
          slidesToScroll: 1,
          // Eğer bir sonrakinin ucu gözüksün isterseniz 1.2 gibi değerler deneyebilirsiniz.
        },
      },
    ],
  };

  const userConfirmHandler = (user) => {
    if (user) {
      setUserConfirmModal(true);
      setUserConfirmSelectedUser(user);
    }
  };

  return (
    <div>
      {userConfirmModal && (
        <UserConfirmComp
          userConfirmSelectedUser={userConfirmSelectedUser}
          setUserConfirmModal={setUserConfirmModal}
          getSessionUsers={getSessionUsers}
          openCourseInfo={openCourseInfo?.id}
        />
      )}
      {sessionList.map(
        (item, i) =>
          item.status === status && (
            <div key={item.id || i} className="space-y-4 relative my-2">
              <article
                className="session-card-trigger relative bg-white shadow-md overflow-hidden flex flex-col md:flex-row cursor-pointer p-5"
                onClick={() => handleToggleCard(item)}
              >
                <div className="w-64 h-50 relative flex-shrink-0 overflow-hidden mr-4 max-lg:w-full max-lg:h-56">
                  <Image
                    src={item.google_cafe.image}
                    alt={item.google_cafe.name}
                    className="w-full h-full object-cover"
                    fill
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="flex flex-col gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {item.session_title}
                      </h3>
                      <p className="text-base font-semibold text-gray-800 mt-1">
                        {item.google_cafe.name}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-md text-gray-600 leading-snug">
                        {item.google_cafe.address}
                      </p>
                      <p className="text-md text-gray-500">
                        {item.google_cafe.phone}
                      </p>
                    </div>

                    <div className="pt-2 mt-1 border-t border-gray-100">
                      <p className="text-md text-gray-800">
                        <span className="font-semibold text-black">
                          Instructor:
                        </span>{" "}
                        {data?.first_name} {data?.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center text-sm text-gray-800 gap-4 flex-wrap">
                      <div className="flex justify-start items-center">
                        <IoLocationSharp className="inline-block text-2xl mr-2 text-[#fdd207]" />
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              `https://www.google.com/maps?q=${item.google_cafe.latitude},${item.google_cafe.longitude}`,
                              "_blank"
                            );
                          }}
                          className="text-md cursor-pointer hover:underline underline-offset-4"
                        >
                          View Location
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Quota:</span>
                        {quotaLoading ? (
                          <div className="flex items-center gap-1 animate-pulse">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map((k) => (
                                <div
                                  key={k}
                                  className="h-4 w-4 bg-gray-200 rounded-full"
                                ></div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 font-mono mr-1">
                              ({item.users_count || 0}/{item.quota})
                            </span>
                            {renderQuotaIcons(item.users_count, item.quota)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-3 gap-2 min-w-[80px] mt-2 md:mt-0">
                  <div className="bg-[#FFD207] w-12 h-12 rounded-md flex flex-col items-center justify-center shadow-md">
                    <span className="font-semibold text-black text-md">1</span>
                    <span className="text-[10px] text-black leading-none">
                      hours
                    </span>
                  </div>
                  <div>
                    <p className="text-black font-semibold">Session Duration</p>
                  </div>

                  <div className="flex flex-col items-center text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <FiCalendar />
                      <span>{enFormatDate(item.session_date, "long")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock />
                      <span>{enFormatTime(item.session_date)}</span>
                    </div>
                  </div>
                </div>
              </article>

              {openCourseInfo?.id === item.id && (
                <div
                  ref={openCourseRef}
                  className="bg-white rounded-3xl p-6 shadow-md relative flex justify-center items-center flex-col"
                >
                  {/* --- YENİLEME BUTONU (GÜVENLİ & KORUMALI) --- */}
                  <button
                    onClick={(e) => handleSafeRefresh(e, item.id)}
                    disabled={usersLoading || !canRefresh} // Butonu fiziksel olarak engelle
                    className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-200 group
                        ${
                          usersLoading || !canRefresh
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed" // Pasif görünüm
                            : "text-gray-400 hover:text-blue-600 hover:bg-gray-100 cursor-pointer" // Aktif görünüm
                        }
                    `}
                    title={
                      !canRefresh ? "Lütfen bekleyiniz..." : "Listeyi Güncelle"
                    }
                  >
                    <FiRefreshCw
                      size={20}
                      className={`${usersLoading ? "animate-spin" : ""} ${
                        !canRefresh && !usersLoading ? "opacity-50" : ""
                      }`}
                    />
                  </button>

                  <div className="flex justify-center items-center  rounded-full p-3 py-4 bg-yellow-300 w-3xl max-lg:w-auto px-20">
                    <h2 className="text-xl font-bold text-black">
                      Participants
                    </h2>
                  </div>

                  {usersLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="w-full max-w-4xl mt-4">
                      {selectedSessionUsers &&
                      selectedSessionUsers.length > 0 ? (
                        <Slider {...sliderSettings} className="gap-2 w-full">
                          {selectedSessionUsers.map((user, idx) => {
                            // 1. Onay durumunu kontrol et (Backend'den gelen veri)
                            const isConfirmed =
                              user.attendance_code_confirm === 1;

                            return (
                              <div key={idx} className="outline-none px-2">
                                <div
                                  // 2. CSS Sınıflarını duruma göre ayarla
                                  // Onaylıysa: cursor-default (tıklanmaz hissi), opacity biraz düşebilir
                                  // Onaysızsa: cursor-pointer ve hover efektleri aktif
                                  className={`w-full flex flex-col justify-center items-center py-2 px-1 transition-all
            ${isConfirmed ? "cursor-default" : "cursor-pointer group"}
          `}
                                  // 3. Tıklama mantığı: Sadece onaylı DEĞİLSE fonksiyon çalışsın
                                  onClick={() => {
                                    if (!isConfirmed) {
                                      userConfirmHandler(user);
                                    }
                                  }}
                                >
                                  {/* Resim Kapsayıcısı */}
                                  <div
                                    className={`relative w-20 h-20 transition-transform ${
                                      !isConfirmed && "group-hover:scale-105"
                                    }`}
                                  >
                                    <Image
                                      src={user?.profile_image || userimage}
                                      alt={user?.name}
                                      fill
                                      // Onaylıysa yeşil çerçeve, değilse siyah çerçeve
                                      className={`rounded-full object-cover border 
                ${isConfirmed ? "border-green-500 border-4" : "border-black"}
              `}
                                    />

                                    {/* 4. Onay İkonu (Absolute ile sağ üst köşeye yerleştiriyoruz) */}
                                    {isConfirmed && (
                                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1 z-10 border-2 border-white shadow-sm">
                                        {/* SVG Check Icon */}
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="w-4 h-4"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                  </div>

                                  <p className="mt-2 text-md text-black font-medium text-center">
                                    {user?.name}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                      ) : (
                        <div className="flex flex-col items-center justify-center mt-4 gap-2">
                          <p className="text-gray-500">
                            Henüz katılımcı bulunmamaktadır.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
      )}
    </div>
  );
};

export default CourseSessionCard;
