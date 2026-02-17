"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
import { usePathname } from "next/navigation";
import CourseSessionCard from "../../../components/instructor-panel/course-session-card/CourseSessionCard";
import SessionCompleteComp from "../another-comp/SessionCompleteComp";
function InstructorMySessions() {
  const [sessionToReview, setSessionToReview] = useState(null);

  const pathname = usePathname();
  const {
    data: myCourses,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myCourses"],
    queryFn: instructorPanelService.getMySessions,
  });

  useEffect(() => {
    refetch();
  }, [pathname, refetch]);

  const [sessionCounts, setSessionCounts] = useState({
    all: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    awaiting: 0,
  });

  const [selectedSessionStatus, setSelectedSessionStatus] = useState("active");

  useEffect(() => {
    const sessionStatusCounter = () => {
      if (myCourses?.data?.course_sessions) {
        const sessions = myCourses.data.course_sessions;

        setSessionCounts({
          all: sessions.length,
          // Active satırını güncelledik:
          active: sessions.filter(
            (s) =>
              s.status === "active" || s.status === "cancellation_requested",
          ).length,
          completed: sessions.filter((s) => s.status === "completed").length,
          cancelled: sessions.filter((s) => s.status === "cancelled").length,
          awaiting: sessions.filter((s) => s.status === "awaiting").length,
        });
      }
    };

    sessionStatusCounter();
  }, [myCourses]);

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
    // DÜZELTME 1: overflow-hidden kaldırıldı, padding ayarlandı.
    <div className="w-full h-auto bg-[#F5F5F5] rounded-3xl p-4 md:p-6 relative">
      {/* DÜZELTME 2: Flex yerine Grid yapısı kullanıldı. 
          Mobilde 1 sütun, tablete 2 sütun, geniş ekranda 4 sütun olur. */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-6">
        <button
          className={`group px-4 py-3 relative rounded-3xl w-full shadow-md cursor-pointer font-semibold text-sm md:text-base transition-all duration-200 hover:shadow-lg ${
            selectedSessionStatus === "active"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => setSelectedSessionStatus("active")}
        >
          Active Sessions
          {/* Badge (Rozet) Konumu düzeltildi */}
          <span className="absolute -top-2 -right-1 bg-[#ffd207] text-black text-xs font-bold min-w-[24px] h-6 rounded-full flex items-center justify-center border-2 border-white transition-transform duration-500 ease-out translate-y-0 group-hover:-translate-y-1 z-10">
            {sessionCounts.active}
          </span>
        </button>

        <button
          className={`group px-4 py-3 relative rounded-3xl w-full shadow-md cursor-pointer font-semibold text-sm md:text-base transition-all duration-200 hover:shadow-lg ${
            selectedSessionStatus === "awaiting"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => setSelectedSessionStatus("awaiting")}
        >
          Awaiting Approval
          <span className="absolute -top-2 -right-1 bg-[#ffd207] text-black text-xs font-bold min-w-[24px] h-6 rounded-full flex items-center justify-center border-2 border-white transition-transform duration-500 ease-out translate-y-0 group-hover:-translate-y-1 z-10">
            {sessionCounts.awaiting}
          </span>
        </button>

        <button
          className={`group px-4 py-3 relative rounded-3xl w-full shadow-md cursor-pointer font-semibold text-sm md:text-base transition-all duration-200 hover:shadow-lg ${
            selectedSessionStatus === "completed"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => setSelectedSessionStatus("completed")}
        >
          Completed Sessions
          <span className="absolute -top-2 -right-1 bg-[#ffd207] text-black text-xs font-bold min-w-[24px] h-6 rounded-full flex items-center justify-center border-2 border-white transition-transform duration-500 ease-out translate-y-0 group-hover:-translate-y-1 z-10">
            {sessionCounts.completed}
          </span>
        </button>

        <button
          className={`group px-4 py-3 relative rounded-3xl w-full shadow-md cursor-pointer font-semibold text-sm md:text-base transition-all duration-200 hover:shadow-lg ${
            selectedSessionStatus === "cancelled"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => setSelectedSessionStatus("cancelled")}
        >
          Cancellations
          <span className="absolute -top-2 -right-1 bg-[#ffd207] text-black text-xs font-bold min-w-[24px] h-6 rounded-full flex items-center justify-center border-2 border-white transition-transform duration-500 ease-out translate-y-0 group-hover:-translate-y-1 z-10">
            {sessionCounts.cancelled}
          </span>
        </button>
      </div>

      <div className="w-full flex justify-end mb-4">
        <Link
          className="px-6 py-3 rounded-full shadow-md cursor-pointer font-semibold bg-[#FFD207] text-black flex justify-center items-center gap-2 hover:shadow-lg transition-shadow"
          href={"/instructor/create-session"}
        >
          <p>Create Session</p>
          <FaPlusCircle className="text-xl" />
        </Link>
      </div>

      {!isLoading ? (
        myCourses?.data?.course_sessions?.length > 0 ? (
          <div className="w-full">
            <div className="rounded-3xl w-full">
              <div className="flex flex-col gap-4">
                <CourseSessionCard
                  data={myCourses.data}
                  status={selectedSessionStatus}
                  setSessionCounts={setSessionCounts}
                  refetch={refetch}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-black text-center mt-10 mb-5 text-xl md:text-3xl font-semibold">
              The session you created does not exist!
            </p>
          </div>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default InstructorMySessions;
