function MiniCourseSessionCard({ item }) {
  return (
    <>
      <article className="relative hover:scale-105 transition-all cursor-pointer bg-white rounded-xl shadow-md overflow-hidden flex">
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-black">
              {item?.session_title}
            </h3>
            <p className="text-sm font-semibold text-black">
              {item?.cafe.name}
            </p>
            <p className="text-xs text-gray-700 mt-1">{item?.cafe.address}</p>
            <p className="text-xs text-gray-700">{item?.cafe.phone}</p>
          </div>

          {/* <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <div className="flex items-center text-xs text-gray-800 gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <IoLocationSharp />
                  <button className="underline text-xs">Konumu Gör</button>
                </div>
              </div>
            </div> */}
        </div>

        <div className="flex flex-col items-center justify-center p-3 gap-2 min-w-[80px] mt-2 md:mt-0">
          <div className="bg-[#FFD207] w-12 h-12 rounded-md flex flex-col items-center justify-center shadow-md">
            <span className="font-semibold text-black text-sm">1</span>
            <span className="text-[10px] text-black leading-none">hours</span>
          </div>
        </div>
      </article>
    </>
  );
}

export default MiniCourseSessionCard;
