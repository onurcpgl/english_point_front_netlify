"use client";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaSearchPlus } from "react-icons/fa";
import { MapPin, CreditCard, AlertCircle } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import MiniWeeklyProgram from "../../ui/mini-weekly-program/MiniWeeklyProgram";
import MiniCourseSessionCard from "../../../components/instructor-panel/course-session-card/MiniCourseSessionCard";
import Link from "next/link";

function InstructorDashboard() {
  const {
    data: myCourses,
    error: myCoursesError,
    isLoading: myCoursesLoading,
  } = useQuery({
    queryKey: ["myCourses"],
    queryFn: instructorPanelService.getMySessions,
  });

  const [completedSession, setCompletedSession] = useState([]);
  const [activeSession, setActiveSession] = useState([]);
  const [awaitingSession, setAwaitingSession] = useState([]);
  const [cancelledSession, setCancelledSession] = useState([]);

  useEffect(() => {
    const filterStartData = () => {
      const filtredCompletedData = myCourses?.data.course_sessions.filter(
        (item) => item.status === "completed",
      );
      setCompletedSession(filtredCompletedData);

      const filtredActiveData = myCourses?.data.course_sessions.filter(
        (item) => item.status === "active",
      );
      setActiveSession(filtredActiveData);

      const filtredAwaitingData = myCourses?.data.course_sessions.filter(
        (item) => item.status === "awaiting",
      );
      setAwaitingSession(filtredAwaitingData);

      const filtredCancelledData = myCourses?.data.course_sessions.filter(
        (item) => item.status === "cancelled",
      );
      setCancelledSession(filtredCancelledData);
    };

    filterStartData();
  }, [myCourses]);
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
        {(() => {
          // Kontrol edilecek alanlar ve ekranda görünecek isimleri
          const fieldsToCheck = [
            { key: "phone", label: "Phone Number" },
            { key: "citizen_id", label: "ID / Passport Number" },
            { key: "email", label: "Email Address" },
            { key: "iban", label: "IBAN Information" },
          ];

          // Eksik olanları filtrele
          const missingFields = fieldsToCheck.filter(
            (field) => !myCourses?.data?.[field.key],
          );

          // Eğer eksik yoksa hiçbir şey gösterme
          if (missingFields.length === 0) return null;

          return (
            <div
              lang="en"
              className={`mb-6 p-5 bg-white border border-amber-100 rounded-[32px] shadow-lg shadow-amber-900/10 flex flex-col gap-4 relative overflow-hidden ${myCoursesLoading ? "hidden" : ""}`}
            >
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-amber-500 p-3 rounded-2xl shadow-md shadow-amber-200 relative shrink-0">
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
                  </span>
                  <CreditCard size={22} className="text-white" />
                </div>

                <div className="flex-1">
                  <h4 className="text-gray-900 font-extrabold text-base mb-1">
                    Complete Your Profile
                  </h4>

                  <div className="text-gray-600 text-xs font-medium leading-relaxed">
                    Please fill in the following missing details:
                    {/* Eksik listesini döngü ile yazdırıyoruz */}
                    <ul className="mt-2 space-y-1">
                      {missingFields.map((item) => (
                        <li
                          key={item.key}
                          className="flex items-center gap-2 text-amber-900 font-bold"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          {item.label}
                        </li>
                      ))}
                    </ul>
                    {/* Sadece IBAN eksikse o özel uyarıyı ayrıca göster */}
                    {missingFields.some((f) => f.key === "iban") && (
                      <span className="block mt-3 text-[10px] uppercase tracking-wide font-black text-red-500/80">
                        * IBAN is required to receive payments.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <a
                href="/instructor/settings"
                className="w-full py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-2xl text-center transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Update Information
              </a>
            </div>
          );
        })()}
        <section className="rounded-3xl p-4 md:p-5 w-full bg-[#F5F5F5]">
          <div className="p-3 md:p-4 bg-white flex justify-between items-center rounded-full w-full px-5 shadow-md">
            <p className="text-black font-semibold text-lg md:text-2xl drop-shadow-md">
              Dashboard
            </p>
          </div>

          <div className="w-full flex flex-col items-end mt-8 mb-4 gap-3">
            {/* ✨ MOTIVATION AREA (ENGLISH) ✨ */}
            <div className="text-right max-w-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center justify-end gap-2">
                Turn Your Knowledge into Income! 🚀
              </h3>
              <p className="text-gray-500 text-sm md:text-base font-medium mt-1">
                Your students are waiting for you. Create a new session now to{" "}
                <span className="text-black font-bold underline decoration-[#FFD207]">
                  teach and earn.
                </span>
              </p>
            </div>

            {/* Button */}
            <Link
              className="px-8 py-4 w-full md:w-fit rounded-full shadow-lg cursor-pointer font-bold bg-[#FFD207] text-black flex justify-center items-center gap-3 hover:scale-105 hover:shadow-xl transition-all duration-300"
              href={"/instructor/create-session"}
            >
              <p className="text-lg">Create New Session</p>
              <FaPlusCircle className="text-2xl" />
            </Link>
          </div>
        </section>

        <div className="rounded-3xl p-4 md:p-5 w-full bg-[#F5F5F5]">
          <div className="p-3 md:p-4 flex justify-between items-center bg-white rounded-full w-full px-5 shadow-md">
            <p className="text-black font-semibold text-lg md:text-2xl drop-shadow-md">
              Upcoming Sessions
            </p>
            <FaSearchPlus className="text-black text-xl md:text-3xl cursor-pointer" />
          </div>
          {!myCoursesLoading ? (
            <div className="flex flex-col gap-4 mt-2">
              {activeSession?.length > 0 ? (
                <div className="h-auto p-3 w-full">
                  <div className="rounded-3xl  w-full bg-[#F5F5F5]">
                    <div className="flex flex-col gap-4 mt-2">
                      <MiniCourseSessionCard data={activeSession.slice(0, 4)} />
                      {activeSession.length > 4 && (
                        <div className="text-center ">
                          <a
                            href="/instructor/my-sessions"
                            className="text-gray-600 font-medium hover:underline text-sm"
                          >
                            See all upcoming sessions
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-black text-center mt-10 mb-5 text-3xl font-semibold">
                  No upcoming session information!
                </p>
              )}
            </div>
          ) : (
            <Loading />
          )}
        </div>
        <div className="rounded-3xl p-4 md:p-5 w-full bg-[#F5F5F5]">
          <div className="p-3 md:p-4 flex justify-between items-center bg-white rounded-full w-full px-5 shadow-md">
            <p className="text-black font-semibold text-lg md:text-2xl drop-shadow-md">
              Awaiting Sessions
            </p>
            <FaSearchPlus className="text-black text-xl md:text-3xl cursor-pointer" />
          </div>
          {!myCoursesLoading ? (
            <div className="flex flex-col gap-4 mt-2">
              {completedSession?.length > 0 ? (
                <div className="h-auto p-3 w-full">
                  <div className="rounded-3xl  w-full bg-[#F5F5F5]">
                    <div className="flex flex-col gap-4 mt-2">
                      <MiniCourseSessionCard data={awaitingSession} />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-black text-center mt-10 mb-5 text-3xl font-semibold">
                  No awaiting session information!
                </p>
              )}
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div className="rounded-3xl p-4 md:p-5 w-full bg-[#F5F5F5]">
          <div className="p-3 md:p-4 flex justify-between items-center bg-white rounded-full w-full px-5 shadow-md">
            <p className="text-black font-semibold text-lg md:text-2xl drop-shadow-md">
              Past Sessions
            </p>
            <FaSearchPlus className="text-black text-xl md:text-3xl cursor-pointer" />
          </div>
          {!myCoursesLoading ? (
            <div className="flex flex-col gap-4 mt-2">
              {completedSession?.length > 0 ? (
                <div className="h-auto p-3 w-full">
                  <div className="rounded-3xl w-full bg-[#F5F5F5]">
                    <div className="flex flex-col gap-4 mt-2">
                      {/* 1. Adım: Listeyi bileşene göndermeden önce 4 ile sınırla */}
                      <MiniCourseSessionCard
                        data={completedSession.slice(0, 4)}
                      />

                      {/* 2. Adım: 4'ten fazla öğe varsa İngilizce linki göster */}
                      {completedSession.length > 4 && (
                        <div className="text-center ">
                          <a
                            href="/instructor/my-sessions"
                            className="text-gray-600 font-medium hover:underline text-sm"
                          >
                            See all past sessions
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-black text-center mt-10 mb-5 text-3xl font-semibold">
                  No past session information!
                </p>
              )}
            </div>
          ) : (
            <Loading />
          )}
        </div>

        <div className="rounded-3xl p-4 md:p-5 w-full bg-[#F5F5F5]">
          <div className="p-3 md:p-4  mb-5 flex justify-between items-center bg-white rounded-full w-full px-5 shadow-md">
            <p className="text-black font-semibold text-lg md:text-2xl drop-shadow-md">
              Session Calendar
            </p>
            <FaSearchPlus className="text-black text-xl md:text-3xl cursor-pointer" />
          </div>

          <MiniWeeklyProgram id={myCourses?.data.id} lang="en" />
        </div>

        {/* üst kısımdaki kodda hata var bakılacak  */}
      </div>
    </div>
  );
}

export default InstructorDashboard;
