"use client";
import React, { useState, useEffect } from "react";
import { MapPin, Mail, Search, BookOpen, Home } from "lucide-react"; // Home ikonunu ekledim
import generalService from "../../../utils/axios/generalService";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import MiniCourseSessionCard from "../myEducations/MiniCourseSessionCard";

// Kart Başlık Bileşeni
const CardHeader = ({ title }) => (
  <div className="p-3 md:p-4 bg-white flex justify-between items-center rounded-full w-full px-5 shadow-md mb-4">
    <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
    <Search size={24} className="text-gray-900" strokeWidth={2.5} />
  </div>
);

// Bilgi Satırı Bileşeni
const InfoRow = ({ label, value, icon }) => (
  <div className="mb-3 last:mb-0 border-b border-gray-100 pb-2 last:border-0">
    <dt className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-1">
      {icon && <span className="text-gray-400">{icon}</span>}
      {label}:
    </dt>
    <dd className="text-sm text-gray-700 font-medium">
      {value || <span className="text-gray-400 italic">Bilgi yok</span>}
    </dd>
  </div>
);

function Profile() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(
    "https://dummyimage.com/150x150/000/fff.png"
  );

  // 1. Eğitimleri çekiyoruz
  const {
    data: myCourses,
    error,
    isLoading: isCoursesLoading,
  } = useQuery({
    queryKey: ["myCourses"],
    queryFn: generalService.getUserSession,
  });

  // 2. Adresleri çekiyoruz (Bu veriyi kullanacağız)
  const {
    data: myAddresses,
    error: errorMyAddresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useQuery({
    queryKey: ["myAddresses"],
    queryFn: generalService.getMyAdresses,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const result = await generalService.getUserInfo();
        console.log("radasdasdasds", result);
        if (result?.success && result.user) {
          setFormData({
            name: result.user.name || "",
            lastName: result.user.lastName || "",
            email: result.user.email || "",
            phone: result.user.phone || null,
            // Adresi buradan almıyoruz, myAddresses'den alacağız.
          });

          setProfileImage(
            result.user.profile_image || // Varsa ve boş değilse bunu al
              result.user.avatar || // Yoksa, avatar varsa ve boş değilse bunu al
              "https://dummyimage.com/150x150/000/fff.png" // İkisi de yoksa veya boşsa bunu al
          );
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
        Yükleniyor...
      </div>
    );
  }

  if (!formData)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
        Veri bulunamadı.
      </div>
    );

  return (
    <div className="w-full min-h-screen font-sans bg-transparent">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- SOL KOLON: PROFİL KARTI --- */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl p-4 md:p-6 w-full bg-[#F5F5F5] shadow-sm h-auto">
            <CardHeader title="Profile" />

            <div className="flex flex-col items-center text-center mt-6">
              {/* Profil Resmi */}
              <div className="relative w-36 h-36 mb-4">
                <Image
                  src={profileImage}
                  alt="Profil"
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-md"
                  unoptimized={true}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* İsim */}
              <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mb-6">
                {formData.name} <br /> {formData.lastName}
              </h3>

              {/* İletişim Bilgileri */}
              <div className="bg-white rounded-3xl w-full p-6 shadow-sm text-left">
                <dl className="space-y-4">
                  <InfoRow
                    label="E-mail"
                    value={formData.email}
                    icon={<Mail size={16} />}
                  />
                  {formData.phone && (
                    <InfoRow label="Telefon" value={formData.phone} />
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* --- SAĞ KOLON: EĞİTİM VE ADRES --- */}
        <div className="lg:col-span-7 grid grid-cols-1 gap-8 content-start">
          {/* 1. Katıldığım Eğitimler */}
          <div className="rounded-3xl p-4 md:p-6 w-full bg-[#F5F5F5] shadow-sm">
            <CardHeader title="Katıldığım Eğitimler" />

            <div className="min-h-[150px] flex items-center justify-center w-full">
              {myCourses?.sessions && myCourses.sessions.length > 0 ? (
                <div className="w-full bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                  {myCourses.sessions.map((session, i) => (
                    <MiniCourseSessionCard
                      key={i}
                      item={session?.course_session}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 py-4">
                  <BookOpen size={40} className="mb-2 opacity-20" />
                  <p className="text-lg font-bold text-gray-500">
                    Henüz katılım bilgisi yok!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. Adres Bilgisi */}
          <div className="rounded-3xl p-4 md:p-6 w-full bg-[#F5F5F5] shadow-sm">
            <CardHeader title="Adreslerim" />

            <div className="min-h-[150px] flex items-center justify-center w-full">
              {/* formData.address yerine myAddresses kullanıyoruz */}
              {myAddresses && myAddresses.length > 0 ? (
                <div className="w-full flex flex-col gap-4">
                  {myAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="w-full bg-white rounded-2xl p-5 shadow-sm border border-transparent hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2 pb-2 border-b border-gray-50">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Home size={18} className="text-gray-700" />
                        </div>
                        <h4 className="text-gray-900 font-extrabold text-lg">
                          {addr.title}
                        </h4>
                      </div>

                      <p className="text-gray-700 font-medium text-sm leading-relaxed pl-1">
                        {addr.address_line}
                      </p>

                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 font-semibold pl-1">
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                          {addr.district}
                        </span>
                        <span>/</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                          {addr.city}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 py-4">
                  <MapPin size={40} className="mb-2 opacity-20" />
                  <p className="text-lg font-bold text-gray-500">
                    Kayıtlı adres bulunamadı.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
