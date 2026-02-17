import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { IoLocationSharp, IoPerson, IoPersonOutline } from "react-icons/io5";

import {
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiXCircle,
  FiCheck,
  FiBell,
  FiUser,
  FiUsers,
  FiCheckCircle,
  FiFileText,
  FiShare2,
  FiCopy,
} from "react-icons/fi";
import ShareComp from "../another-comp/ShareComp";
import DocumentPopup from "../another-comp/DocsComp";

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
import {
  enFormatDate,
  enFormatTime,
  formatDate,
  formatTime,
} from "../../../utils/helpers/formatters";
import ConfirmModal from "../../ui/ConfirmModal/ConfirmModal";
import SuccesMessageComp from "../../ui/SuccesModal/SuccesMessageComp";
import ErrorModal from "../../ui/ErrorModal/ErrorModal";
import SessionCompleteComp from "../another-comp/SessionCompleteComp";
import InstructorUpdateSessionModal from "../instructor-update-session/InstructorUpdateSession";
// Basit bir Loading Spinner (Veri çekilirken dönecek)
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-8 text-yellow-500">
    <FiRefreshCw className="animate-spin h-8 w-8 mb-2" />
    <p className="text-gray-500 text-sm">Katılımcılar yükleniyor...</p>
  </div>
);

