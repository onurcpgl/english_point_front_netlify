"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLoadScript } from "@react-google-maps/api";

// Google Maps kütüphanelerini tanımlıyoruz
const libraries = ["places"];

export default function CafeLocationComp({ onSelectCafe }) {
  // --- STATE YÖNETİMİ ---
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]); // Google'dan gelen tahminler
  const [selectedCafe, setSelectedCafe] = useState(null); // Seçilen kafe detayları
  const [isOpen, setIsOpen] = useState(false);

  // Google Script Yüklemesi
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY, // .env dosyana eklemelisin
    libraries: libraries,
  });

  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  // Servisleri başlat
  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      // PlacesService için sanal bir div oluşturuyoruz (görünür harita olmadığı için)
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
    }
  }, [isLoaded]);

  // --- GOOGLE API İŞLEMLERİ ---

  // 1. Kullanıcı yazdıkça tahminleri getir
  const handleInputChange = (e) => {
    const value = e.target.value;

    setInputValue(value);
    setIsOpen(true);

    if (!value || !autocompleteService.current) {
      setOptions([]);
      return;
    }

    const request = {
      input: value,
      types: ["cafe"], // Sadece bu tipleri ara
      // componentRestrictions: { country: "tr" }, // Sadece Türkiye içi aramak istersen aç
    };

    autocompleteService.current.getPlacePredictions(request, (results) => {
      setOptions(results || []);
    });
  };

  // 2. Listeden seçim yapıldığında detayları çek (Fotoğraf, Koordinat vb.)
  const handleSelect = (placeId) => {
    if (!placesService.current) return;

    const request = {
      placeId: placeId,
      fields: ["name", "formatted_address", "geometry", "photos"], // Bize lazım olan alanlar
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Google fotoğrafını URL'e çevir
        const photoUrl =
          place.photos && place.photos.length > 0
            ? place.photos[0].getUrl({ maxWidth: 400 })
            : null;

        const cafeData = {
          name: place.name,
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          image: photoUrl,
          googlePlaceId: placeId,
        };

        setSelectedCafe(cafeData);
        setInputValue(place.name);
        setIsOpen(false);

        // Üst bileşene veriyi gönder
        if (onSelectCafe) {
          onSelectCafe(cafeData);
        }
      }
    });
  };

  if (!isLoaded)
    return <div className="h-14 bg-gray-100 rounded animate-pulse" />;

  return (
    <div className="w-full space-y-6">
      <div className="relative w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cafe Location (Google)
        </label>

        {/* --- INPUT AREA --- */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search for a cafe via Google..."
            className="w-full h-14 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black transition-all"
            onFocus={() => setIsOpen(true)}
          />
          {/* Search Icon */}
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
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
              ></path>
            </svg>
          </div>
        </div>

        {/* --- GOOGLE PREDICTIONS DROPDOWN (Vertical List) --- */}
        {isOpen && options.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.place_id}
                onClick={() => handleSelect(option.place_id)}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors flex items-center gap-3"
              >
                {/* Google Map Icon */}
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
                <div>
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

      {/* --- DETAIL CARD (Senin Orijinal Tasarımın) --- */}
      {selectedCafe && (
        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            {/* Left: Large Image (Google Photo) */}
            <div className="w-full md:w-1/3 h-48 md:h-auto relative bg-gray-200">
              {selectedCafe.image ? (
                // next/image kullandığımız için remote image config gerekebilir
                // Şimdilik standart img etiketi kullanıyorum ki config ile uğraşma
                <img
                  src={selectedCafe.image}
                  alt={selectedCafe.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
              {/* Title & Badge */}
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedCafe.name}
                </h3>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                  Google Verified
                </span>
              </div>

              {/* Address Box */}
              <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
                <div className="mt-0.5 text-blue-500">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
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
    </div>
  );
}
