"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export default function CafeLocationComp({ onSelectCafe, initialValue }) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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
        document.createElement("div")
      );
    }
  }, [isLoaded]);

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
      types: ["cafe", "restaurant"],
    };

    autocompleteService.current.getPlacePredictions(request, (results) => {
      setOptions(results || []);
    });
  };

  // --- GÜNCELLENEN FONKSİYON BURASI ---
  const handleSelect = (placeId) => {
    if (!placesService.current) return;

    const request = {
      placeId: placeId,
      fields: [
        "name",
        "formatted_address",
        "geometry",
        "photos",
        "address_components", // Bu alanın istendiğinden emin olun
      ],
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        let district = "";
        let city = ""; // 1. ŞEHİR DEĞİŞKENİNİ TANIMLADIK

        if (place.address_components) {
          // --- İLÇE (DISTRICT) BULMA ---
          const districtComponent = place.address_components.find((component) =>
            component.types.includes("administrative_area_level_2")
          );

          const subLocalityComponent = place.address_components.find(
            (component) => component.types.includes("sublocality_level_1")
          );

          if (districtComponent) {
            district = districtComponent.long_name;
          } else if (subLocalityComponent) {
            district = subLocalityComponent.long_name;
          }

          // --- 2. ŞEHİR (CITY) BULMA MANTIĞI ---
          // administrative_area_level_1 genellikle İL (Province) bilgisidir.
          const cityComponent = place.address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          );

          if (cityComponent) {
            city = cityComponent.long_name;
          }
        }

        const photoUrl =
          "https://api.englishpoint.com.tr/public/google_cafe/google_cafe_image.jpg";

        const cafeData = {
          name: place.name,
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          image: photoUrl,
          google_place_id: placeId,
          district: district,
          city: city, // 3. ŞEHRİ VERİYE EKLEDİK
        };

        setSelectedCafe(cafeData);
        setInputValue(place.name);
        setIsOpen(false);

        if (onSelectCafe) {
          onSelectCafe(cafeData);
        }
      }
    });
  };

  if (!isLoaded)
    return <div className="h-14 bg-gray-100 rounded animate-pulse" />;

  return (
    <div className="w-full space-y-6 px-4">
      {/* INPUT ALANI AYNI KALDI */}
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
            className="w-full h-14 outline-none px-4 bg-white text-black placeholder:text-gray-400 border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
            onFocus={() => setIsOpen(true)}
          />
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

        {isOpen && options.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.place_id}
                onClick={() => handleSelect(option.place_id)}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors flex items-center gap-3"
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

      {/* DETAIL CARD */}
      {selectedCafe && (
        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 h-48 md:h-auto relative bg-gray-200">
              {/* Resim kısmını da düzelttim: artık dinamik gelen resmi kullanıyor */}
              <Image
                src={
                  selectedCafe.image ||
                  "https://api.englishpoint.com.tr/public/google_cafe/google_cafe_image.jpg"
                }
                alt={selectedCafe.name}
                loading="eager"
                className="w-full h-full object-cover"
                width={400}
                height={400}
              />
            </div>

            <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedCafe.name}
                </h3>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                  Google Verified
                </span>
              </div>

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
                  {/* District ve City bilgisini göstermek isterseniz burayı kullanabilirsiniz */}
                  {(selectedCafe.district || selectedCafe.city) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedCafe.district
                        ? selectedCafe.district + " / "
                        : ""}{" "}
                      {selectedCafe.city}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
