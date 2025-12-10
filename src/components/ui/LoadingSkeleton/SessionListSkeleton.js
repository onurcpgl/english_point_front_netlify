import React from "react";

export default function SessionListSkeleton() {
  return (
    <div className="w-full border border-gray-200 shadow-md p-5 flex flex-col md:flex-row justify-between items-start gap-4 md:gap-2 animate-pulse rounded-lg">
      {/* Left Content (Image + Text) */}
      <div className="flex flex-col md:flex-row gap-5 md:gap-10 w-full md:w-4/6">
        {/* Image - Mobilde tam genişlik, masaüstünde sabit 300px */}
        <div className="bg-gray-300 w-full h-[200px] md:w-[300px] md:h-[200px] rounded-md shrink-0"></div>

        {/* Text section */}
        <div className="flex flex-col justify-between gap-3 py-1 md:py-3 w-full">
          <div className="flex flex-col gap-3">
            <div className="bg-gray-300 h-5 w-2/3 md:w-40 rounded"></div>
            <div className="bg-gray-300 h-4 w-1/2 md:w-32 rounded"></div>
            <div className="bg-gray-300 h-4 w-full md:w-56 rounded"></div>
            <div className="bg-gray-300 h-4 w-3/4 md:w-40 rounded"></div>
          </div>

          {/* Bottom left icons */}
          <div className="flex gap-6 mt-2 md:mt-0">
            <div className="bg-gray-300 h-4 w-24 rounded"></div>
            <div className="bg-gray-300 h-4 w-40 rounded"></div>
          </div>
        </div>
      </div>

      {/* Middle "duration" box */}
      {/* Mobilde gizleyebilirsin (hidden md:flex) veya araya sıkıştırabilirsin. 
          Burada mobilde sola hizalı, masaüstünde ortalı bıraktım. */}
      <div className="relative flex justify-start md:justify-center items-center w-full md:w-auto">
        <div className="bg-gray-300 w-20 h-10 md:h-16 rounded-md"></div>
      </div>

      {/* Right side (Buttons/Status) */}
      <div className="w-full md:w-1/6 flex flex-row md:flex-col justify-between items-center md:items-end gap-4 mt-2 md:mt-0">
        {/* Badges - Mobilde yan yana, masaüstünde alt alta */}
        <div className="flex flex-row md:flex-col gap-3 items-start md:items-end w-full">
          <div className="bg-gray-300 h-4 w-24 md:w-32 rounded"></div>
          <div className="bg-gray-300 h-4 w-20 md:w-28 rounded"></div>
          {/* Mobilde gizlenen veya küçülen ekstra badge'ler */}
          <div className="bg-gray-300 h-6 w-32 md:w-40 rounded-2xl hidden md:block"></div>
          <div className="bg-gray-300 h-6 w-24 md:w-32 rounded-2xl hidden md:block"></div>
        </div>

        {/* Action Button - Mobilde tam genişlik */}
        <div className="bg-gray-300 h-10 w-full rounded-2xl"></div>
      </div>
    </div>
  );
}
