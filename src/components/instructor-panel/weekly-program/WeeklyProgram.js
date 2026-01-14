"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
  getHours,
} from "date-fns";
import { enUS } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Clock,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility: CN ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Constants ---
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 08:00 - 22:00

function WeeklyProgram() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: myCourses,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["myCoursesActive"],
    queryFn: instructorPanelService.getMySessionsActive,
  });

  // --- Logic ---
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  }, [startDate]);

  const sessions = useMemo(() => {
    const baseData = myCourses?.data || myCourses;
    const sessionList = baseData?.course_sessions || [];

    return sessionList.map((session) => ({
      ...session,
      parsedDate: new Date(session.session_date),
      displayTitle: session.session_title,
    }));
  }, [myCourses]);

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getSessionForSlot = (day, hour) => {
    return sessions.find((session) => {
      const sessionDate = session.parsedDate;
      if (isNaN(sessionDate.getTime())) return false;
      return isSameDay(sessionDate, day) && getHours(sessionDate) === hour;
    });
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center bg-gray-50 rounded-xl">
        <div className="flex flex-col items-center gap-3">
          {/* LOADER RENGİ: SARI */}
          <Loader2 className="h-10 w-10 animate-spin text-[#ffd207]" />
          <span className="text-sm text-gray-500 font-medium">
            Loading Schedule...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
        <p className="font-semibold">An error occurred while loading data.</p>
        <p className="text-sm opacity-80 mt-1">
          Please check your connection and refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto bg-[#F5F5F5] rounded-3xl p-4 md:p-6 relative">
      <div className="flex flex-col gap-6 bg-white p-4 md:p-8 rounded-3xl min-h-screen shadow-sm">
        {/* --- Header --- */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Weekly Program
            </h2>
            <div className="h-1 w-full bg-[#ffd207] rounded-full"></div>

            <p className="text-slate-500 font-medium mt-1">
              {format(startDate, "d MMMM", { locale: enUS })} -{" "}
              {format(addDays(startDate, 6), "d MMMM yyyy", { locale: enUS })}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
            <button
              onClick={prevWeek}
              className="p-2.5 hover:bg-white text-slate-600 hover:text-black hover:shadow-sm rounded-xl transition-all duration-200"
              title="Previous Week"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={goToToday}
              // BUTON RENGİ: SARI ZEMİN, SİYAH YAZI
              className="px-5 py-2 text-sm font-bold text-black bg-[#ffd207] hover:bg-[#ffda40] shadow-sm shadow-yellow-200 rounded-xl transition-all duration-200"
            >
              Today
            </button>
            <button
              onClick={nextWeek}
              className="p-2.5 hover:bg-white text-slate-600 hover:text-black hover:shadow-sm rounded-xl transition-all duration-200"
              title="Next Week"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* --- Calendar Card --- */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Day Headers */}
              <div className="grid grid-cols-8 border-b border-gray-100">
                <div className="py-4 text-center text-xs font-bold text-gray-800 border-r border-gray-50 bg-gray-50/30 flex items-center justify-center">
                  TIME
                </div>
                {weekDays.map((day, i) => {
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div
                      key={i}
                      className={cn(
                        "py-4 flex flex-col items-center justify-center border-r border-gray-50 last:border-r-0 transition-colors",
                        // BUGÜNÜN SÜTUN RENGİ: ÇOK HAFİF SARI
                        isToday ? "bg-[#ffd207]/10" : ""
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs font-bold uppercase tracking-widest mb-1",
                          // BUGÜN YAZISI: KOYU SİYAH
                          isToday ? "text-black" : "text-gray-700"
                        )}
                      >
                        {format(day, "EEE", { locale: enUS })}
                      </span>
                      <div
                        className={cn(
                          "h-9 w-9 flex items-center justify-center rounded-full text-lg font-bold transition-all shadow-sm",
                          isToday
                            ? // AKTİF GÜN YUVARLAĞI: SARI ZEMİN, SİYAH YAZI
                              "bg-[#ffd207] text-black shadow-md shadow-yellow-500/20"
                            : "bg-white text-slate-700 border border-gray-100"
                        )}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time Grid */}
              <div className="divide-y divide-gray-100">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="grid grid-cols-8 min-h-[100px] group"
                  >
                    {/* Hour Column */}
                    <div className="flex items-start justify-center pt-3 border-r border-gray-50 bg-gray-50/20 text-xs font-semibold text-gray-600">
                      {`${hour.toString().padStart(2, "0")}:00`}
                    </div>

                    {/* Day Cells */}
                    {weekDays.map((day, i) => {
                      const session = getSessionForSlot(day, hour);
                      const isToday = isSameDay(day, new Date());

                      return (
                        <div
                          key={i}
                          className={cn(
                            "relative border-r border-gray-50 p-1.5 transition-all last:border-r-0",
                            isToday && !session && "bg-[#ffd207]/5", // Bugün boşsa çok hafif sarı
                            !session && "hover:bg-gray-50/80"
                          )}
                        >
                          {session ? (
                            <div className="flex flex-col h-full justify-between rounded-xl bg-[#ffd207] p-3 text-slate-900 shadow-lg shadow-yellow-500/10 transition-transform hover:scale-[1.02] cursor-pointer ring-1 ring-black/5">
                              {/* Session Title */}
                              <div>
                                <div className="flex items-start justify-between gap-1 mb-1.5">
                                  <span className="text-[10px] font-bold bg-black/10 px-2 py-0.5 rounded-md text-black/80 inline-flex items-center gap-1">
                                    <Clock size={10} strokeWidth={3} />
                                    {format(session.parsedDate, "HH:mm")}
                                  </span>
                                </div>
                                <h4
                                  className="text-xs font-extrabold leading-tight line-clamp-2 text-black"
                                  title={session.displayTitle}
                                >
                                  {session.displayTitle || "Untitled Session"}
                                </h4>
                              </div>

                              {/* Location / Cafe Info */}
                              {session.cafe && (
                                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-black/70 bg-white/40 p-1.5 rounded-lg font-semibold backdrop-blur-sm">
                                  <MapPin
                                    size={10}
                                    className="shrink-0 text-black"
                                  />
                                  <span className="truncate">
                                    {session.cafe.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyProgram;
