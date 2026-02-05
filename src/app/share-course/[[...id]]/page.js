import React from "react";
// Import yolunu senin klasör yapına göre ayarladım
import SessionDetailModal from "../../../components/course-sessions/sessionDetailModal/SessionDetailModal";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = process.env.NEXTAUTH_URL;

/**
 * 1. SERVER SIDE METADATA
 * Hata veren 'await params' kısmını kaldırdık.
 */
export async function generateMetadata({ params }) {
  // DÜZELTME: await params KALDIRILDI.
  // params.id dizisini güvenli bir şekilde alıyoruz.
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    return {
      title: "English Point",
      description: "İngilizce Konuşma Kulübü",
    };
  }

  try {
    const res = await fetch(`${apiUrl}api/course-sessions/${id}`, {
      cache: "no-store",
    });
    const result = await res.json();
    const session = result.data;

    if (!session) return { title: "English Point" };

    const title = session.session_title;
    const instructorName = `${session.instructor?.first_name || ""} ${session.instructor?.last_name || ""}`;
    const cafeName = session.google_cafe?.name || "English Point";
    const description = `${cafeName} - Eğitmen: ${instructorName}`;
    const imageUrl = session.google_cafe?.image;

    // Paylaşım Linki
    const shareUrl = `${baseUrl}/share-course/${id}`;

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        url: shareUrl,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: "website",
      },
    };
  } catch (error) {
    console.error("Metadata hatası:", error);
    return { title: "English Point" };
  }
}

/**
 * 2. SERVER SIDE PAGE
 */
export default async function ShareCoursePage({ params }) {
  // DÜZELTME: Burada da await kaldırıldı
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  let sessionData = null;

  if (id) {
    try {
      const res = await fetch(`${apiUrl}api/course-sessions/${id}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const result = await res.json();
        sessionData = result.data;
      }
    } catch (error) {
      console.error("Sayfa veri hatası:", error);
    }
  }
  console.log("sessionData", sessionData);
  return (
    <div className="relative w-full min-h-screen bg-[#FFD207] flex items-center justify-center">
      {/* Veri gelene kadar basit bir yükleniyor yazısı, sonra Modal açılır */}
      {!sessionData && (
        <div className="text-black font-bold animate-pulse">Yükleniyor...</div>
      )}

      <SessionDetailModal isOpen={true} session={sessionData} user={false} />
    </div>
  );
}
