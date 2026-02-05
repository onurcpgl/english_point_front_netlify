import React from "react";
import { FiAlertCircle } from "react-icons/fi"; // İkon için (Eğer yüklü değilse kaldırabilirsin)
import SessionDetailModal from "../../../components/course-sessions/sessionDetailModal/SessionDetailModal";
import generalService from "../../../utils/axios/generalService";

// Fallback görsel
const FALLBACK_IMAGE =
  "https://api.englishpoint.com.tr/public/google_cafe/google_cafe_image.jpg";

/**
 * 1. SERVER SIDE METADATA
 */
export async function generateMetadata(props) {
  const params = await props.params;
  const idArray = params?.id;
  const id = Array.isArray(idArray) ? idArray[0] : idArray;

  const defaultTitle = "English Point";
  const defaultDesc = "İngilizce Konuşma Kulübü";

  if (!id) return { title: defaultTitle, description: defaultDesc };

  try {
    const result = await generalService.getCourseSessionSingle(id);
    const session = result?.data;

    // EĞER EĞİTİM YOKSA METADATA'DA DA BUNU BELLİ EDELİM
    if (!session) {
      return {
        title: "Eğitim Bulunamadı | English Point",
        description:
          "Aradığınız eğitim yayından kaldırılmış veya bulunamamıştır.",
        openGraph: { images: [FALLBACK_IMAGE] },
      };
    }

    const title = `${session.session_title} - ${session.google_cafe?.name || "English Point"}`;
    const instructorName = `${session.instructor?.first_name || ""} ${session.instructor?.last_name || ""}`;
    const dateStr = session.session_date
      ? new Date(session.session_date).toLocaleDateString("tr-TR")
      : "";
    const description = `Eğitmen: ${instructorName} ${dateStr ? `| Tarih: ${dateStr}` : ""} | Hemen Katıl!`;
    const imageUrl = session.google_cafe?.image || FALLBACK_IMAGE;

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        url: `https://englishpoint.com.tr/share-course/${id}`,
        siteName: "English Point",
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
        locale: "tr_TR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: defaultTitle,
      description: defaultDesc,
      openGraph: { images: [FALLBACK_IMAGE] },
    };
  }
}

/**
 * 2. SERVER SIDE PAGE
 */
export default async function ShareCoursePage(props) {
  const params = await props.params;
  const idArray = params?.id;
  const id = Array.isArray(idArray) ? idArray[0] : idArray;

  let sessionData = null;

  if (id) {
    try {
      const result = await generalService.getCourseSessionSingle(id);
      sessionData = result?.data;
    } catch (e) {
      console.error("Veri çekme hatası:", e);
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-[#FFD207] flex items-center justify-center p-4">
      {/* DURUM 1: Session Verisi VARSA -> Modalı Aç
       */}
      {sessionData ? (
        <SessionDetailModal isOpen={true} session={sessionData} user={false} />
      ) : (
        /* DURUM 2: Session Verisi YOKSA -> "Eğitim Bulunamadı" Kutusunu Göster
           Server Component olduğu için "Yükleniyor" demeye gerek yok, veri yoksa direkt bu çıkar.
        */
        <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
          <div className="bg-yellow-100 p-4 rounded-full mb-4">
            {/* İkon kullanmıyorsan buradaki FiAlertCircle'ı silebilirsin */}
            <FiAlertCircle className="w-12 h-12 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Eğitim Bulunamadı
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Aradığınız eğitim silinmiş, süresi dolmuş veya bağlantı hatalı
            olabilir.
          </p>
          <a
            href="/" // Anasayfa linkin neyse ona göre düzenle
            className="bg-[#FFD207] hover:bg-[#e6bd06] text-black font-bold py-3.5 px-8 rounded-full transition-transform active:scale-95 w-full block"
          >
            Anasayfaya Dön
          </a>
        </div>
      )}
    </div>
  );
}
