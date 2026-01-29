"use client";
import Image from "next/image";
import { MdArrowDropDown } from "react-icons/md";
import Link from "next/link";

//Import görselleri - gerçek projede bu şekilde olacak
import teacherBanner from "../../assets/instructors/teacherBanner.png";
import maskGroup from "../../assets/instructors/maskgroup.png";

function InstructorsComp() {
  return (
    <div className="">
      {/* Hero Section */}
      <div className="flex flex-col gap-6">
        <div className="w-full min-h-[600px] bg-[#FFD207] px-4 relative flex flex-col justify-between">
          <div className="container mx-auto mt-30 px-4 md:px-6 flex  flex-col md:flex-row justify-between items-start pt-8 md:pt-20">
            {/* Text Content */}
            <div className="flex flex-col gap-2 w-full md:w-4/6 md:pr-20">
              <p className="font-bold text-black text-2xl md:text-[40px]">
                Join Us Now!
              </p>
              <p className="text-3xl md:text-5xl font-bold text-black">
                Become a Native Speaker!
              </p>
              <p className="text-black font-extralight text-base md:text-lg mt-2">
                English Point is a platform where native speakers of English can
                organize English conversation sessions at various cafés in
                Türkiye. Native speakers can create sessions at their preferred
                time and location, and learners can find these sessions online,
                reserve a spot, and make a payment. This way, the platform
                offers a flexible and interactive speaking environment.
              </p>
            </div>
            <Link
              href="instructor-register"
              className="col-span-full hidden max-md:flex  items-center justify-center max-xl:mt-10 bg-black text-white p-4 rounded-3xl md:rounded-4xl hover:scale-105 transition-all cursor-pointer w-full md:w-auto"
            >
              <p className="whitespace-nowrap text-sm md:text-base">
                Create a session & start earning!
              </p>
            </Link>
            {/* Image */}
            <div className="w-full md:w-2/6 flex justify-center md:justify-end mt-6 md:mt-0">
              <div className="w-64 md:w-[500px] h-64 md:h-auto  rounded-lg flex items-center justify-center">
                <Image
                  src={teacherBanner}
                  alt="English Point"
                  width={500}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Steps Section */}
        </div>
      </div>
      <div className="relative container w-full mx-auto px-4 md:px-6 mt-2 pb-6 md:pb-0 max-xl:max-w-full">
        <div className="absolute max-xl:gap-2 max-xl:relative w-[-webkit-fill-available] md:-bottom-28 flex flex-col lg:flex-row md:gap-0 md:justify-evenly items-center text-white font-bold max-xl:grid max-xl:grid-cols-4 max-md:grid-cols-1">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center justify-center bg-black text-center rounded-3xl md:rounded-4xl p-4 md:p-2 lg:px-10 sm:px-5 md:py-5 w-full lg:max-w-[13rem] md:max-w-[10rem] ">
            <p className="text-4xl md:text-6xl">1</p>
            <p className="text-sm md:text-lg font-light">Create your Profile</p>

            {/* Üçgen ok */}
            <div
              className="hidden md:block absolute left-1/2 -bottom-3 w-0 h-0 -translate-x-1/2 
                      border-l-[20px] border-l-transparent 
                      border-r-[20px] border-r-transparent 
                      border-t-[20px] border-t-black"
            ></div>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center justify-center bg-black text-center rounded-3xl md:rounded-4xl p-4 md:p-2 lg:px-10 sm:px-5 md:py-10 w-full lg:max-w-[13rem] md:max-w-[10rem]">
            <p className="text-4xl md:text-6xl">2</p>
            <p className="text-sm md:text-lg font-light">
              Choose your speaking point
            </p>

            {/* Üçgen ok */}
            <div
              className="hidden md:block absolute left-1/2 -bottom-3 w-0 h-0 -translate-x-1/2 
                      border-l-[20px] border-l-transparent 
                      border-r-[20px] border-r-transparent 
                      border-t-[20px] border-t-black"
            ></div>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center justify-center bg-black text-center rounded-3xl md:rounded-4xl p-4 lg:px-10 sm:px-5 md:py-5 w-full lg:max-w-[13rem] md:max-w-[10rem]">
            <p className="text-4xl md:text-6xl">3</p>
            <p className="text-sm md:text-lg font-light">
              Create a new session
            </p>

            {/* Üçgen ok */}
            <div
              className="hidden md:block absolute left-1/2 -bottom-3 w-0 h-0 -translate-x-1/2 
                      border-l-[20px] border-l-transparent 
                      border-r-[20px] border-r-transparent 
                      border-t-[20px] border-t-black"
            ></div>
          </div>

          {/* Step 4 */}
          <div className="relative flex flex-col items-center justify-center bg-black text-center rounded-3xl md:rounded-4xl p-4 lg:px-10 sm:px-5 md:py-10 w-full lg:max-w-[13rem] md:max-w-[10rem]">
            <p className="text-4xl md:text-6xl">4</p>
            <p className="text-sm md:text-lg font-light">
              Meet with great people & get paid!
            </p>

            {/* Üçgen ok */}
            <div
              className="hidden md:block absolute left-1/2 -bottom-3 w-0 h-0 -translate-x-1/2 
                      border-l-[20px] border-l-transparent 
                      border-r-[20px] border-r-transparent 
                      border-t-[20px] border-t-black"
            ></div>
          </div>

          {/* CTA Button */}
          <Link
            href="instructor-register"
            className="col-span-full max-md:hidden flex items-center justify-center max-xl:mt-10 bg-black text-white p-4 rounded-3xl md:rounded-4xl hover:scale-105 transition-all cursor-pointer w-full md:w-auto"
          >
            <p className="whitespace-nowrap text-sm md:text-base">
              Create a session & start earning!
            </p>
          </Link>
        </div>
      </div>
      {/* Bottom Section */}
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
              <p>&quot;English Point makes teaching possible </p>
              <MdArrowDropDown className="hidden md:block text-black text-[10rem] absolute -bottom-2 rotate-180 right-0" />
            </div>
            {/* Quote Bottom */}
            <div className="bg-[#FFD207] text-white flex justify-start pl-8 md:pl-20 items-center py-4 md:py-5 relative md:-left-5">
              <p>through socializing&quot;</p>
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
            <Link
              href="instructor-register"
              className="flex w-full md:w-max px-6 md:px-10 mt-5 font-medium items-center justify-center md:justify-start bg-black text-white p-4 rounded-3xl md:rounded-4xl hover:scale-105 transition-all cursor-pointer"
            >
              <p className="text-sm md:text-base">
                Create a session & start earning!
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorsComp;
