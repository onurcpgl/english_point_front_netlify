"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react"; // 1. Suspense eklendi
import Loading from "../loading/Loading";
import CourseBannerImage from "../../assets/course/course-banner-image.png";
import { useSession } from "next-auth/react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import SessionDetailModal from "../course-sessions/sessionDetailModal/SessionDetailModal";
import generalService from "../../utils/axios/generalService";

// 2. İsim Değişikliği: Asıl kodları "CourseContent" adında bir fonksiyona aldık
function CourseContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams(); // Hata veren arkadaş artık güvende
  const params = useParams();
  const [sessionDetailCompModal, setSessionDetailCompModal] = useState(false);
  const [sessionDetailData, setSessionDetailData] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.role === "user") {
      router.replace("/course-sessions");
    } else if (session?.user?.role === "instructor") {
      router.replace("/course-sessions");
    }
  }, [session, status, router]);
  // CourseComp.js içindeki CourseContent'e ekle

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
          // 2. API İsteği
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
  };

  // SEO ve Meta Tag Manipülasyonu
  useEffect(() => {
    if (sessionDetailCompModal && sessionDetailData?.data) {
      const session = sessionDetailData.data;
      const cafeName = session.google_cafe?.name || "English Point";
      const instructorName = `${session.instructor?.first_name || ""} ${session.instructor?.last_name || ""}`;
      const titleText = `${session.session_title} | English Point`;
      const descriptionText = `${cafeName} - Eğitmen: ${instructorName}`;
      const imageUrl = session.google_cafe?.image;

      // 1. Tarayıcı Sekme Başlığı
      document.title = titleText;

      // 2. Meta Açıklama
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", descriptionText);

      // 3. OpenGraph (WhatsApp/Insta Paylaşım Resmi)
      const updateMeta = (property, content) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute("property", property);
          document.head.appendChild(el);
        }
        el.setAttribute("content", content);
      };

      updateMeta("og:title", titleText);
      updateMeta("og:description", descriptionText);
      if (imageUrl) {
        updateMeta("og:image", imageUrl);
        updateMeta("og:image:width", "1200");
        updateMeta("og:image:height", "630");
      }
    }
  }, [sessionDetailCompModal, sessionDetailData]);
  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="relative w-full min-h-screen bg-[#FFD207] flex items-center">
      <SessionDetailModal
        isOpen={sessionDetailCompModal}
        onClose={handleCloseModal}
        session={sessionDetailData?.data}
        user={false}
      />
      <div className="container mx-auto px-6 py-12 lg:px-0 lg:py-0">
        <div className="w-full h-full flex flex-col-reverse lg:flex-row justify-between items-center gap-10 lg:gap-5">
          {/* --- Sol Taraf (Yazılar) --- */}
          <div className="w-full lg:w-1/2 text-center lg:text-left text-black leading-snug">
            <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold">
              <span className="block">Bölgenizdeki en yakın</span>
              <span className="block">{`"English Point"i keşfedin!`}</span>
            </h1>

            <p className="font-light text-base md:text-lg lg:text-xl mt-4 px-2 lg:px-0">
              {`Sana en yakın EnglishPoint'te native-speaker eşliğinde, hem yeni
              arkadaşlar edin, hem İngilizceyi konuşarak öğren!`}
            </p>

            <Link
              href="find-session"
              className="inline-flex items-center justify-center text-base lg:text-lg mt-6 lg:mt-5 bg-black text-white px-6 py-3 rounded-full hover:scale-105 transition-all cursor-pointer mx-auto lg:mx-0"
            >
              <span className="whitespace-nowrap">
                Sana uygun eğitimleri bul!
              </span>
            </Link>
          </div>

          {/* --- Sağ Taraf (Resim) --- */}
          <div className="w-full lg:w-1/2 flex justify-center items-center p-0 lg:p-5">
            <Image
              className="w-4/5 md:w-3/5 lg:w-full h-auto object-contain"
              src={CourseBannerImage}
              alt="English Point"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Ana Export: Kodları Suspense ile paketleyip gönderiyoruz
export default function CourseComp() {
  return (
    <Suspense fallback={<Loading />}>
      <CourseContent />
    </Suspense>
  );
}
