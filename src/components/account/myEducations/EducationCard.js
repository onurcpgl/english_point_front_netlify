import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";
import { FiCalendar, FiClock } from "react-icons/fi";
import "react-calendar/dist/Calendar.css";
import { FaUser, FaChevronRight } from "react-icons/fa";
import EnterCard from "../../account/myEducations/EnterCard";
import { QrCode } from "lucide-react";
import { formatDate, formatTime } from "../../../utils/helpers/formatters";
const EducationCard = ({ data, status }) => {
  const [openEnterDoc, setOpenEnterDoc] = useState({
    status: false,
    doc: null,
  });
  const [openCourseInfo, setOpenCourseInfo] = useState(null);
  const openCourseRef = useRef(null);
  console.log("data", data);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openCourseRef.current &&
        !openCourseRef.current.contains(event.target)
      ) {
        if (
          openCourseRef.current?.className !==
          "bg-white rounded-3xl p-6 shadow-md relative"
        ) {
          setOpenCourseInfo(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <EnterCard
        open={openEnterDoc.status} // true/false
        message={"Eğitime Katılım Belgeniz"}
        setOpenEnterDoc={setOpenEnterDoc}
        doc={openEnterDoc.doc}
      />
      {data?.map(
        (item, i) =>
          item.status === status && (
            <div key={i} className="space-y-4 relative my-2">
              <article
                className="relative bg-white shadow-md rounded-4xl overflow-hidden flex flex-col md:flex-row cursor-pointer"
                //onClick={() => setOpenCourseInfoHandler(item)}
              >
                <div className="md:w-50 w-full h-auto shrink-0 relative">
                  <Image
                    src={item.course_session.cafe.image}
                    alt={item.course_session.cafe.name}
                    className="w-full h-full"
                    fill
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-black">
                      {item.course_session.session_title}
                    </h3>
                    <p className="text-xs font-semibold text-black">
                      {item.course_session.cafe.name}
                    </p>
                    <p className="text-xs text-gray-700 mt-1">
                      {item.course_session.cafe.address}
                    </p>
                    <p className="text-xs text-gray-700">
                      {item.course_session.cafe.phone}
                    </p>
                    <p className="text-xs text-gray-800 mt-1">
                      <span className="font-semibold">Eğitmen:</span>{" "}
                      {item?.course_session.instructor.first_name}{" "}
                      {item?.course_session.instructor.last_name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center text-xs text-gray-800 gap-4 flex-wrap">
                      <div className="flex justify-start items-center">
                        <IoLocationSharp className="inline-block mr-2 text-lg text-orange-400" />
                        <span
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps?q=${item.cafe.latitude},${item.cafe.longitude}`,
                              "_blank"
                            )
                          }
                          className="font-medium text-md  cursor-pointer hover:underline underline-offset-4"
                        >
                          Konumu Gör
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-3 gap-2 min-w-[80px] mt-2 md:mt-0">
                  <div className="bg-[#FFD207] w-12 h-12 rounded-md flex flex-col items-center justify-center shadow-md">
                    <span className="font-semibold text-black text-sm">1</span>
                    <span className="text-[10px] text-black leading-none">
                      saat
                    </span>
                  </div>
                  <div>
                    <p className="text-black font-semibold">Eğitim Süresi</p>
                  </div>

                  <div className="flex flex-col items-center text-xs text-gray-700">
                    <div className="flex items-center gap-1">
                      <FiCalendar />
                      <span>
                        {formatDate(item.course_session.session_date, "long")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock />
                      <span>
                        {formatTime(item.course_session.session_date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() =>
                    setOpenEnterDoc({
                      status: true,
                      doc: {
                        uniqueCode: item?.attendance_code,
                      },
                    })
                  }
                  className="group flex items-center gap-3 bg-[#FFD207] hover:bg-[#e6c200] transition-all px-4 py-3 rounded-xl cursor-pointer shadow-lg hover:shadow-2xl"
                >
                  <div className="bg-white p-2 rounded-full flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-[#FFD207] group-hover:text-[#e6c200] transition-colors" />
                  </div>
                  <span className="text-black font-semibold text-sm">
                    Katılım Belgeni Görüntüle
                  </span>
                </div>
              </article>

              {openCourseInfo && (
                <div
                  ref={openCourseRef}
                  className="bg-white rounded-3xl p-6 shadow-md relative"
                >
                  <div className="flex justify-center items-center rounded-full p-3 py-2 bg-yellow-300">
                    <h2 className="text-xl font-bold text-black">
                      Eğitim Aktivitesi
                    </h2>
                  </div>
                </div>
              )}
            </div>
          )
      )}
    </div>
  );
};

export default EducationCard;
