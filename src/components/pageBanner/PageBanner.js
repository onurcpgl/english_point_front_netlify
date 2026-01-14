import React from "react";
import PageBannerImage from "../../assets/banner/pagebanner.jpg";
import Image from "next/image";
function PageBanner({ title }) {
  return (
    <div className="relative flex justify-center items-center z-40">
      <Image
        src={PageBannerImage}
        alt="Page Banner"
        className="w-full h-[500px] object-cover"
      />
      <div className="absolute">
        <h1 className="text-white text-4xl font-bold">
          {title ? title : "English Point"}
        </h1>
      </div>
    </div>
  );
}

export default PageBanner;
