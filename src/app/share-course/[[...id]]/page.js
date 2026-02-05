import React from "react";
// Import yollarını kontrol et
import SessionDetailModal from "../../../components/course-sessions/sessionDetailModal/SessionDetailModal";
import generalService from "../../../utils/axios/generalService";

const FALLBACK_IMAGE =
  "https://api.englishpoint.com.tr/public/google_cafe/google_cafe_image.jpg";

/**
 * 1. SERVER SIDE METADATA
 * Next.js 15+ uyumlu: params bir Promise olduğu için await ediyoruz.
 */
export async function generateMetadata(props) {
  // DÜZELTME BURADA: params'ı await ile çözüyoruz
  const params = await props.params;

  // Route yapın [[...id]] olduğu için id dizi gelir (örn: ['123']). İlkini alıyoruz.
  const idArray = params?.id;
  const id = Array.isArray(idArray) ? idArray[0] : idArray;

  if (!id) return { title: "English Point" };

  try {
    const result = await generalService.getCourseSessionSingle(id);
    const session = result?.data;

    if (!session) return { title: "English Point" };

    const title = session.session_title || "English Point Session";
    const cafeName = session.google_cafe?.name || "English Point";
    const instructorName = `${session.instructor?.first_name || ""} ${session.instructor?.last_name || ""}`;
    const description = `${cafeName} - Eğitmen: ${instructorName}`;
    const imageUrl = session.google_cafe?.image || FALLBACK_IMAGE;

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [{ url: imageUrl }],
      },
    };
  } catch (error) {
    return { title: "English Point", openGraph: { images: [FALLBACK_IMAGE] } };
  }
}

/**
 * 2. SERVER SIDE PAGE
 * Next.js 15+ uyumlu: params bir Promise olduğu için await ediyoruz.
 */
export default async function ShareCoursePage(props) {
  // DÜZELTME BURADA: params'ı await ile çözüyoruz
  const params = await props.params;

  // Route yapın [[...id]] olduğu için id dizi gelir. İlkini alıyoruz.
  const idArray = params?.id;
  const id = Array.isArray(idArray) ? idArray[0] : idArray;

  let sessionData = null;

  if (id) {
    try {
      const result = await generalService.getCourseSessionSingle(id);
      sessionData = result?.data;
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-[#FFD207] flex items-center justify-center">
      {sessionData ? (
        <SessionDetailModal isOpen={true} session={sessionData} user={false} />
      ) : (
        <div className="text-black font-bold animate-pulse">Yükleniyor...</div>
      )}
    </div>
  );
}
