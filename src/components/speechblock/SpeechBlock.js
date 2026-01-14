import React from "react";
import Image from "next/image";
import resim1 from "../../assets/speechblock/balon1.png";
import resim2 from "../../assets/speechblock/balon2.png";

import { MdArrowDropDown } from "react-icons/md";
import resim3 from "../../assets/speechblock/balon3.png";

import maskGroup from "../../assets/instructors/maskgroup.png";
import Link from "next/link";
function SpeechBlock() {
  return (
    <>
      <div className="container mx-auto px-4 mt-10 relative">
        <div className="flex flex-col md:flex-row justify-evenly items-center gap-6 md:gap-0">
          <div className="relative w-full md:w-auto flex justify-center">
            <Image
              src={resim1}
              alt="Anlıyorum ama konuşamıyorum"
              className="w-[220px] md:w-[280px] h-auto  transition-all duration-500 hover:scale-110 hover:-rotate-6 hover:brightness-110 hover:drop-shadow-2xl cursor-pointer"
            />
          </div>
          <div className="relative w-full md:w-auto flex justify-center md:mt-14">
            <Image
              src={resim2}
              alt="O kadar kişinin içinde ingilizce konuşamam"
              className="w-[220px] md:w-[280px] h-auto  transition-all duration-500 hover:scale-110 hover:-rotate-6 hover:brightness-110 hover:drop-shadow-2xl cursor-pointer"
            />
          </div>
          <div className="relative w-full md:w-auto flex justify-center">
            <Image
              src={resim3}
              alt="Ya Doğru Konuşamazsam?"
              className="w-[220px] md:w-[280px] h-auto  transition-all duration-500 hover:scale-110 hover:-rotate-6 hover:brightness-110 hover:drop-shadow-2xl cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div className="w-full max-w-[1536px] my-14 max-sm:mt-0 flex justify-center items-center">
        <div className="w-full max-w-[1536px]  max-sm:mt-0 flex justify-center items-center">
          <div className="flex flex-col md:flex-row w-full gap-10 md:gap-6">
            {/* Sol blok */}
            <div className="w-full md:w-1/3 flex flex-col">
              <div className="flex flex-col justify-center h-full">
                <p className="font-extrabold text-black text-2xl p-2 text-center md:text-right">
                  10.dakikadan itibaren
                </p>
                <div className="bg-[#FFD207] py-2 flex justify-center md:justify-end">
                  <p className="font-extrabold text-[22px] text-black text-center md:text-right">
                    you are a legend !
                  </p>
                </div>
              </div>
            </div>

            {/* Sağ blok */}
            <div className="w-full md:w-2/3 flex items-center mt-10">
              <p className="text-black text-md font-light text-center md:text-left leading-relaxed pr-20 max-md:pr-0">
                Araştırmalar konuşma kulüplerindeki öğrencilerin ilk 10 dakika
                çekingen kaldıktan sonra şakır şakır İngilizce konuştuklarını
                gösteriyor.
              </p>
            </div>
            <div className="absolute -bottom-4 right-0 w-24 h-24 bg-[#FFD207] rounded-full -z-10"></div>
          </div>
        </div>
      </div>
      <div className="w-full container mx-auto px-4 md:px-6 mt-16 md:mt-44 mb-10 md:mb-20 max-xl:mt-0 flex flex-col md:flex-row justify-between gap-8 md:gap-0">
        {/* Image Section */}
        <div className="w-full md:w-3/6 z-30 md:relative md:left-[-5rem] flex flex-col justify-center md:justify-start">
          <div className="flex flex-col lg:flex-row gap-2 text-3xl lg:text-4xl mb-10 text-black">
            <h1 className="font-bold text-center lg:text-left">
              Became a Native Speaker
            </h1>
          </div>
          <div className="w-full max-w-[400px] md:w-[500px] h-64 md:h-full  rounded-lg flex items-center justify-center">
            <Image
              className="w-full h-full object-cover"
              src={maskGroup}
              width={600}
              height={300}
              alt="Instructors"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-3/6 z-30 md:relative flex flex-col gap-3">
          <div className="text-black flex flex-col font-bold text-lg md:text-2xl">
            {/* Quote Top */}
            <div className="bg-black w-full text-white flex justify-start pl-6 md:pl-10 items-center py-4 md:py-5 relative md:-right-5">
              <p>&quot;English Point makes teaching</p>
              <MdArrowDropDown className="hidden md:block text-black text-[10rem] absolute -bottom-2 rotate-180 right-0" />
            </div>
            {/* Quote Bottom */}
            <div className="bg-[#FFD207] text-black flex justify-start pl-8 md:pl-20 items-center py-4 md:py-5 relative md:-left-5">
              <p>possible through socializing&quot;</p>
              <MdArrowDropDown className="hidden md:block text-[#FFD207] text-[10rem] absolute -top-2 left-0" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-black pl-4 md:pl-16 mt-6 md:mt-10">
            <p className="text-black font-bold text-xl md:text-2xl">
              Teach anytime, anywhere
            </p>
            <p className="text-black font-extralight text-base md:text-lg mt-2">
              Decide when and how many hours you want to teach. No minimum time
              commitment or fixed schedule. Be your own boss!
            </p>
            {/* <Link
              href="instructor-register"
              className="flex w-full md:w-max px-6 md:px-10 mt-5 font-medium items-center justify-center md:justify-start bg-black text-white p-4 rounded-3xl md:rounded-4xl hover:scale-105 transition-all cursor-pointer"
            >
              <p className="text-sm md:text-base">
                Create a session & start earning!
              </p>
            </Link> */}
          </div>
        </div>
      </div>
      {/* <div className='flex'>

                <div className=' w-[50%] h-[470px] mt-20'>
                    <div className='bg-yellow-300 w-[45%] h-[470px]'>
                        <div className='absolute px-60'>
                            <Image
                                src={resim4}
                                alt="test"
                            />
                        </div>

                    </div>

                </div>
                <div className='w-[50%] h-[500px] flex  items-center'>
                    <div className='flex flex-col'>

                        <p className='text-black font-extrabold text-2xl'>Be An Instructor</p>
                        <p className='text-black font-extrabold'>Join Englishpoint</p>
                        <div className='mt-4'>
                            <div className='flex items-center gap-2'>
                                <GiWrappedSweet className='text-yellow-300 text-2xl' />
                                <p className='text-black text-sm leading-snug '>Discover the nearest “englishpoint” in your place</p>

                            </div>

                            <div className='flex items-center gap-2'>
                                <GiWrappedSweet className='text-yellow-300 text-2xl' />
                                <p className='text-black text-sm leading-snug '>Start the meetings and help students speaking English</p>

                            </div>


                            <div className='flex items-center gap-2'>
                                <GiWrappedSweet className='text-yellow-300 text-2xl' />
                                <p className='text-black text-sm leading-snug '>Get your payment instantly and safely!</p>

                            </div>

                        </div>
                        <div className=' mt-2 p-2'>
                            <div className='w-[60%] flex items-center   rounded-2xl bg-yellow-300'>
                                <p className='text-black font-semibold px-5'>Be an Instructor</p>
                                <IoIosArrowRoundForward className='text-black text-2xl' />

                            </div>
                        </div>
                    </div>
                </div>

            </div> */}
    </>
  );
}
export default SpeechBlock;
