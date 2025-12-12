"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import generalService from "../../utils/axios/generalService";
import FilterComp from "./filterComp/FilterComp";
import SessionListComp from "./sessionListComp/SessionListComp";
import { motion } from "framer-motion";
import Loading from "../../components/loading/Loading";
// İkonlar için (lucide-react veya react-feather kullanıyorsan import et, yoksa svg kullanabilirsin)
import { MapPin, RefreshCw, AlertCircle } from "lucide-react";

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
}

function CourseSessionsComp() {
  const {
    data: courseSessions,
    error: courseSessionsError,
    isLoading: courseSessionsLoading,
  } = useQuery({
    queryKey: ["courseSessions"],
    queryFn: generalService.getCourseSession,
  });
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["sessionCategories"],
    queryFn: generalService.getCourseCategories,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
  const [locationStatus, setLocationStatus] = useState("idle"); // idle, loading, success, error
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [range, setRange] = useState(5); // km
  const [mappedData, setMappedData] = useState(courseSessions || []);
  const [showFilterBar, setShowFilterBar] = useState(true);
  const lastScrollY = useRef(0);

  // --- 📍 GELİŞMİŞ KONUM ALMA FONKSİYONU ---
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationErrorMsg("Tarayıcınız konum servisini desteklemiyor.");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationStatus("success");
      },
      (error) => {
        console.error("Konum hatası:", error);
        setLocationStatus("error");
        switch (error.code) {
          case 1:
            setLocationErrorMsg(
              "Konum izni reddedildi. Lütfen ayarlardan izin verin."
            );
            break;
          case 2:
            setLocationErrorMsg(
              "Konum bilgisi alınamıyor (GPS kapalı olabilir)."
            );
            break;
          case 3:
            setLocationErrorMsg(
              "Konum alma süresi doldu (Timeout). Tekrar deneyin."
            );
            break;
          default:
            setLocationErrorMsg("Bilinmeyen bir hata oluştu.");
        }
      },
      // iOS ve Hassas Konum İçin Kritik Ayarlar
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  // Sayfa ilk açıldığında konumu otomatik çek
  useEffect(() => {
    handleGetLocation();
  }, []);

  // Scroll efekt
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 50) {
        setShowFilterBar(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowFilterBar(false);
      } else {
        setShowFilterBar(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Local Storage Filtreleri
  const getLocalFilter = async () => {
    const uniq_id = localStorage.getItem("uniq_id");
    if (uniq_id !== null) {
      const questionAnswerResult = await generalService.getByAnswerQuestion(
        uniq_id
      );
      if (questionAnswerResult?.answers) {
        const parsedAnswers = questionAnswerResult.answers["tr"];
        const formatted = parsedAnswers.reduce((acc, item, idx) => {
          acc[idx + 1] = item.answers;
          return acc;
        }, {});
        setFilters(formatted);
        return formatted;
      }
    }
    return {};
  };

  useEffect(() => {
    getLocalFilter();
  }, []);

  // Filtreleme Logic
  useEffect(() => {
    if (!courseSessions) return;

    let tempData = courseSessions.map((s) => {
      if (userLocation.lat && userLocation.lon) {
        const cafeLat = parseFloat(
          s.google_cafe.latitude.toString().replace(",", ".")
        );
        const cafeLon = parseFloat(
          s.google_cafe.longitude.toString().replace(",", ".")
        );
        const distance = getDistance(
          userLocation.lat,
          userLocation.lon,
          cafeLat,
          cafeLon
        );
        return { ...s, distance };
      }
      return s;
    });

    if (userLocation.lat && userLocation.lon && range) {
      tempData = tempData
        .filter((s) => s.distance <= range)
        .sort((a, b) => a.distance - b.distance);
    }

    if (filters && Object.keys(filters).length > 0) {
      tempData = tempData.filter((session) => {
        return Object.entries(filters).every(([questionId, filterValue]) => {
          if (
            !filterValue ||
            (Array.isArray(filterValue) && filterValue.length === 0)
          )
            return true;
          const answerObj = session.answers.find(
            (a) => a.start_question_id == questionId
          );
          if (!answerObj) return false;
          if (Array.isArray(filterValue)) {
            return filterValue.some((val) => answerObj.answer.includes(val));
          } else {
            return answerObj.answer.includes(filterValue);
          }
        });
      });
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    setMappedData(tempData);
  }, [courseSessions, userLocation, range, filters]);

  return (
    <div className="flex flex-col gap-5 text-black pt-36 max-lg:pt-20 pb-5 relative min-h-screen">
      {/* Sticky Header Alanı */}
      <motion.div
        animate={{
          y: showFilterBar ? 0 : -80,
          opacity: showFilterBar ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full sticky top-0 bg-white shadow-sm z-40 mt-7 max-md:mt-2 flex flex-col"
      >
        <FilterComp
          categories={categories}
          setFilters={setFilters}
          filters={filters}
          // setUserLocation prop'unu artık kullanmasan da FilterComp içinde manuel buton varsa diye bırakıyoruz
          setUserLocation={setUserLocation}
          userLocation={userLocation}
          range={range}
          setRange={setRange}
        />

        {/* --- 📍 KONUM BİLGİSİ GÖSTERİM ALANI --- */}
        <div className="w-full bg-gray-50 border-t border-gray-100 py-2 px-4 flex items-center justify-center text-sm md:text-base transition-all">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-3">
            {locationStatus === "loading" && (
              <span className="flex items-center gap-2 text-gray-500 animate-pulse">
                <RefreshCw className="animate-spin w-4 h-4" /> Konumunuz
                alınıyor...
              </span>
            )}

            {locationStatus === "error" && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span>{locationErrorMsg || "Konum alınamadı."}</span>
                <button
                  onClick={handleGetLocation}
                  className="underline font-semibold ml-1"
                >
                  Tekrar Dene
                </button>
              </div>
            )}
          </div>
        </div>
        {/* --- KONUM ALANI BİTİŞ --- */}
      </motion.div>

      <div className="w-full h-auto container mx-auto">
        <SessionListComp mappedData={mappedData} loading={loading} />
      </div>
    </div>
  );
}

export default CourseSessionsComp;
