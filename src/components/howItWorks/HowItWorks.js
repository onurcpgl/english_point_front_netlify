import Image from "next/image";
import React from "react";
import ntomeu from "../../assets/howitswork/ntomeu.png";
import uareyou from "../../assets/howitswork/uareyou.png";
function HowItWorks() {
  return (
    <>
      <div className="container mx-auto px-4 lg:px-0 my-10 lg:my-20">
        <div className="flex flex-col gap-3 text-black">
          <div className="flex flex-col lg:flex-row gap-2 text-3xl lg:text-4xl">
            <h1 className="font-bold text-center lg:text-left">
              English Point
            </h1>
            <p className="font-light text-center lg:text-left">nasıl işler?</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-[1536px]  mx-auto w-full">
        <Image
          src={ntomeu}
          alt="Nice to meet u"
          className="w-20 absolute top-0 right-10 max-md:hidden transition-all duration-500 hover:scale-110 hover:rotate-6 hover:brightness-110 hover:drop-shadow-2xl"
        />

        <Image
          src={uareyou}
          alt="How are you?"
          className="w-36 absolute -top-30 right-20 max-md:hidden transition-all duration-500 hover:scale-110 hover:-rotate-6 hover:brightness-110 hover:drop-shadow-2xl"
        />

        <div className="hidden lg:block absolute top-0 left-0 bg-black h-[200px] w-[30%] z-0 mt-10"></div>

        <div className="flex max-md:mt-20 flex-col md:flex-row items-center justify-center gap-10 lg:gap-16 relative z-10 pb-16 container mx-auto px-20">
          <div className="relative w-full max-w-[320px] bg-[#FFD207] rounded-4xl px-4 py-12 shadow-lg -mt-10 max-md:mt-0">
            <p className="absolute -top-6 left-4 text-black text-7xl font-extrabold">
              1
            </p>

            <h3 className="text-black text-xl font-extrabold text-center mb-2">
              Kaydını Oluştur!
            </h3>

            <p className="text-black text-sm text-center">
              Hemen kayıt ol ve sana uygun zaman/konumda İngilizce konuşma
              gruplarına katıl.
            </p>

            <div className="hidden lg:block absolute -bottom-[18px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[18px] border-r-[18px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#FFD207]"></div>
          </div>

          <div className="relative w-full max-w-[320px] bg-[#FFD207] rounded-4xl px-4 py-12 py shadow-lg mt-10 max-md:mt-0">
            <p className="absolute -top-6 left-4 text-black text-7xl font-extrabold">
              2
            </p>

            <div className="hidden lg:block absolute -top-[18px] right-10 w-0 h-0 border-l-[18px] border-r-[18px] border-b-[20px] border-l-transparent border-r-transparent border-b-yellow-300"></div>

            <h3 className="text-black text-xl font-extrabold text-center mb-2">
              Buluşmayı Seç!
            </h3>

            <p className="text-black text-sm text-center">
              Şehrindeki kafelerde gerçekleşen konuşma seanslarını seç ve gel.
            </p>
          </div>

          <div className="relative w-full max-w-[320px] bg-[#FFD207] rounded-4xl px-4 py-12 shadow-lg -mt-10 max-md:mt-0">
            <p className="absolute -top-6 right-4 text-black text-7xl font-extrabold">
              3
            </p>

            <h3 className="text-black text-xl font-extrabold text-center mb-2">
              Konuşmaya Başla!
            </h3>

            <p className="text-black text-sm text-center">
              Rahat ve eğlenceli ortamda, native eşliğinde İngilizce konuşmaya
              başla.
            </p>

            <div className="hidden lg:block absolute -bottom-[18px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[18px] border-r-[18px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#FFD207]"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HowItWorks;
