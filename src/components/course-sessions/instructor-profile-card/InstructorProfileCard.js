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
        <div className="w-full flex flex-col-reverse md:flex-row gap-6 items-start">
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
          <div className="w-full md:2/4 flex flex-col justify-end items-end">
            <button
              onClick={onClose}
              className="relative my-2 bg-gray-400 cursor-pointer hover:bg-[#FFD207] text-gray-700 hover:text-black transition-all p-2 rounded-full shadow-md"
            >
              <X size={22} />
            </button>
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
