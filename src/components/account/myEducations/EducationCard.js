import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  IoLocationSharp,
  IoDocumentText,
  IoVideocam,
  IoMusicalNotes,
} from "react-icons/io5";
import {
  FiCalendar,
  FiClock,
  FiInfo,
  FiMoreVertical,
  FiTrash2,
  FiAlertCircle,
  FiSend,
  FiLoader,
  FiArrowLeft,
} from "react-icons/fi";
import "react-calendar/dist/Calendar.css";
import { QrCode } from "lucide-react";
import EnterCard from "../../account/myEducations/EnterCard";
import { formatDate, formatTime } from "../../../utils/helpers/formatters";
import generalService from "../../../utils/axios/generalService";

// --- MODAL IMPORTLARI ---
// (Dosya yollarını kendi proje yapına göre düzenle)
import ErrorModal from "../../ui/ErrorModal/ErrorModal";
import ConfirmModal from "../../ui/ConfirmModal/ConfirmModal";
import SuccessModal from "../../ui/SuccesModal/SuccesMessageComp";
const CANCELLED_STATUSES = [
  "canceled_by_user",
  "canceled_by_admin",
  "no_show",
  "instructor_absent",
];
const EducationCard = ({ data }) => {
  const [openEnterDoc, setOpenEnterDoc] = useState({
    status: false,
    doc: null,
  });

  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [cancelLoadingBtn, setcancelLoadingBtn] = useState(false);
  // Input State'leri
  const [isInputMode, setIsInputMode] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // --- MODAL STATE YÖNETİMİ ---
  const [modalState, setModalState] = useState({
    error: { open: false, message: "" },
    success: { open: false, message: "" },
    confirm: { open: false, message: "", onConfirm: null },
  });

  const openCourseRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest(".prevent-close")) {
        return;
      }
      closeMenu();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMenu = () => {
    setActiveMenuId(null);
    setIsInputMode(false);
    setCancelReason("");
  };

  // --- 12 SAAT KURALI ---
  const checkCancellationStatus = (sessionDate) => {
    const now = new Date();
    const session = new Date(sessionDate);
    const diffInHours = (session - now) / (1000 * 60 * 60);
    return diffInHours > 12;
  };

  // --- İLK TIKLAMA ---
  const handleInitialClick = (item, isDirectCancel) => {
    if (isDirectCancel) {
      // Direkt iptal ise onay modalını tetikle
      triggerConfirmModal(item, true, null);
    } else {
      // Talep ise inputu aç
      setIsInputMode(true);
    }
  };

  const checkCourseCancelStatus = async (courseSessionUserId) => {
    try {
      const response = await generalService.checkCancelStatus(
        courseSessionUserId
      );
      console.log("jkgfwıfjqwgfpqofqghwfpqw", response);

      return response;
    } catch (error) {
      console.error("İptal durumu kontrol hatası:", error);
      return null;
    }
  };

  // --- ONAY MODALINI TETİKLEME ---
  const triggerConfirmModal = (item, isDirectCancel, reasonText) => {
    const title =
      item.course_session.program?.title?.tr ||
      item.course_session.session_title;

    setModalState((prev) => ({
      ...prev,
      confirm: {
        open: true,
        message: `"${title}" eğitimi için kaydınızı iptal etmek istediğinize emin misiniz?`,
        onConfirm: () => {
          // Onay verilirse API isteğini at
          closeConfirmModal();
          executeApiRequest(item, isDirectCancel, reasonText);
        },
      },
    }));
  };

  const closeConfirmModal = () => {
    setModalState((prev) => ({
      ...prev,
      confirm: { ...prev.confirm, open: false },
    }));
  };

  // --- API İSTEĞİNİ ATAN FONKSİYON ---
  const executeApiRequest = async (item, isDirectCancel, reasonText) => {
    setcancelLoadingBtn(true);
    const payload = isDirectCancel ? {} : { reason: reasonText };

    try {
      const response = await generalService.canceledCourseByUser(
        item.course_session_id,
        payload
      );

      if (response.status) {
        setcancelLoadingBtn(false);
        // Başarılı Modalı Aç
        setModalState((prev) => ({
          ...prev,
          success: {
            open: true,
            message: response.message,
          },
        }));
        closeMenu();
      } else {
        // API status false dönerse Hata Modalı Aç
        showError(response.message || "Bir hata oluştu.");
      }
    } catch (error) {
      console.error("İptal işlemi hatası:", error);
      const errorMessage =
        error.response?.data?.message || "İşlem sırasında bir hata oluştu.";
      showError(errorMessage);
    }
  };

  // --- HATAYI GÖSTER ---
  const showError = (msg) => {
    setModalState((prev) => ({
      ...prev,
      error: { open: true, message: msg },
    }));
  };

  // --- BUTON AKSİYONU (INPUTLU VEYA INPUTSUZ) ---
  const handleFinalAction = (item, isDirectCancel, reasonText = null) => {
    if (isDirectCancel) {
      // Direkt iptal için onayı yukarıda handleInitialClick içinde tetikliyoruz aslında,
      // ama burası input modundan gelmeyebilir diye yine de bağlayalım.
      triggerConfirmModal(item, true, null);
    } else {
      // Talep Modu: Input kontrolü
      if (!reasonText || reasonText.trim() === "") {
        showError("Lütfen bir iptal nedeni belirtiniz.");
        return;
      }
      // Talep için API isteği (Direkt gönderiyoruz, onay sormaya gerek yok inputtan sonra)
      executeApiRequest(item, false, reasonText);
    }
  };

  return (
    <div>
      <EnterCard
        open={openEnterDoc.status}
        message={"Eğitime Katılım Belgeniz"}
        setOpenEnterDoc={setOpenEnterDoc}
        doc={openEnterDoc.doc}
      />

      {/* --- MODALLAR --- */}
      <ErrorModal
        open={modalState.error.open}
        message={modalState.error.message}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            error: { ...prev.error, open: false },
          }))
        }
      />

      <SuccessModal
        open={modalState.success.open}
        message={modalState.success.message}
        onClose={() => {
          // Başarı modalı kapandığında sayfayı yenile
          setModalState((prev) => ({
            ...prev,
            success: { ...prev.success, open: false },
          }));
          window.location.reload();
        }}
      />

      <ConfirmModal
        open={modalState.confirm.open}
        message={modalState.confirm.message}
        onConfirm={modalState.confirm.onConfirm}
        onCancel={closeConfirmModal}
      />
      {data?.map((item, i) => {
        const program = item?.course_session?.program;
        const isOpen = activeCourseId === item.id;
        const isMenuOpen = activeMenuId === item.id;

        const canDirectCancel = checkCancellationStatus(
          item?.course_session?.session_date
        );
        const isActiveSession = item?.course_session?.status === "active";
        const isCancelled = CANCELLED_STATUSES.includes(item.attendance_status);
        return (
          <div
            key={i}
            className={`space-y-4 relative my-6 transition-all ${
              isMenuOpen ? "z-40" : "z-0"
            }`}
          >
            {/* --- KARTIN ANA GÖVDESİ --- */}
            <article className="relative bg-white shadow-lg rounded-3xl flex flex-col md:flex-row border border-gray-100 transition-transform hover:shadow-xl overflow-visible">
              {/* --- 3 NOKTA MENÜSÜ --- */}
              {!isCancelled && isActiveSession && (
                <div className="absolute top-4 right-4 z-50 prevent-close">
                  <button
                    // 1. Eğer şu an bu item yükleniyorsa butonu pasif yap
                    disabled={loadingId === item.id}
                    onClick={async () => {
                      // Menü zaten açıksa kapat (API'ye gitmeye gerek yok)
                      if (isMenuOpen) {
                        closeMenu();
                        return;
                      }

                      // 2. İşlem başlıyor, bu ID'yi loading durumuna al
                      setLoadingId(item.id);

                      try {
                        const response = await checkCourseCancelStatus(item.id);

                        if (response && response.can_cancel === true) {
                          setActiveMenuId(item.id);
                        } else {
                          setModalState((prev) => ({
                            ...prev,
                            error: {
                              open: true,
                              message:
                                response?.message ||
                                "Bu işlem için yetkiniz bulunmuyor.",
                            },
                          }));
                        }
                      } catch (error) {
                        console.error("İşlem hatası:", error);
                      } finally {
                        // 3. İşlem bitti (başarılı veya hatalı), loading'i kapat
                        setLoadingId(null);
                      }
                    }}
                    // Görsel olarak butonun pasif olduğunu hissettir (opacity-50 ve cursor-not-allowed)
                    className={`p-2 rounded-full transition-colors shadow-sm backdrop-blur-sm border border-transparent 
    ${
      loadingId === item.id
        ? "bg-gray-100 text-gray-400 cursor-not-allowed" // Yüklenirken gri ve tıklanmaz
        : "bg-white/60 hover:bg-white text-gray-600 hover:text-black hover:border-gray-200 cursor-pointer" // Normal hali
    }`}
                  >
                    {/* Yükleniyorsa dönen bir ikon göster, yoksa normal ikonu göster */}
                    {loadingId === item.id ? (
                      // Basit bir Loading Spinner (Dönen daire)
                      <svg
                        className="animate-spin h-[22px] w-[22px]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FiMoreVertical size={22} />
                    )}
                  </button>

                  {/* AÇILIR MENÜ */}
                  {isMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200 z-[60]"
                    >
                      {/* Bilgi / Politika Alanı */}
                      <div className="bg-gray-50/80 p-4 border-b border-gray-100 flex gap-3 items-start">
                        <div className="mt-0.5 text-blue-500 bg-blue-50 p-1 rounded-full shrink-0">
                          <FiInfo size={14} />
                        </div>
                        <div className="text-sm text-gray-500 leading-relaxed">
                          <span className="font-bold text-gray-800 block mb-1">
                            İptal Politikası
                          </span>
                          {canDirectCancel
                            ? "Eğitime 12 saatten fazla var. Koşulsuz iptal edebilirsiniz."
                            : "Eğitime 12 saatten az kaldı. İptal için talep oluşturmanız gerekmektedir."}
                        </div>
                      </div>

                      {/* --- İÇERİK ALANI --- */}
                      <div className="p-2">
                        {/* DURUM 1: Talep Formu (Input Mode) */}
                        {isInputMode ? (
                          <div className="flex flex-col gap-2 p-1 animate-in slide-in-from-right-5 duration-200">
                            <div className="flex items-center justify-between mb-1 px-1">
                              <span className="text-sm font-bold text-gray-600 flex items-center gap-1">
                                <FiAlertCircle /> Talep Oluştur
                              </span>
                              <button
                                onClick={() => setIsInputMode(false)}
                                className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1"
                              >
                                <FiArrowLeft /> Geri
                              </button>
                            </div>

                            <textarea
                              autoFocus
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              placeholder="Lütfen iptal nedeninizi yazınız..."
                              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 resize-none min-h-[80px]"
                            />

                            <button
                              onClick={() =>
                                handleFinalAction(item, false, cancelReason)
                              }
                              // Hem input boşsa HEM DE yükleme işlemi sürüyorsa butonu disable yapıyoruz
                              disabled={
                                !cancelReason.trim() || cancelLoadingBtn
                              }
                              className="w-full mt-1 bg-black hover:bg-gray-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                              {cancelLoadingBtn ? (
                                /* Yükleme Durumu: Dönen ikon ve mesaj */
                                <>
                                  <FiLoader
                                    className="animate-spin"
                                    size={14}
                                  />
                                  <span>Gönderiliyor...</span>
                                </>
                              ) : (
                                /* Normal Durum: Gönder yazısı ve ikonu */
                                <>
                                  <span>Gönder</span>
                                  <FiSend size={14} />
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          /* DURUM 2: Normal Buton */
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInitialClick(item, canDirectCancel);
                            }}
                            className={`w-full group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 border ${
                              canDirectCancel
                                ? "bg-white border-transparent hover:border-red-100 hover:bg-red-50/50"
                                : "bg-white border-transparent hover:border-gray-100 hover:bg-gray-50/50"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                canDirectCancel
                                  ? "bg-red-50 text-red-500 group-hover:bg-red-100 group-hover:text-red-600"
                                  : "bg-gray-50 text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600"
                              }`}
                            >
                              {canDirectCancel ? (
                                <FiTrash2 size={20} />
                              ) : (
                                <FiAlertCircle size={20} />
                              )}
                            </div>

                            <div className="flex flex-col items-start text-left">
                              <span
                                className={`text-sm font-bold transition-colors ${
                                  canDirectCancel
                                    ? "text-gray-700 group-hover:text-red-700"
                                    : "text-gray-700 group-hover:text-gray-700"
                                }`}
                              >
                                {canDirectCancel
                                  ? "Katılımı İptal Et"
                                  : "İptal Talebi Oluştur"}
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium mt-0.5 group-hover:text-gray-500 transition-colors">
                                {canDirectCancel
                                  ? "İşlem kalıcı olarak uygulanır"
                                  : "Neden belirterek talep açılır"}
                              </span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SOL TARAF: RESİM */}
              <div className="md:w-56 w-full h-56 md:h-auto shrink-0 relative overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                <Image
                  src={
                    item?.course_session?.google_cafe?.image ||
                    "https://via.placeholder.com/300"
                  }
                  alt={item.course_session?.google_cafe?.name}
                  className="w-full h-full object-cover"
                  fill
                />
                <div className="absolute top-3 left-3 bg-white text-black text-sm px-2.5 py-1 rounded-md backdrop-blur-sm font-medium">
                  {item?.course_session?.language_level}
                </div>
              </div>

              {/* ORTA KISIM: BİLGİLER */}
              <div className="flex-1 p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-black leading-tight pr-10">
                    {program?.title?.tr || item?.course_session?.session_title}
                  </h3>

                  <p className="text-base text-gray-600 mt-2 line-clamp-2">
                    {program?.description?.tr}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <p className="text-sm font-bold text-gray-900">
                      {item.course_session?.google_cafe?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.course_session?.google_cafe?.address}
                    </p>
                    <p className="text-sm text-gray-800 pt-1">
                      <span className="font-semibold text-amber-600">
                        Eğitmen:
                      </span>{" "}
                      {item?.course_session?.instructor?.first_name}{" "}
                      {item?.course_session?.instructor?.last_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 mt-auto">
                  <div
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${item?.course_session.google_cafe?.latitude},${item?.course_session.google_cafe?.longitude}`,
                        "_blank"
                      )
                    }
                    className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-gray-500 transition-colors group"
                  >
                    <IoLocationSharp className="text-xl text-gray-400 group-hover:text-gray-500 mr-1.5" />
                    <span className="underline decoration-dotted underline-offset-4">
                      Konumu Gör
                    </span>
                  </div>

                  {/* İptal DEĞİLSE butonu göster */}
                  {!isCancelled && (
                    <button
                      onClick={() => setActiveCourseId(isOpen ? null : item.id)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 gap-1.5 font-semibold ml-auto transition-transform active:scale-95"
                    >
                      <FiInfo className="text-xl" />
                      {isOpen ? "Detayı Gizle" : "Program Detayı"}
                    </button>
                  )}

                  {/* İstersen İptal durumunda buraya bir yazı koyabilirsin (Opsiyonel) */}
                  {isCancelled && (
                    <span className="ml-auto text-sm font-bold text-red-500 border border-red-200 bg-red-50 px-3 py-1 rounded-lg">
                      İPTAL EDİLDİ
                    </span>
                  )}
                </div>
              </div>

              {/* SAĞ KISIM: TARİH & QR */}
              <div className="flex flex-col items-center justify-between p-5 bg-gray-50 md:w-60 border-l border-gray-100 rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none">
                <div className="flex flex-col items-center gap-1 mb-2 pt-6 md:pt-0">
                  <div className="bg-[#FFD207] w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                    <span className="font-bold text-black text-lg">
                      {item.course_session?.duration_minutes / 60}
                    </span>
                    <span className="text-sm text-black -mt-1 font-medium">
                      saat
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-sm text-gray-600 gap-2.5 mb-4 w-full">
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm w-full justify-center">
                    <FiCalendar className="text-amber-500 text-lg" />
                    <span className="font-medium">
                      {formatDate(item.course_session?.session_date, "short")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm w-full justify-center">
                    <FiClock className="text-amber-500 text-lg" />
                    <span className="font-medium">
                      {formatTime(item.course_session?.session_date)}
                    </span>
                  </div>
                </div>

                {/* İptal DEĞİLSE Giriş Kodunu Göster */}
                {!isCancelled ? (
                  <div
                    onClick={() =>
                      setOpenEnterDoc({
                        status: true,
                        doc: { uniqueCode: item?.attendance_code },
                      })
                    }
                    className="w-full mt-auto group flex items-center justify-center gap-3 bg-[#FFD207] hover:bg-[#e6c200] transition-all px-4 py-3 rounded-xl cursor-pointer shadow-md hover:shadow-lg z-20 relative"
                  >
                    <div className="bg-white p-1.5 rounded-full flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5 text-[#FFD207] group-hover:text-[#e6c200] transition-colors" />
                    </div>
                    <span className="text-black font-bold text-sm whitespace-nowrap leading-tight">
                      Giriş Kodunu
                      <br />
                      Görüntüle
                    </span>
                  </div>
                ) : (
                  /* İPTAL İSE: Burayı boş bırakabilir veya gri bir kutu gösterebilirsin */
                  <div className="w-full mt-auto flex items-center justify-center gap-2 bg-gray-100 px-4 py-3 rounded-xl cursor-not-allowed opacity-70">
                    <FiAlertCircle className="text-gray-400" />
                    <span className="text-gray-500 font-bold text-sm">
                      Erişim Kapalı
                    </span>
                  </div>
                )}
              </div>
            </article>

            {/* --- DETAY ALANI --- */}
            <div
              className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100 mt-3"
                  : "grid-rows-[0fr] opacity-0 mt-0"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  ref={openCourseRef}
                  className="bg-white border border-gray-200 rounded-3xl p-8 shadow-inner"
                >
                  <div className="flex items-center gap-3 mb-5 border-b pb-4 border-gray-100">
                    <div className="bg-blue-100 p-2.5 rounded-full text-blue-600">
                      <FiInfo size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-black">
                      Eğitim Programı İçeriği
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                      <h4 className="font-bold text-lg text-gray-900">
                        {program?.title?.tr}
                      </h4>
                      <p className="text-base text-gray-600 leading-relaxed">
                        {program?.description?.tr ||
                          program?.description?.en ||
                          "Açıklama bulunmuyor."}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 space-y-4 h-fit">
                      <h5 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                        Materyaller
                      </h5>

                      {program?.video_url && (
                        <a
                          href={program.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                        >
                          <IoVideocam className="text-red-500 text-lg" />
                          <span>Eğitim Videosu</span>
                        </a>
                      )}

                      {program?.voice_path && (
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                          <IoMusicalNotes className="text-purple-500 text-lg" />
                          <span>Ses Kaydı Mevcut</span>
                        </div>
                      )}

                      {program?.document_path && (
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                          <IoDocumentText className="text-blue-500 text-lg" />
                          <span>Ders Dokümanı</span>
                        </div>
                      )}

                      {!program?.video_url &&
                        !program?.voice_path &&
                        !program?.document_path && (
                          <span className="text-sm text-gray-400 italic">
                            Ek materyal bulunmuyor.
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EducationCard;
