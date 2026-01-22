import Talking from "../../components/talking/Talking";
import HomeBannerSecond from "../../components/homeBanner/HomeBannerSecond";
import HowItWorks from "../../components/howItWorks/HowItWorks";
import SpeechBlock from "../../components/speechblock/SpeechBlock";
const baseUrl = process.env.NEXTAUTH_URL;

export const metadata = {
  title: "Kafede İngilizce Pratik Yap & Sosyalleş | English Point",
  description:
    "En yakın kafede Native Speaker veya İngilizce öğretmeniyle sosyalleşerek pratik yapın. English Point ile konuşma özgüveninizi hemen artırın!",
  alternates: {
    canonical: `${baseUrl}`, // Ana sayfa olduğu için direkt base URL
  },
  openGraph: {
    title: "English Point | Kafede İngilizce Pratik & Sosyalleşme",
    description:
      "Native Speaker eşliğinde, sana en yakın kafede İngilizce konuşmaya başla!",
    url: baseUrl, // og:url
    siteName: "English Point",
    locale: "tr_TR",
    type: "website", // og:type
    images: [
      {
        url: `https://api.englishpoint.com.tr/public/google_cafe/google_cafe_image.jpg`, // og:image (Bu dosya public klasöründe olmalı)
        width: 1200,
        height: 630,
        alt: "English Point Sosyal Medya Önizlemesi",
      },
    ],
  },
};
export default function Home() {
  return (
    <div className="bg-white">
      <HomeBannerSecond />
      <Talking />
      <HowItWorks />
      <SpeechBlock />
    </div>
  );
}