const CourseSessionCard = ({ data, status, setSessionCounts, refetch }) => {
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });

  const [successModal, setSuccessModal] = useState({
    open: false,
    message: "",
  });
  const [shareModalData, setShareModalData] = useState({
    open: false, // 🔥 BURAYI FALSE YAP, YOKSA SAYFA AÇILIR AÇILMAZ ÇIKAR
    url: "",
    title: "",
  });
  const [docModalData, setDocModalData] = useState({
    open: false,
    title: "",
    content: "", // Buraya doküman linki veya metni gelebilir
  });
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });
  const [openCourseInfo, setOpenCourseInfo] = useState(null);
  const [sessionToReview, setSessionToReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 🔥 API'den gelen kullanıcıları burada tutacağız
  const [selectedSessionUsers, setSelectedSessionUsers] = useState([]);
  // 🔥 Kullanıcılar yükleniyor mu?
  const [usersLoading, setUsersLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSessionForEdit, setSelectedSessionForEdit] = useState(null);
  const [cancelModal, setCancelModal] = useState({ open: false, data: null });
  const [withdrawModal, setWithdrawModal] = useState({
    isOpen: false,
    sessionId: null,
  });
  // API isteği sırasında butonu kilitlemek için loading durumu
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  // 🔥 SPAM KORUMASI: Buton basılabilir mi? (Başlangıçta true)
  const [canRefresh, setCanRefresh] = useState(true);

  const [userConfirmModal, setUserConfirmModal] = useState(false);
  const [userConfirmSelectedUser, setUserConfirmSelectedUser] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [dismissedSessionIds, setDismissedSessionIds] = useState([]);
  const openCourseRef = useRef(null);
  const [cancelReason, setCancelReason] = useState("");
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
  const handleDocumentClick = (e, session) => {
    e.stopPropagation();
    setDocModalData({
      open: true,
      title: `${session.session_title} - Session Document`,
      content: session.program || "Doküman henüz hazır değil.", // Backend'den gelen veri
    });
  };
  const handleShareClick = (e, session) => {
    e.stopPropagation();

    // 1. Site adresini al (örn: https://englishpoint.com.tr)
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    // 2. Senin oluşturduğun özel SEO sayfasına giden linki oluştur
    // Bu link paylaşıldığında senin ShareCoursePage'deki generateMetadata çalışacak
    const url = `${origin}/share-course/${session.uniq_id}`;

    setShareModalData({
      open: true,
      url: url,
      // 3. "Join my session" yazılarını kaldırdık.
      // Sadece Eğitim Başlığı - Kafe Adı şeklinde sadeleştirdik.
      title: `${session.session_title} - ${session.google_cafe.name}`,
    });
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
  const onConfirmWithdraw = async () => {
    if (!showWithdrawModal.sessionId) return;

    setIsProcessing(true);
    try {
      const payload = { session_id: showWithdrawModal.sessionId };
      // Servis adını generalService ya da instructorPanelService olarak kontrol et
      const res = await instructorPanelService.cancelSessionWithdraw(payload);

      if (res.status) {
        toast.success(res.message || "Request withdrawn successfully");
        setShowWithdrawModal({ isOpen: false, sessionId: null });
        if (refetch) refetch(); // Sayfayı yenilemek için kullandığın props
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to withdraw.");
    } finally {
      setIsProcessing(false);
    }
  };
  const handleConfirmWithdraw = async () => {
    // 1. Session ID var mı kontrol et
    if (!withdrawModal.sessionId) return;

    setWithdrawLoading(true);
    try {
      const payload = { session_id: withdrawModal.sessionId };

      // 2. API İsteği (Servis adını kendi projene göre kontrol et)
      const res = await instructorPanelService.cancelSessionWithdraw(payload);

      if (res.status) {
        toast.success(res.message || "İptal talebi geri çekildi.");

        // 3. Modalı Kapat
        setWithdrawModal({ isOpen: false, sessionId: null });

        // 4. Listeyi Yenile (Refetch varsa kullan, yoksa manuel state güncelle)
        if (refetch) {
          refetch();
        } else {
          // Listeyi manuel güncelleme (Refetch yoksa)
          setSessionList((prev) =>
            prev.map((item) =>
              item.id === withdrawModal.sessionId
                ? { ...item, status: "active" } // Statüyü active yap
                : item,
            ),
          );
        }
      } else {
        toast.error(res.message || "İşlem başarısız.");
      }
    } catch (error) {
      console.error("Withdraw Error:", error);
      toast.error(error.response?.data?.message || "Bir hata oluştu.");
    } finally {
      setWithdrawLoading(false);
    }
  };
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
  const handleWithdraw = async (sessionId) => {
    // Modern bir onay kutusu (SweetAlert veya benzeri varsa onu kullanabilirsin)
    if (
      !window.confirm(
        "Do you want to withdraw your cancellation request and keep this session active?",
      )
    )
      return;

    setIsWithdrawing(true);
    try {
      const payload = { session_id: sessionId };
      const res = await instructorPanelService.cancelSessionWithdraw(payload);

      if (res.status) {
        // Başarılı mesajı (Toast kullanmanı öneririm)
        alert(res.message);
        // Listeyi yenilemek için kullandığın fonksiyonu çağır (Örn: fetchSessions)
        if (typeof fetchSessions === "function") fetchSessions();
      } else {
        alert(res.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      // Admin onaylamış olabilir (400 Hatası dönerse)
      alert(
        error.response?.data?.message ||
          "Action failed. Admin might have already approved it.",
      );
    } finally {
      setIsWithdrawing(false);
    }
  };
  // 🔥 KULLANICILARI GETİREN FONKSİYON
  const getSessionUsers = async (sessionId) => {
    setUsersLoading(true); // Yükleme başlasın
    setSelectedSessionUsers([]); // Önceki datayı temizle
    try {
      const response =
        await instructorPanelService.getMySessionUsers(sessionId);

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
  // 🔥 İPTAL BUTONUNA TIKLANINCA ÇALIŞAN FONKSİYON
  const handleCancelClick = (e, session) => {
    e.stopPropagation();

    const sessionDate = new Date(session.session_date);
    const now = new Date();
    const diffInMs = sessionDate - now;
    const diffInMinutes = diffInMs / (1000 * 60);

    let cancelType = "";
    let message = "";
    let modalTitle = "";

    // --- 1 SAAT KONTROLÜ (YASAK) ---
    if (diffInMinutes < 60) {
      cancelType = "forbidden";
      modalTitle = "Action Not Allowed";
      message =
        "Cancellation is no longer possible as there is less than 1 hour left until the session starts.";
    } else {
      // --- SENİN MEVCUT MANTIK AĞACIN ---
      const hoursLeft = Math.floor(diffInMs / (1000 * 60 * 60));
      const studentCount = session.users_count || 0;

      if (hoursLeft >= 12) {
        if (studentCount > 0) {
          cancelType = "standard_with_students";
          modalTitle = "Session Cancellation";
          message = `There are ${studentCount} students registered for this session. If you cancel, their payments/rights will be refunded. No penalty will be applied. Do you confirm?`;
        } else {
          cancelType = "standard";
          modalTitle = "Session Cancellation";
          message =
            "You are about to cancel this session. This action cannot be undone. Do you confirm?";
        }
      } else {
        if (studentCount > 0) {
          cancelType = "penalty";
          modalTitle = "Penalty Warning";
          message = `WARNING! Only ${hoursLeft} hours left and there are ${studentCount} registered students. If you cancel now, a 100 TL PENALTY will be deducted from your earnings.`;
        } else {
          cancelType = "admin_approval";
          modalTitle = "Admin Approval Required";
          message = `Less than 12 hours left (${hoursLeft} hours). No penalty will be applied, but your request will be submitted for admin approval.`;
        }
      }
    }

    // Modal'ı her durumda açıyoruz
    setCancelModal({
      open: true,
      data: {
        session_id: session.id,
        cancelType,
        modalTitle,
        message,
      },
    });
  };

  // 🔥 İPTALİ ONAYLAMA (API İSTEĞİ)
  // --- CONFIRM CANCEL FONKSİYONU ---
  const confirmCancel = async () => {
    if (!cancelModal.data) return;

    // 12 SAAT KURALI KONTROLÜ:
    // Eğer cezalı iptal (penalty) ise ve sebep girilmemişse durdur
    if (cancelModal.data.cancelType === "penalty" && !cancelReason.trim()) {
      setErrorModal({
        open: true,
        message:
          "Please provide a reason for cancellation (Required for late cancellations).",
      });
      return;
    }

    setCancelLoading(true);
    try {
      // API'ye 'reason' parametresini de ekleyerek gönderiyoruz
      const response = await instructorPanelService.cancelSession({
        session_id: cancelModal.data.session_id,
        cancel_type: cancelModal.data.cancelType,
        reason: cancelReason, // SEBEP BURADA GÖNDERİLİYOR
      });

      if (response.status === true || response.status === "success") {
        setSuccessModal({
          open: true,
          message: response.message || "Session cancelled successfully.",
        });

        const newStatus = response.data?.new_status;

        if (newStatus === "cancellation_requested") {
          if (refetch) refetch();
        } else {
          if (refetch) {
            refetch();
          } else {
            setSessionList((prev) =>
              prev.filter((item) => item.id !== cancelModal.data.session_id),
            );
          }
        }

        // Başarılı işlem sonrası modalı kapat ve sebebi temizle
        setCancelModal({ open: false, data: null });
        setCancelReason("");
      } else {
        setErrorModal({
          open: true,
          message: response.message || "Failed to cancel session.",
        });
      }
    } catch (error) {
      console.error(error);
      setErrorModal({
        open: true,
        message:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    } finally {
      setCancelLoading(false);
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
        "Çok sık yenileme yapıyorsunuz, lütfen 10 saniye bekleyin.",
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
    // 1. Kapatma mantığı
    if (openCourseInfo?.id === item.id) {
      setOpenCourseInfo(null);
      setSelectedSessionUsers([]);
    } else {
      // 2. Açma mantığı
      setOpenCourseInfo(item);
      getSessionUsers(item.id);

      // 3. SCROLL İŞLEMİ
      // setTimeout kullanıyoruz ki React state'i güncelleyip DOM'u çizene kadar beklesin
      setTimeout(() => {
        // Eğer EKRANI AŞAĞI itmek istiyorsan (pozitif değer):
        window.scrollBy({ top: 300, behavior: "smooth" });

        // Eğer EKRANI YUKARI çekmek istiyorsan (negatif değer -50):
        // window.scrollBy({ top: -50, behavior: 'smooth' });
      }, 100);
    }
  };
  const handleDismissOverlay = (sessionId, e) => {
    e.stopPropagation(); // Tıklamanın kartın diğer eventlerini tetiklemesini engeller
    setDismissedSessionIds((prev) => [...prev, sessionId]);
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

  const handleConfirmFinish = async (result) => {
    // result: { success: true, message: "...", data: ... }

    if (result && result.success) {
      // 1. Başarılı mesajını göster (Senin kodunda zaten successModal var)
      setSuccessModal({
        open: true,
        message: result.message || "Session marked as completed successfully.",
      });

      // 2. Modalı kapat
      setIsModalOpen(false);
      setSessionToReview(null);

      // 3. Listeyi yenile (Status değiştiği için kart ekrandan gitmeli veya güncellenmeli)
      if (refetch) {
        refetch();
      }
    } else {
      // Hata varsa
      setErrorModal({
        open: true,
        message:
          result?.message || "An error occurred while updating the session.",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // İstersen burada localStorage kullanarak bu ders için tekrar sormamayı sağlayabilirsin.
  };

  const isSessionCompleted = (session) => {
    // Veri yoksa false dön
    if (!session || !session.session_date) return false;

    // 1. Tarih formatını (Safari/Mobil uyumu için) düzelt: " " -> "T"
    const dateStr = session.session_date.replace(" ", "T");
    const startTime = new Date(dateStr);

    // 2. Başlangıç saatine 1 saat (60 dakika) ekle
    // (1000 ms * 60 sn * 60 dk)
    const endTime = new Date(startTime.getTime() + 70 * 60 * 1000);

    const now = new Date();
    // 3. Şu anki zaman bitişi geçtiyse VE statü "active" ise TRUE döner
    return now > endTime && session.status === "active";
  };
  // Bu ayarları componentinizin içinde bir yerde tanımlamış olmalısınız.
  const sliderSettings = {
    dots: true,
    infinite: false, // Az eleman varsa döngüyü kapatır, bu da kaymaları önler
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280, // Geniş ekran laptoplar
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1024, // Laptop / Tablet Yatay
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768, // Tablet Dikey
        settings: {
          slidesToShow: 2, // Burada 2 tane göster
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640, // TÜM MOBİL CİHAZLAR (Önemli Değişiklik Burası)
        settings: {
          slidesToShow: 1, // Mobilde kesinlikle 1 tane göster
          slidesToScroll: 1,
          arrows: false, // Mobilde okları gizle ki yer açılsın
          dots: true, // Navigasyon için noktaları açık bırak
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
  const handleEdit = (item) => {
    setSelectedSessionForEdit(item);
    setIsEditModalOpen(true);
  };
  const handleDeleteRequest = (id) => {
    setConfirmConfig({
      isOpen: true,
      message:
        "Are you sure you want to delete this session? This action cannot be undone.",
      onConfirm: () => handleActualDelete(id), // Onaylanırsa çalışacak asıl silme fonksiyonu
    });
  };

  // Asıl silme işlemini yapan fonksiyon
  const handleActualDelete = async (id) => {
    // Onay modalını hemen kapat
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));

    try {
      const response = await instructorPanelService.deleteMySessions(id);

      if (response.status === true) {
        setSuccessModal({
          open: true,
          message:
            response.message || "The session has been deleted successfully.",
        });

        setSessionList((prev) => prev.filter((item) => item.id !== id));
        if (setSessionCounts) {
          setSessionCounts((prev) => ({
            ...prev,
            all: prev.all - 1, // Toplam sayıdan düş
            awaiting: prev.awaiting - 1, // Awaiting sayısından düş
          }));
        }
      } else {
        setErrorModal({
          open: true,
          message: response.message || "You cannot delete this session.",
        });
      }
    } catch (error) {
      // Sunucu hatası durumunda Error modalını aç
      setErrorModal({
        open: true,
        message: "An unexpected server error occurred. Please try again later.",
      });
    }
  };

  const handleRestoreOverlay = (id, e) => {
    e.stopPropagation(); // Kartın tıklanma olayını engelle
    // ID'yi dismissed listesinden çıkarıyoruz, böylece overlay geri geliyor
    setDismissedSessionIds((prev) =>
      prev.filter((sessionId) => sessionId !== id),
    );
  };

  return (
    <div>
      {isModalOpen && sessionToReview && (
        <SessionCompleteComp
          data={sessionToReview}
          message={`The scheduled time for the session titled "${sessionToReview.session_title}" has passed. Was it completed successfully?`}
          onConfirm={handleConfirmFinish}
          onCancel={handleCloseModal}
        />
      )}
      {userConfirmModal && (
        <UserConfirmComp
          userConfirmSelectedUser={userConfirmSelectedUser}
          setUserConfirmModal={setUserConfirmModal}
          getSessionUsers={getSessionUsers}
          openCourseInfo={openCourseInfo?.id}
        />
      )}
      {/* 2. Başarılı İşlem Modalı */}
      <SuccesMessageComp
        open={successModal.open}
        lang="en"
        message={successModal.message}
        onClose={() => setSuccessModal({ open: false, message: "" })}
      />
      <InstructorUpdateSessionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        sessionData={selectedSessionForEdit}
        refetch={refetch} // Veriyi yenilemek için
      />
      {/* 3. Hata Mesajı Modalı */}
      <ErrorModal
        open={errorModal.open}
        lang="en"
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: "" })}
      />
      <ConfirmModal
        open={confirmConfig.isOpen}
        message={confirmConfig.message}
        lang="en"
        onConfirm={confirmConfig.onConfirm}
        onCancel={() =>
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
        }
      />

      {status === "awaiting" && (
        <p className="text-gray-700 px-2">
          You can delete or edit your sessions that are in awaiting status.
        </p>
      )}
      {cancelModal.open && cancelModal.data && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4 border-b border-gray-100 pb-3">
              <div className="bg-red-100 p-2.5 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                  <path d="M12 9v4"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {cancelModal.data.modalTitle}
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                {cancelModal.data.message}
              </p>

              {/* EĞER 12 SAATTEN AZ KALDIYSA (Penalty durumu) SEBEP ALANINI GÖSTER */}
              {cancelModal.data.cancelType === "penalty" && (
                <div className="space-y-4">
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-red-700 font-medium text-sm">
                      Penalty Amount:
                    </span>
                    <span className="text-red-700 font-bold text-lg">
                      -100.00 TL
                    </span>
                  </div>

                  {/* SEBEP TEXTAREA ALANI */}
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Reason for Cancellation{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Explain why you need to cancel this session..."
                      className="w-full bg-gray-50 border text-black border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all resize-none min-h-[100px]"
                      rows="3"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Since there is less than 12 hours left, a reason is
                      mandatory.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setCancelModal({ open: false, data: null });
                  setCancelReason(""); // Modal kapanınca içeriği temizle
                }}
                className="px-5 py-2.5 text-gray-600 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm"
                disabled={cancelLoading}
              >
                {cancelModal.data.cancelType === "forbidden"
                  ? "Close"
                  : "Cancel"}
              </button>

              {cancelModal.data.cancelType !== "forbidden" && (
                <button
                  onClick={confirmCancel}
                  disabled={cancelLoading}
                  className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 text-sm shadow-lg shadow-red-200"
                >
                  {cancelLoading ? (
                    <>
                      <FiRefreshCw className="animate-spin" /> Processing...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <ShareComp
        isOpen={shareModalData.open}
        onClose={() => setShareModalData({ ...shareModalData, open: false })}
        shareUrl={shareModalData.url}
        title={shareModalData.title}
      />
      <DocumentPopup
        isOpen={docModalData.open}
        onClose={() => setDocModalData({ ...docModalData, open: false })}
        title={docModalData.title}
        content={docModalData.content}
      />
      {sessionList.map((item, i) => {
        // Eğer dışarıdan gelen status 'active' ise, hem 'active' hem 'cancellation_requested' olanları göster.
        // Diğer durumlarda (awaiting, completed vb.) sadece birebir eşleşenleri göster.
        const isVisible =
          status === "active"
            ? item.status === "active" ||
              item.status === "cancellation_requested"
            : item.status === status;

        return (
          isVisible && (
            <div key={item.id || i} className="space-y-4 relative my-2">
              <article className="session-card-trigger relative bg-white shadow-md overflow-hidden flex flex-col md:flex-row p-4 md:p-5 rounded-2xl border border-gray-100">
                {item.status === "cancellation_requested" && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-grayscale-[0.8] backdrop-blur-[1px] transition-all duration-300">
                    {/* Ortadaki Uyarı Kartı */}
                    <div className="bg-white/95 border border-orange-200 shadow-2xl rounded-xl p-5 flex flex-col items-center text-center max-w-[260px] animate-in zoom-in-95 duration-200">
                      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-3 relative">
                        <div className="absolute inset-0 bg-orange-400 rounded-full opacity-20 animate-ping"></div>
                        <FiClock className="text-orange-500 text-2xl" />
                      </div>

                      <h4 className="text-gray-900 font-bold text-sm uppercase tracking-tight">
                        Cancellation Pending
                      </h4>

                      <p className="text-gray-500 text-[11px] mt-1 leading-snug px-2">
                        Admin is reviewing your request. You can still withdraw
                        it.
                      </p>

                      {/* --- YENI: GERİ ÇEKME BUTONU --- */}
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Sayfa yenilemeyi önler
                          e.stopPropagation(); // KARTIN TIKLANMASINI ÖNLER (404 Çözümü)
                          setWithdrawModal({
                            isOpen: true,
                            sessionId: item.id,
                          }); // Modalı açar
                        }}
                        className="mt-4 w-full py-2 bg-gray-900 hover:bg-black text-white text-[10px] font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                      >
                        <FiXCircle size={14} /> WITHDRAW REQUEST
                      </button>
                      <div className="mt-3 px-3 py-1 bg-gray-100 rounded-full text-[9px] text-gray-400 font-mono tracking-widest">
                        LOCKED
                      </div>
                    </div>
                  </div>
                )}
                {/* --- WITHDRAW MODAL (GLOBAL OLARAK SAYFANIN EN ALTINDA DURMALI) --- */}
                {/* --- WITHDRAW MODAL (GLOBAL POSITIONED AT BOTTOM) --- */}
                {withdrawModal.isOpen && (
                  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                      className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-200"
                      onClick={(e) => e.stopPropagation()} // Prevent modal close on click inside
                    >
                      {/* İkon: Sarı/Yellow Tonlarında */}
                      <div className="w-16 h-16 bg-yellow-50 text-yellow-600 border border-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiRefreshCw size={32} />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900">
                        Are you sure?
                      </h3>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        You are about to withdraw your cancellation request.
                        Your session will become <b>Active</b> again.
                      </p>

                      <div className="mt-8 flex flex-col gap-3">
                        {/* ONAY BUTONU: Siyah/Black (Marka Rengi) */}
                        <button
                          disabled={withdrawLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmWithdraw();
                          }}
                          className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                        >
                          {withdrawLoading ? (
                            <span className="flex items-center gap-2">
                              <FiRefreshCw className="animate-spin" />{" "}
                              Processing...
                            </span>
                          ) : (
                            <>
                              <FiCheck /> Yes, Withdraw It
                            </>
                          )}
                        </button>

                        {/* VAZGEÇ BUTONU: Gri/Gray */}
                        <button
                          disabled={withdrawLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            setWithdrawModal({
                              isOpen: false,
                              sessionId: null,
                            });
                          }}
                          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold text-sm transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isSessionCompleted(item) &&
                  !dismissedSessionIds.includes(item.id) && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[3px] rounded-2xl animate-in fade-in duration-500">
                      <button
                        onClick={(e) => handleDismissOverlay(item.id, e)}
                        className="absolute top-3 right-3 p-2 bg-white border border-gray-200 text-gray-400 hover:text-red-500 rounded-full shadow-sm z-30 cursor-pointer"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <div className="mb-4 text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 mb-2 bg-[#FFD207] text-black rounded-full shadow-sm">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>
                        <h3 className="text-gray-900 font-bold text-lg leading-tight">
                          Time's Up!
                        </h3>
                        <p className="text-gray-600 text-xs font-medium">
                          Waiting for confirmation
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsModalOpen(true);
                          setSessionToReview(item);
                        }}
                        className="px-8 py-3 font-bold text-white bg-black rounded-xl hover:bg-gray-800 transition-all cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    </div>
                  )}

                {isSessionCompleted(item) &&
                  dismissedSessionIds.includes(item.id) && (
                    <button
                      onClick={(e) => handleRestoreOverlay(item.id, e)}
                      className="absolute top-3 right-3 z-20 flex items-center justify-center w-10 h-10 bg-[#FFD207] text-black rounded-full shadow-lg animate-bounce cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </button>
                  )}

                {/* --- SOL TARAF: RESİM --- */}
                <div className="w-full md:w-64 h-48 md:h-52 relative flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={item.google_cafe.image}
                    alt={item.google_cafe.name}
                    className="w-full h-full object-cover"
                    fill
                  />
                </div>

                {/* --- ORTA TARAF: İÇERİK --- */}
                <div className="flex-1 md:px-5 py-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {item.session_title}
                      </h3>
                      <p className="text-md font-semibold text-gray-800 mt-0.5">
                        {item.google_cafe.name}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-sm text-gray-600 leading-snug line-clamp-1">
                        {item.google_cafe.address}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        {item.google_cafe.phone}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">Instructor:</span>{" "}
                        {data?.first_name} {data?.last_name}
                      </p>
                      {/* Kotayı buraya (Instructor yanına) aldım, mobilde çok şık durur */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-500 font-mono">
                          ({item.users_count || 0}/{item.quota})
                        </span>
                        {renderQuotaIcons(item.users_count, item.quota)}
                      </div>
                    </div>
                  </div>

                  {/* BUTONLAR ALANI */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.google_cafe.map_url, "_blank");
                      }}
                      className="flex items-center gap-1 cursor-pointer hover:underline text-sm font-medium"
                    >
                      <IoLocationSharp className="text-xl text-[#fdd207]" />
                      <span className="text-gray-600">Location</span>
                    </div>

                    {status === "active" && (
                      <button
                        onClick={(e) => handleShareClick(e, item)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold border border-blue-100"
                      >
                        <FiShare2 size={12} /> Share
                      </button>
                    )}

                    {status === "active" && (
                      <button
                        onClick={(e) => handleDocumentClick(e, item)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[11px] font-bold border border-green-100"
                      >
                        <FiFileText size={12} /> Materials
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleCard(item)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                        openCourseInfo?.id === item.id
                          ? "bg-black text-white"
                          : "bg-[#FFD207] text-black border-[#FFD207]"
                      }`}
                    >
                      <span>
                        {openCourseInfo?.id === item.id
                          ? "Hide"
                          : "Participants"}
                      </span>
                      <FaChevronRight
                        className={`transition-transform ${openCourseInfo?.id === item.id ? "rotate-90" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* --- SAĞ TARAF: ZAMAN BİLGİSİ --- */}
                {/* Mobilde alta düşer ama md:w-32 ile genişliği sabitlenir, flex-col ile hizalanır */}
                <div className="flex flex-row md:flex-col items-center justify-between md:justify-center p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none gap-3 md:min-w-[120px] border-t md:border-t-0 md:border-l border-gray-100">
                  <div className="flex md:flex-col items-center gap-2 md:gap-1">
                    <div className="bg-[#FFD207] w-10 h-10 md:w-12 md:h-12 rounded-md flex flex-col items-center justify-center shadow-sm">
                      <span className="font-bold text-black text-sm md:text-md">
                        1
                      </span>
                      <span className="text-[8px] md:text-[10px] text-black font-bold uppercase">
                        hour
                      </span>
                    </div>
                    <p className="text-black font-bold text-xs md:text-sm hidden sm:block">
                      Duration
                    </p>
                  </div>

                  <div className="flex flex-col items-end md:items-center text-[11px] md:text-sm text-gray-700 font-medium">
                    <div className="flex items-center gap-1.5">
                      <FiCalendar className="text-[#fdd207]" />
                      <span>{formatDate(item.session_date, "short")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiClock className="text-[#fdd207]" />
                      <span>{formatTime(item.session_date)}</span>
                    </div>
                  </div>

                  {/* Düzenle/Sil - Sadece awaiting durumunda */}
                  {item.status === "awaiting" && (
                    <div className="flex items-center gap-3 md:mt-2 md:pt-2 md:border-t w-full justify-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 p-1"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRequest(item.id);
                        }}
                        className="text-red-600 p-1"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                  {status === "active" &&
                    (() => {
                      // Zaman kontrolü: session_date ile şu an arasındaki farkı hesapla
                      const sessionTime = new Date(item.session_date).getTime();
                      const now = new Date().getTime();
                      const diffInHours =
                        (sessionTime - now) / (1000 * 60 * 60);

                      // Eğer derse 1 saatten fazla varsa butonu göster
                      if (diffInHours > 1) {
                        return (
                          <button
                            onClick={(e) => {
                              if (item.status === "cancellation_requested")
                                return;
                              handleCancelClick(e, item);
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors
          ${
            item.status === "cancellation_requested"
              ? "bg-orange-50 text-orange-600 border-orange-100 cursor-default"
              : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100 cursor-pointer"
          }
        `}
                          >
                            {item.status === "cancellation_requested" ? (
                              <>
                                <FiClock size={14} /> Pending
                              </>
                            ) : (
                              <>
                                <FiXCircle size={14} /> Cancel
                              </>
                            )}
                          </button>
                        );
                      }

                      // 1 saatten az kaldıysa hiçbir şey dönme (buton gizlenir)
                      return null;
                    })()}
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
                    className={`absolute  top-6 right-6 p-2 rounded-full transition-all duration-200 group
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

                  <div className="flex justify-center items-center w-min  rounded-full p-3 py-4 bg-yellow-300 max-sm:w-[-webkit-fill-available] px-20">
                    <h2 className="text-xl font-bold max-md:text-lg text-black">
                      Participants
                    </h2>
                  </div>

                  {usersLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="w-full max-w-4xl mt-4">
                      {selectedSessionUsers &&
                      selectedSessionUsers.length > 0 ? (
                        <Slider
                          {...sliderSettings}
                          key={usersLoading ? "loaded" : "loading"}
                          className="w-full"
                        >
                          {selectedSessionUsers.map((user, idx) => {
                            // 1. Onay durumunu kontrol et
                            const isConfirmed =
                              user.attendance_code_confirm === 1;

                            return (
                              <div key={idx} className="outline-none px-2">
                                {/* Tooltip için 'group' class'ını buraya ekliyoruz ki hover algılansın */}
                                <div
                                  className={`w-full flex flex-col justify-center items-center py-2 px-1 transition-all relative group
            ${isConfirmed ? "cursor-default" : "cursor-pointer"}
          `}
                                >
                                  {/* --- TOOLTIP (Sadece Onaylanmamışsa Görünür) --- */}
                                  {!isConfirmed && (
                                    <div className="absolute  top-12 left-1/2 transform -translate-x-1/2 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none text-center shadow-lg">
                                      Student's QR code attendance has not been
                                      taken, therefore you will not receive
                                      payment for this user.
                                      {/* Tooltip Ok İşareti (Aşağı bakan üçgen) */}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                  )}

                                  {/* Resim Kapsayıcısı */}
                                  <div
                                    onClick={() => {
                                      if (status === "active" && !isConfirmed) {
                                        userConfirmHandler(user);
                                      }
                                    }}
                                    className={`relative w-20 h-20 transition-transform ${
                                      !isConfirmed && "group-hover:scale-105"
                                    }`}
                                  >
                                    <Image
                                      src={
                                        user?.profile_image ||
                                        user?.avatar ||
                                        userimage
                                      }
                                      alt={user?.name}
                                      fill
                                      // Onaylıysa Yeşil, Değilse Kırmızı Çerçeve (Çarpı ile uyumlu olması için)
                                      className={`rounded-full object-cover border-4 
                ${isConfirmed ? "border-green-500" : "border-red-500"}
              `}
                                    />

                                    {/* --- İKONLAR (SAĞ ÜST KÖŞE) --- */}
                                    <div
                                      className={`absolute -top-1 -right-1 text-white rounded-full p-1 z-10 border-2 border-white shadow-sm
                ${isConfirmed ? "bg-green-500" : "bg-red-500"}
              `}
                                    >
                                      {isConfirmed ? (
                                        // YEŞİL TİK İKONU
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
                                      ) : (
                                        // KIRMIZI ÇARPI (X) İKONU
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="w-4 h-4"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                    </div>
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
        );
      })}
    </div>
  );
};

export default CourseSessionCard;
