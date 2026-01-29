import React, { useState, useMemo, useEffect } from "react";
import generalService from "../../../utils/axios/generalService";
import { useQuery } from "@tanstack/react-query";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";
// 1. İNGİLİZCE (enUS) DİL PAKETİNİ DE EKLEDİK
import { tr, enUS } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar as CalendarIcon,
  Loader2,
  Info,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility: CN ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// 2. STATİK METİNLER İÇİN SÖZLÜK
const dictionary = {
  tr: {
    loadingError: "Program yüklenirken bir hata oluştu.",
    todayHeader: "Bugünün Programı",
    noCoursesGlobalTitle: "Eğitmenin planlanmış eğitimi bulunmamaktadır.",
    noCoursesGlobalDesc: "Lütfen daha sonra tekrar kontrol ediniz.",
    noCoursesDaily: "Bu güne ait ders yok.",
    untitledSession: "Başlıksız Oturum",
    durationSuffix: "dk",
  },
  en: {
    loadingError: "An error occurred while loading the schedule.",
    todayHeader: "Today's Schedule",
    noCoursesGlobalTitle: "No scheduled training found for this instructor.",
    noCoursesGlobalDesc: "Please check again later.",
    noCoursesDaily: "No classes for this day.",
    untitledSession: "Untitled Session",
    durationSuffix: "min",
  },
};

// 3. DATE-FNS LOCALE HARİTASI
const localeMap = {
  tr: tr,
  en: enUS,
};

function MiniWeeklyProgram({ id, lang = "tr" }) {
  // 'lang' prop'u eklendi (varsayılan 'tr')
  const [isMounted, setIsMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Seçilen dili ve metinleri belirle
  const currentLocale = localeMap[lang] || tr; // Hatalı gelirse 'tr' ye düş
  const t = dictionary[lang] || dictionary.tr;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: instructorWeeklyProgramData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["instructorWeeklyProgramDataQuery", id],
    queryFn: () => generalService.getCourseSessionById(id),
    enabled: !!id,
  });

  // Haftanın başlangıcı (Pazartesi)
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  }, [startDate]);

  // Gelen veriyi işle
  const sessions = useMemo(() => {
    const baseData =
      instructorWeeklyProgramData?.data || instructorWeeklyProgramData;

    const sessionList = Array.isArray(baseData)
      ? baseData
      : baseData?.course_sessions || [];

    return sessionList.map((session) => ({
      ...session,
      parsedDate: new Date(session.session_date),
      displayTitle: session.session_title || session.course?.title,
    }));
  }, [instructorWeeklyProgramData]);

  // Hiç ders var mı kontrolü
  const hasAnyCourses = sessions && sessions.length > 0;

  // Seçili güne ait dersleri filtrele
  const dailySessions = useMemo(() => {
    if (!hasAnyCourses) return [];

    return sessions
      .filter((session) => isSameDay(session.parsedDate, selectedDate))
      .sort((a, b) => a.parsedDate - b.parsedDate);
  }, [sessions, selectedDate, hasAnyCourses]);

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-gray-50 border border-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#ffd207]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-4 text-center text-sm text-red-500">
        {t.loadingError}
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
      {/* --- HEADER --- */}
      <div className="bg-[#ffd207] p-6 pb-8 text-black rounded-b-[2rem] shadow-sm relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold tracking-tight capitalize">
            {/* 4. DİNAMİK LOCALE KULLANIMI */}
            {format(currentDate, "MMMM yyyy", { locale: currentLocale })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={prevWeek}
              className="p-1.5 bg-black/10 hover:bg-black/20 rounded-full transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextWeek}
              className="p-1.5 bg-black/10 hover:bg-black/20 rounded-full transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* --- GÜN ŞERİDİ --- */}
        <div className="flex justify-between items-center">
          {weekDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={i}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "flex flex-col items-center justify-center w-10 h-14 rounded-2xl transition-all duration-200 gap-1",
                  isSelected
                    ? "bg-black text-[#ffd207] shadow-lg transform -translate-y-1"
                    : "text-black/60 hover:bg-black/5",
                )}
              >
                <span lang="en" className="text-[10px] font-bold uppercase">
                  {/* Gün İsimleri: Dinamik Locale */}
                  {format(day, "EEE", { locale: currentLocale })}
                </span>
                <span
                  className={cn(
                    "text-sm font-bold",
                    isToday &&
                      !isSelected &&
                      "underline decoration-2 underline-offset-2",
                  )}
                >
                  {format(day, "d")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- İÇERİK --- */}
      <div className="p-5 min-h-[300px] bg-gray-50/50">
        <h3
          lang="en"
          className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-1"
        >
          {isSameDay(selectedDate, new Date())
            ? t.todayHeader
            : format(selectedDate, "EEEE, d MMM", { locale: currentLocale })}
        </h3>

        <div className="flex flex-col gap-3">
          {!hasAnyCourses ? (
            // DURUM A: Hiç ders yok
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 opacity-80 text-center px-4">
              <Info
                size={40}
                strokeWidth={1.5}
                className="mb-3 text-gray-300"
              />
              <p className="text-sm font-medium text-gray-600">
                {t.noCoursesGlobalTitle}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t.noCoursesGlobalDesc}
              </p>
            </div>
          ) : dailySessions.length > 0 ? (
            // DURUM B: Ders listesi
            dailySessions.map((session, idx) => (
              <div
                key={idx}
                className="group relative flex items-start gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#ffd207]/50"
              >
                {/* Saat */}
                <div className="flex flex-col items-center gap-1 pt-1 min-w-[3.5rem]">
                  <span className="text-sm font-bold text-black">
                    {format(session.parsedDate, "HH:mm")}
                  </span>
                  <div className="h-full w-0.5 bg-gray-100 rounded-full mt-1 group-hover:bg-[#ffd207] transition-colors"></div>
                </div>

                {/* İçerik */}
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 leading-tight mb-1">
                    {session.displayTitle || t.untitledSession}
                  </h4>

                  {session.cafe && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2 bg-gray-50 w-fit px-2 py-1 rounded-lg">
                      <MapPin size={12} className="text-[#ffd207]" />
                      <span className="truncate max-w-[150px]">
                        {session.cafe.name}
                      </span>
                    </div>
                  )}

                  <div className="mt-2 flex gap-2">
                    <span className="text-[10px] font-semibold text-black/60 border border-gray-200 px-1.5 py-0.5 rounded">
                      {session.duration_minutes || 60} {t.durationSuffix}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // DURUM C: Bu güne ait ders yok
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 opacity-60">
              <CalendarIcon size={40} strokeWidth={1.5} className="mb-2" />
              <p className="text-sm font-medium">{t.noCoursesDaily}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MiniWeeklyProgram;
