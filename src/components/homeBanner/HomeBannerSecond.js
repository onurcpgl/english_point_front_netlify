import Link from "next/link";
import React from "react";
function HomeBannerSecond() {
  return (
    <div className="w-full h-[800px] bg-[#FFD207]">
      <div className="w-full h-full flex flex-col justify-center items-start">
        <div className="container mx-auto px-5 md:px-0 text-black text-4xl md:text-6xl leading-snug   ">
          <p className="font-light">En iyi özel dil dersleriyle</p>
          <p className="font-bold">
            sana yakın konumda konuşma grupları ile birlikte öğren!
          </p>
          <Link
            href="find-session"
            className="flex items-center justify-center text-lg mt-5 w-fit bg-black text-white px-5 py-2 rounded-4xl hover:scale-105 transition-all cursor-pointer"
          >
            <p className="whitespace-nowrap">Eğitim Bul!</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default HomeBannerSecond;
