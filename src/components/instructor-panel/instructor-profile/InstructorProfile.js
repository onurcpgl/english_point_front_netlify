"use client";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";
import {
  FaAward,
  FaBuilding,
  FaCalendarAlt,
  FaGraduationCap,
  FaUniversity,
  FaSearchPlus,
  FaFileDownload,
} from "react-icons/fa";
import threeflag from "../../../assets/instructor_sidebar/3bayrak.png";

import Link from "next/link";
function InstructorDashboard() {
  const {
    data: instructorProfile,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["instructorProfile"],
    queryFn: instructorPanelService.getInstructorProfile,
  });
  console.log("iandadad", instructorProfile);
  function Loading() {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="bg-white rounded-3xl w-full p-4 md:p-5 flex flex-col gap-3">
          <div className="space-y-2 animate-pulse">
            {/* Flag skeleton */}
            <div className="w-24 md:w-28 h-6 bg-gray-200 rounded"></div>

            {/* Education skeleton */}
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Contact skeleton */}
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>

            {/* Email skeleton */}
            <div className="h-4 bg-gray-200 rounded w-3/5"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <section className="rounded-3xl p-4 md:p-5 w-full bg-[#F5F5F5]">
          <div className="p-3 md:p-4 bg-white flex justify-between items-center rounded-full w-full px-5 shadow-md">
            <p className="text-black font-semibold text-lg md:text-2xl drop-shadow-md">
              Profile
            </p>
            <FaSearchPlus className="text-black text-xl md:text-3xl cursor-pointer" />
          </div>

          <div className="flex flex-col md:flex-row mt-4 gap-6">
            <div className="w-full md:w-2/6 flex flex-col items-center gap-2 text-center">
              {isLoading ? (
                // Skeleton / dummy placeholder
                <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse"></div>
              ) : (
                <Image
                  src={
                    instructorProfile?.user.photo || "/images/dummy-avatar.png"
                  }
                  alt="Instructor"
                  className="rounded-full"
                  width={112}
                  height={112}
                />
              )}
              <p className="text-black font-semibold text-base md:text-lg">
                {instructorProfile?.user?.first_name}{" "}
                {instructorProfile?.user?.last_name}
              </p>
              <p className="text-black text-sm">
                {instructorProfile?.user?.level}
              </p>
            </div>

            <div className="w-full md:w-4/6">
              {!isLoading ? (
                <div className="bg-white rounded-3xl w-full p-4 md:p-5 flex flex-col gap-3">
                  {instructorProfile?.user.educations[0] ? (
                    <div className="text-sm  text-black leading-relaxed space-y-2">
                      <div className="w-24 md:w-28 h-6">
                        <Image src={threeflag} alt="Flags" />
                      </div>
                      <p>
                        <span className="font-bold">Education:</span>{" "}
                        {instructorProfile?.user.educations[0].university}{" "}
                        <br />({" "}
                        {instructorProfile?.user.educations[0].specialization})
                      </p>
                      <p>
                        <span className="font-bold text-sm">Contact:</span>{" "}
                        {instructorProfile?.user.phone}
                      </p>
                      <p>
                        <span className="font-bold text-sm">E-mail:</span>{" "}
                        {instructorProfile?.user.email}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-black">
                        Please complete your profile information!
                      </p>
                      <Link href={"/instructor/settings"}>
                        <button className="mt-3 px-4 py-2 cursor-pointer bg-black text-white rounded-full text-sm font-medium">
                          Complete Profile
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </section>
        <section className="rounded-[2rem] p-4 md:p-6 w-full bg-[#F5F5F5] mt-6">
          {/* Header Alanı */}
          <div className="p-4 bg-white flex justify-between items-center rounded-full w-full px-6 shadow-md mb-6">
            <p className="text-gray-900 font-bold text-xl md:text-2xl tracking-tight">
              Certificates
            </p>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FaSearchPlus className="text-gray-700 text-xl md:text-2xl" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {instructorProfile?.user.certificates?.map((item, i) => (
              <div
                key={item.id || i}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Sol taraf: Dekoratif İkon (Ödül/Sertifika ikonu) */}
                  <div className="hidden md:flex h-12 w-12 bg-orange-50 rounded-2xl items-center justify-center shrink-0">
                    {/* Rengi eğitimden ayırmak için hafif turuncu ton kullandım, isterseniz gray yapabilirsiniz */}
                    <FaAward className="text-orange-400 text-xl" />
                  </div>

                  {/* Sağ taraf: İçerik */}
                  <div className="flex-grow">
                    {/* Sertifika Adı - En belirgin */}
                    <h3 className="text-gray-900 font-bold text-lg md:text-xl leading-tight">
                      {item.certification}
                    </h3>

                    {/* Veren Kurum (Issuer) */}
                    <div className="flex items-center gap-2 mt-2 text-gray-700 font-medium">
                      <FaBuilding className="text-gray-400 text-sm" />
                      <p>{item.issuer}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
                      {/* Yıl Bilgisi */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold bg-gray-50 w-fit py-1 rounded-full">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{item.years_of_study}</span>
                      </div>

                      {/* Eğer sertifika dosyası varsa göster (Dosya yolu null değilse) */}
                      {item.certificate_file_url && (
                        <a
                          href={item.certificate_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          <FaFileDownload />
                          Sertifikayı Görüntüle
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-6">
        {/* üst kısımdaki kodda hata var bakılacak  */}
        <section className="rounded-[2rem] p-4 md:p-6 w-full bg-[#F5F5F5]">
          {/* Header Alanı - Hafifçe revize edildi (Text shadow kaldırıldı, daha net) */}
          <div className="p-4 bg-white flex justify-between items-center rounded-full w-full px-6 shadow-md mb-6">
            <p className="text-gray-900 font-bold text-xl md:text-2xl tracking-tight">
              Education Info
            </p>
            {/* İkonun amacı belirsizse, dekoratif kalabilir veya bir işlev atanabilir */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FaSearchPlus className="text-gray-700 text-xl md:text-2xl" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {instructorProfile?.user.educations.map((item, i) => (
              <div
                key={i}
                // Kart yapısı: Beyaz arka plan, yumuşak gölge, border ve padding
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Sol taraf: Dekoratif İkon */}
                  <div className="hidden md:flex h-12 w-12 bg-gray-50 rounded-2xl items-center justify-center shrink-0">
                    <FaUniversity className="text-gray-400 text-xl" />
                  </div>

                  {/* Sağ taraf: İçerik */}
                  <div className="flex-grow">
                    {/* Üniversite Adı - En belirgin */}
                    <h3 className="text-gray-900 font-bold text-lg md:text-xl leading-tight">
                      {item.university}
                    </h3>

                    {/* Derece ve Uzmanlık - İkincil bilgi */}
                    <div className="flex items-center gap-2 mt-2 text-gray-700 font-medium">
                      <FaGraduationCap className="text-gray-500" />
                      <p>
                        {item.degree_type}{" "}
                        {item.specialization && `- ${item.specialization}`}
                      </p>
                    </div>

                    {/* Yıllar - Üçüncül bilgi */}
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 font-semibold bg-gray-50 w-fit  py-1 rounded-full">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{item.years_of_study}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default InstructorDashboard;
