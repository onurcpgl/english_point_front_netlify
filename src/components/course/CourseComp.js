"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../loading/Loading";
import CourseBannerImage from "../../assets/course/course-banner-image.png";
import { useSession } from "next-auth/react";

function CourseComp() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.role === "user") {
      router.replace("/course-sessions");
    } else if (session?.user?.role === "instructor") {
      router.replace("/course-sessions");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    // Mobilde h-screen iptal edildi (min-h-screen), içerik sığmazsa scroll açılır.
    // Masaüstünde dikey ortalama (items-center) korundu.
    <div className="relative w-full min-h-screen bg-[#FFD207] flex items-center">
      {/* Container: Mobilde dikey padding (py-12), masaüstünde padding yok */}
      <div className="container mx-auto px-6 py-12 lg:px-0 lg:py-0">
        {/* Flex Yapısı: Mobilde alt alta (col), Masaüstünde yan yana (row) */}
        {/* gap-10 ile mobilde resim ve yazı arasına boşluk koyduk */}
        <div className="w-full h-full flex flex-col-reverse lg:flex-row justify-between items-center gap-10 lg:gap-5">
          {/* --- Sol Taraf (Yazılar) --- */}
          {/* Mobilde %100 genişlik ve ortalı yazı, Masaüstünde %50 genişlik ve sola dayalı */}
          <div className="w-full lg:w-1/2 text-center lg:text-left text-black leading-snug">
            {/* Font boyutları responsive yapıldı: text-3xl -> lg:text-[40px] */}
            <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold">
              <span className="block">Bölgenizdeki en yakın</span>
              <span className="block">{`"English Point"i keşfedin!`}</span>
            </h1>

            <p className="font-light text-base md:text-lg lg:text-xl mt-4 px-2 lg:px-0">
              {`Sana en yakın EnglishPoint'te native-speaker eşliğinde, hem yeni
              arkadaşlar edin, hem İngilizceyi konuşarak öğren!`}
            </p>

            {/* Buton ortalama ayarı (mx-auto lg:mx-0) */}
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
          {/* Mobilde %100, Masaüstünde %50 */}
          <div className="w-full lg:w-1/2 flex justify-center items-center p-0 lg:p-5">
            <Image
              // w-full h-auto: Resmin orantısını koruyarak bulunduğu alana sığmasını sağlar
              className="w-4/5 md:w-3/5 lg:w-full h-auto object-contain"
              src={CourseBannerImage}
              alt="English Point Banner"
              priority // Banner resmi olduğu için öncelik verdik
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseComp;
