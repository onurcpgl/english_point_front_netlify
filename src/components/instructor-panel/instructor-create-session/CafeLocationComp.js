"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useLoadScript } from "@react-google-maps/api";
import Cropper from "react-easy-crop";
import { FiCamera, FiX, FiCheck, FiMaximize, FiMinimize } from "react-icons/fi";
import { getCroppedImg } from "../../../utils/cropImage"; // Bu yardımcı fonksiyonun var olduğunu varsayıyoruz

const libraries = ["places"];

export default function CafeLocationComp({ onSelectCafe, initialValue }) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // --- Image & Crop States ---
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (initialValue) {
      setSelectedCafe(initialValue);
      setInputValue(initialValue.name || "");
    }
  }, [initialValue]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    libraries: libraries,
  });

  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement("div"),
      );
    }
  }, [isLoaded]);

  // --- Dosya Seçme ve Kırpma Mantığı ---
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImageSrc(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedBlob);

      // Dosya olarak sakla (Backend'e göndermek için)
      const croppedFile = new File([croppedBlob], "cafe_photo.jpg", {
        type: "image/jpeg",
      });

      const updatedCafe = {
        ...selectedCafe,
        image: croppedUrl,
        imageFile: croppedFile, // Form gönderilirken bu kullanılacak
      };

      setSelectedCafe(updatedCafe);
      if (onSelectCafe) onSelectCafe(updatedCafe);

      setImageSrc(null); // Modalı kapat
      setZoom(1);
    } catch (e) {
      console.error("Crop error:", e);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);
    if (!value || !autocompleteService.current) {
      setOptions([]);
      return;
    }
    const request = { input: value, types: ["cafe", "restaurant"] };
    autocompleteService.current.getPlacePredictions(request, (results) =>
      setOptions(results || []),
    );
  };

  const handleSelect = (placeId) => {
    if (!placesService.current) return;
    const request = {
      placeId: placeId,
      fields: [
        "name",
        "formatted_address",
        "geometry",
        "photos",
        "address_components",
        "url",
      ],
    };

    placesService.current.getDetails(request, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place
      ) {
        let district = "";
        let city = "";

        if (place.address_components) {
          const cityComp = place.address_components.find(
            (c) =>
              c.types.includes("administrative_area_level_1") ||
              c.types.includes("locality"),
          );
          if (cityComp) city = cityComp.long_name;
          const distComp = place.address_components.find(
            (c) =>
              c.types.includes("administrative_area_level_2") ||
              c.types.includes("sublocality"),
          );
          if (distComp) district = distComp.long_name;
        }

        const cafeData = {
          name: place.name,
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          image:
            "https://api.englishpoint.com.tr/public/google_cafe/google_cafe_image.jpg",
          google_place_id: placeId,
          district: district,
          city: city,
          map_url: place.url,
        };

        setSelectedCafe(cafeData);
        setInputValue(place.name);
        setIsOpen(false);
        if (onSelectCafe) onSelectCafe(cafeData);
      }
    });
  };

  if (!isLoaded)
    return <div className="h-14 bg-gray-100 rounded animate-pulse" />;

  return (
    <div className="w-full space-y-6 px-4">
      {/* --- ARAMA INPUTU (AYNI TASARIM) --- */}
      <div className="relative w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cafe/Location:
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search for a cafe via Google..."
            className="w-full h-14 outline-none px-4 bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
            onFocus={() => setIsOpen(true)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {isOpen && options.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.place_id}
                onClick={() => handleSelect(option.place_id)}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">
                    {option.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-gray-500">
                    {option.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- DETAY KARTI (AYNI TASARIM + RESİM YÜKLEME) --- */}
      {selectedCafe && (
        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 h-48 md:h-auto relative bg-gray-200 group">
              <Image
                src={
                  selectedCafe.image ||
                  "https://api.englishpoint.com.tr/public/google_cafe/google_cafe_image.jpg"
                }
                alt={selectedCafe.name}
                fill
                className="object-cover"
              />
              {/* Resim Yükleme Overlay */}
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[#ffd207] cursor-pointer transition-all duration-200">
                <FiCamera size={32} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase mt-2">
                  Change Cafe Photo
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedCafe.name}
                </h3>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 uppercase">
                  Google Verified
                </span>
              </div>
              <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
                <div className="mt-0.5 text-blue-500">
                  <FiMapPin size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Location / Address
                  </h4>
                  <p className="text-sm text-gray-700 leading-snug">
                    {selectedCafe.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAM EKRAN (FULL-SCREEN) KIRPMA MODALI --- */}
      {imageSrc && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col animate-in fade-in duration-300">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 bg-black border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 bg-[#ffd207]" />
              <h2 className="text-white font-bold uppercase tracking-widest text-sm">
                Crop Cafe Photo
              </h2>
            </div>
            <button
              onClick={() => setImageSrc(null)}
              className="text-white hover:text-red-500 transition-colors"
            >
              <FiX size={28} />
            </button>
          </div>

          {/* Kırpma Alanı (Gövde) */}
          <div className="flex-1 relative bg-black">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="rect"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Footer (Kontroller) */}
          <div className="h-32 bg-black border-t border-gray-800 flex flex-col items-center justify-center px-6 shrink-0 gap-4">
            <div className="w-full max-w-xs flex items-center gap-4">
              <FiMinimize className="text-gray-500" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#ffd207]"
              />
              <FiMaximize className="text-gray-500" />
            </div>
            <button
              type="button" // 🔥 Bunu eklemezsen formu gönderir!
              onClick={handleCropSave}
              className="bg-[#ffd207] text-black px-12 py-3 font-bold uppercase text-sm hover:bg-white transition-all flex items-center gap-2"
            >
              <FiCheck size={20} strokeWidth={3} />
              Save Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Yardımcı İkon (Opsiyonel ama şıklık katar)
function FiMapPin({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
