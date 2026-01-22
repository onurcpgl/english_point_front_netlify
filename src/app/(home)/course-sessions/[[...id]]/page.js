import React from "react";
import ParentCourseComp from "../../../../components/parentCourseComp/ParentCourseComp";

const baseUrl = process.env.NEXTAUTH_URL;

export const metadata = {
  title: 'Bölgenizdeki en yakın "English Point"i keşfedin!',
  description:
    "Sana en yakın EnglishPoint'te native-speaker eşliğinde, hem yeni arkadaşlar edin, hem İngilizceyi konuşarak öğren!",
  alternates: {
    // Başına değişkeni koyup sonuna yolu ekliyoruz
    canonical: `${baseUrl}course-sessions`,
  },
};

export default function Page({ params }) {
  return <ParentCourseComp id={params.id} />;
}
