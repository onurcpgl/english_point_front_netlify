"use client";
import React, { useState, useEffect } from "react";
import { MapPin, Mail, Search, BookOpen, Home } from "lucide-react";
import generalService from "../../../utils/axios/generalService";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import MiniCourseSessionCard from "../myEducations/MiniCourseSessionCard";

const CardHeader = ({ title }) => (
  <div className="p-3 md:p-4 bg-white flex justify-between items-center rounded-full w-full px-5 shadow-md mb-4">
    <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
    <Search size={24} className="text-gray-900" strokeWidth={2.5} />
  </div>
);

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

  const {
    data: myCourses,
    error,
    isLoading: isCoursesLoading,
  } = useQuery({
    queryKey: ["myCourses"],
    queryFn: generalService.getUserSession,
  });
  console.log("askljfagsfhj", myCourses);
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

        if (result?.success && result.user) {
          setFormData({
            name: result.user.name || "",
            lastName: result.user.lastName || "",
            email: result.user.email || "",
            phone: result.user.phone || null,
          });

          setProfileImage(
            result.user.profile_image ||
              result.user.avatar ||
              "https://dummyimage.com/150x150/000/fff.png"
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

  // --- SKELETON LOADER ALANI (Burayı değiştirdik) ---
  if (loading) {
    return (
      <div className="w-full min-h-screen font-sans bg-transparent">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SOL KOLON SKELETON (Profil Kartı) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl p-4 md:p-6 w-full bg-[#F5F5F5] shadow-sm h-[500px] animate-pulse">
              {/* Header Skeleton */}
              <div className="h-14 bg-white rounded-full w-full mb-8 opacity-50"></div>

              <div className="flex flex-col items-center mt-6">
                {/* Profil Resmi Yuvarlağı */}
                <div className="w-36 h-36 bg-gray-200 rounded-full mb-4 border-4 border-white"></div>

                {/* İsim Satırları */}
                <div className="h-6 w-1/2 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-8"></div>

                {/* Bilgi Kutusu */}
                <div className="bg-white rounded-3xl w-full p-6 h-32 opacity-50">
                  <div className="h-4 w-full bg-gray-100 rounded mb-4"></div>
                  <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ KOLON SKELETON */}
          <div className="lg:col-span-7 grid grid-cols-1 gap-8 content-start">
            {/* 1. Eğitimler Skeleton */}
            <div className="rounded-3xl p-4 md:p-6 w-full bg-[#F5F5F5] shadow-sm animate-pulse">
              {/* Header */}
              <div className="h-14 bg-white rounded-full w-full mb-6 opacity-50"></div>

              {/* Eğitim Kartları */}
              <div className="space-y-4">
                <div className="w-full h-24 bg-white rounded-2xl opacity-60"></div>
                <div className="w-full h-24 bg-white rounded-2xl opacity-60"></div>
              </div>
            </div>

            {/* 2. Adresler Skeleton */}
            <div className="rounded-3xl p-4 md:p-6 w-full bg-[#F5F5F5] shadow-sm animate-pulse">
              {/* Header */}
              <div className="h-14 bg-white rounded-full w-full mb-6 opacity-50"></div>

              {/* Adres Kartları */}
              <div className="space-y-4">
                <div className="w-full bg-white rounded-2xl p-5 border border-transparent opacity-60">
                  <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-full bg-white rounded-2xl p-5 border border-transparent opacity-60">
                  <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!formData)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
        Veri bulunamadı.
      </div>
    );

  // --- GERÇEK İÇERİK ---
  return (
    <div className="w-full min-h-screen font-sans bg-transparent">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- SOL KOLON: PROFİL KARTI --- */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl p-4 md:p-6 w-full bg-[#F5F5F5] shadow-sm h-auto">
            <CardHeader title="Profile" />

            <div className="flex flex-col items-center text-center mt-6">
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

              <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mb-6">
                {formData.name} <br /> {formData.lastName}
              </h3>

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
              {isCoursesLoading ? (
                // Küçük lokal skeleton (Eğer sadece eğitimler yükleniyorsa)
                <div className="w-full space-y-4 animate-pulse">
                  <div className="h-24 bg-white rounded-2xl"></div>
                  <div className="h-24 bg-white rounded-2xl"></div>
                </div>
              ) : myCourses?.sessions && myCourses.sessions.length > 0 ? (
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
              {isAddressesLoading ? (
                // Küçük lokal skeleton (Eğer sadece adresler yükleniyorsa)
                <div className="w-full space-y-4 animate-pulse">
                  <div className="h-28 bg-white rounded-2xl"></div>
                  <div className="h-28 bg-white rounded-2xl"></div>
                </div>
              ) : myAddresses && myAddresses.length > 0 ? (
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
