"use client";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaSearchPlus } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
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
        (item) => item.status === "completed"
      );
      setCompletedSession(filtredCompletedData);

      const filtredActiveData = myCourses?.data.course_sessions.filter(
        (item) => item.status === "active"
      );
      setActiveSession(filtredActiveData);

      const filtredAwaitingData = myCourses?.data.course_sessions.filter(
        (item) => item.status === "awaiting"
      );
      setAwaitingSession(filtredAwaitingData);

      const filtredCancelledData = myCourses?.data.course_sessions.filter(
        (item) => item.status === "cancelled"
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
                      <MiniCourseSessionCard data={activeSession} />
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
                  <div className="rounded-3xl  w-full bg-[#F5F5F5]">
                    <div className="flex flex-col gap-4 mt-2">
                      <MiniCourseSessionCard data={completedSession} />
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
