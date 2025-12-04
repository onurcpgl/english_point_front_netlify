"use client";
import React from "react";
import { X } from "lucide-react";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import MiniWeeklyProgram from "../../ui/mini-weekly-program/MiniWeeklyProgram";
function InstructorModal({ selectedInstructor, onClose }) {
  if (!selectedInstructor) return null;
  function getDate(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("tr-TR"); // "25.08.2025"
  }
  function getTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }); // "14:30"
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-6 relative border border-gray-200 max-h-[90vh] overflow-y-auto">
        {/* Üst Kısım */}
        <div className="w-full flex justify-between items-center mt-2 mb-4 px-2">
          <div className="flex gap-4 items-center">
            <div className="bg-[#FFD207] px-4 py-1 shadow-sm rounded-full text-black font-bold text-sm w-fit">
              <p>
                Eğitmen: {selectedInstructor?.instructor.first_name}{" "}
                {selectedInstructor?.instructor.last_name}
              </p>
            </div>
            <div className="flex justify-center items-end">
              <Calendar
                strokeWidth={2}
                className="inline-block text-lg font-bold mr-2 text-[#FFD207]"
              />
              <span className="text-sm">
                {getDate(selectedInstructor?.session_date)}
              </span>
            </div>
            <div className="flex justify-center items-end">
              <Clock
                strokeWidth={2}
                className="inline-block text-[#FFD207]  mr-2"
              />
              <span className="text-sm">
                {getTime(selectedInstructor?.session_date)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex justify-center items-center gap-4">
              <p className=" font-bold">Eğitim süresi:</p>
              <div className="bg-[#FFD207] relative  p-4 flex justify-center items-center flex-col font-bold leading-[1]">
                <p>1</p>
                <span>saat</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-gray-400 cursor-pointer hover:bg-[#FFD207] text-gray-700 hover:text-black transition-all p-2 rounded-full shadow-md"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* İçerik */}
        <div className="w-full flex flex-col md:flex-row gap-6">
          <div className="w-full md:2/4">
            <div className="w-full flex justify-center items-start gap-2">
              <Image
                src={
                  selectedInstructor?.instructor.photo_url ||
                  "/images/dummy-avatar.png"
                }
                width={120}
                height={120}
                alt={`${selectedInstructor?.instructor.first_name} ${selectedInstructor?.instructor.last_name}`}
                className="w-30 h-30 object-cover rounded-xl border"
              />
              <div className="flex flex-col w-full  px-4">
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {selectedInstructor?.instructor.first_name}{" "}
                  {selectedInstructor?.instructor.last_name}
                </h2>

                {selectedInstructor?.instructor.educations?.[0] && (
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium text-gray-700">
                      {selectedInstructor?.instructor.educations[0]?.university}
                    </span>{" "}
                    (
                    {
                      selectedInstructor?.instructor.educations[0]
                        ?.specialization
                    }
                    )
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-gray-800">Şehir:</span>{" "}
                    {selectedInstructor?.instructor.current_city ||
                      "Belirtilmemiş"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Ülke:</span>{" "}
                    {selectedInstructor?.instructor.country_birth ||
                      "Belirtilmemiş"}
                  </p>
                </div>

                <div className="mt-5">
                  <h3 className="font-semibold text-gray-800 mb-2 text-base">
                    Hakkında
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {selectedInstructor?.instructor.about ||
                      "Eğitmen hakkında detaylı bilgi henüz eklenmemiştir."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:2/4">
            <MiniWeeklyProgram
              id={selectedInstructor?.instructor_id}
              lang="tr"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorModal;
