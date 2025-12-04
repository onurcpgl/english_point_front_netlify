"use client";
import { useState, useEffect } from "react";
import EducationCard from "../../../components/account/myEducations/EducationCard";
import { useQuery } from "@tanstack/react-query";
import generalService from "../../../utils/axios/generalService";

function MyEducations() {
  const [selectedSessionStatus, setSelectedSessionStatus] = useState("active");
  const [sessionCounts, setSessionCounts] = useState({
    all: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
  });

  const {
    data: myCourses,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["myCourses"],
    queryFn: generalService.getUserSession,
  });

  // 🔹 Eğitimleri filtreleme kuralları
  const filterSessions = (sessions, status) => {
    if (!sessions) return [];

    switch (status) {
      case "active":
        return sessions.filter((s) =>
          ["registered"].includes(s.attendance_status)
        );
      case "completed":
        return sessions.filter((s) =>
          ["attended", "completed"].includes(s.attendance_status)
        );
      case "cancelled":
        return sessions.filter((s) =>
          [
            "canceled_by_user",
            "canceled_by_admin",
            "no_show",
            "instructor_absent",
          ].includes(s.attendance_status)
        );
      default:
        return sessions;
    }
  };

  // 🔹 Sayaçları hesapla
  useEffect(() => {
    if (myCourses?.sessions) {
      const all = myCourses.sessions.length;
      const active = filterSessions(myCourses.sessions, "active").length;
      const completed = filterSessions(myCourses.sessions, "completed").length;
      const cancelled = filterSessions(myCourses.sessions, "cancelled").length;

      setSessionCounts({ all, active, completed, cancelled });
    }
  }, [myCourses]);

  // 🔹 Filtrelenmiş liste
  const filteredSessions = filterSessions(
    myCourses?.sessions,
    selectedSessionStatus
  );

  function Loading() {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="bg-white rounded-3xl w-full p-4 md:p-5 flex flex-col gap-3">
          <div className="space-y-2 animate-pulse">
            <div className="w-24 md:w-28 h-6 bg-gray-200 rounded"></div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/5"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden bg-[#F5F5F5] p-10 max-lg:p-2 h-auto rounded-3xl relative">
      {/* Filtre butonları */}
      <div className="w-full rounded-full p-3 mb-4 flex justify-between items-center gap-4">
        {[
          { key: "active", label: "Aktif Eğitimlerim" },
          { key: "completed", label: "Tamamlanan Eğitimlerim" },
          { key: "cancelled", label: "İptal Olan Eğitimlerim" },
        ].map((btn) => (
          <button
            key={btn.key}
            className={`group px-5 py-3 relative rounded-4xl w-full shadow-xl cursor-pointer font-semibold transition-all duration-200 hover:shadow-2xl ${
              selectedSessionStatus === btn.key
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setSelectedSessionStatus(btn.key)}
          >
            {btn.label}
            <span className="absolute -top-2 -right-2 bg-[#ffd207] text-black text-xs font-bold min-w-[24px] h-6 rounded-full flex items-center justify-center border-2 border-white transition-transform duration-500 ease-out translate-y-0 group-hover:-translate-y-2">
              {sessionCounts[btn.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Eğitim Listesi */}
      {!isLoading ? (
        filteredSessions.length > 0 ? (
          <div className="h-auto p-3 w-full">
            <div className="rounded-3xl w-full bg-[#F5F5F5]">
              <div className="flex flex-col gap-4 mt-6">
                <EducationCard data={filteredSessions} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-black text-center mt-10 mb-5 text-3xl font-semibold">
            Henüz bu kategoriye ait bir eğitim bulunmamaktadır.
          </p>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default MyEducations;
