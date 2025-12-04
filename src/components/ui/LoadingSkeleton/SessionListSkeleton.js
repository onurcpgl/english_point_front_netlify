import React from "react";

export default function SessionListSkeleton() {
  return (
    <div className="w-full h-full border border-gray-200 shadow-md p-5 flex justify-between items-start gap-2 animate-pulse">
      {/* Left Content */}
      <div className="flex gap-10 w-4/6">
        {/* Image */}
        <div className="bg-gray-300 w-[300px] h-[200px] rounded-md"></div>

        {/* Text section */}
        <div className="flex flex-col justify-between gap-3 py-3 w-full">
          <div className="flex flex-col gap-3">
            <div className="bg-gray-300 h-5 w-40 rounded"></div>
            <div className="bg-gray-300 h-4 w-32 rounded"></div>
            <div className="bg-gray-300 h-4 w-56 rounded"></div>
            <div className="bg-gray-300 h-4 w-40 rounded"></div>
          </div>

          {/* Bottom left icons */}
          <div className="flex gap-6">
            <div className="bg-gray-300 h-4 w-24 rounded"></div>
            <div className="bg-gray-300 h-4 w-40 rounded"></div>
          </div>
        </div>
      </div>

      {/* Middle "duration" box */}
      <div className="relative flex justify-center items-center">
        <div className="bg-gray-300 w-20 h-16 rounded-md"></div>
      </div>

      {/* Right side */}
      <div className="w-1/6 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-3 items-end w-full">
          <div className="bg-gray-300 h-4 w-32 rounded"></div>
          <div className="bg-gray-300 h-4 w-28 rounded"></div>
          <div className="bg-gray-300 h-6 w-40 rounded-2xl"></div>
          <div className="bg-gray-300 h-6 w-32 rounded-2xl"></div>
        </div>

        <div className="bg-gray-300 h-10 w-full rounded-2xl"></div>
      </div>
    </div>
  );
}
