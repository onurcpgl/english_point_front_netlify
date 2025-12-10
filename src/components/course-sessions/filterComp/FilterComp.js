import { useState, forwardRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X, Filter } from "lucide-react";
import { IoMdArrowDropdown } from "react-icons/io";
import { DatePicker, registerLocale } from "react-datepicker";
import { tr } from "date-fns/locale/tr";
import GetLocation from "../../../components/get-location/GetLocation";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import generalService from "../../../utils/axios/generalService";
import ErrorModal from "../../ui/ErrorModal/ErrorModal";
function FilterComp({
  categories,
  filters, // <-- Gerçek filtre verisi (Şu an pasif)
  setFilters, // <-- Gerçek filtreleme fonksiyonu (Şu an pasif)
  setUserLocation,
  userLocation,
  range,
  setRange,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedAddressTitle, setSelectedAddressTitle] = useState(null);
  const [visualFilters, setVisualFilters] = useState({});
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const activeFilters = visualFilters;
  const { data: myAddresses } = useQuery({
    queryKey: ["myAddresses"],
    queryFn: generalService.getMyAdresses,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  registerLocale("tr", tr);

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-4xl shadow-xl border border-gray-100 cursor-pointer w-full md:w-auto bg-white"
    >
      <label className="font-semibold">Tarih:</label>
      <span className="max-w-28 truncate">{value || "Seçiniz"}</span>
      <IoMdArrowDropdown className="text-2xl ml-auto md:ml-0" />
    </div>
  ));
  CustomInput.displayName = "CustomInput";

  const handleFilterChange = (key, value) => {
    // 1. GÖRSEL GÜNCELLEME (AÇIK): Ekranda seçim değişsin
    setVisualFilters((prev) => ({ ...prev, [key]: value }));

    // 2. GERÇEK FİLTRELEME (KAPALI): Veriler değişmesin
    /* setFilters((prev) => ({ ...prev, [key]: value }));
     */

    if (key !== 4) setOpenDropdown(null);
  };

  const handleMultiFilterChange = (filterKey, option) => {
    // Görsel state için hesaplama
    setVisualFilters((prev) => {
      const currentValues = prev[filterKey] || [];
      if (option === "all") return { ...prev, [filterKey]: [] };

      if (currentValues.includes(option)) {
        return {
          ...prev,
          [filterKey]: currentValues.filter((val) => val !== option),
        };
      } else {
        return { ...prev, [filterKey]: [...currentValues, option] };
      }
    });

    // GERÇEK FİLTRELEME (KAPALI)
    /*
    setFilters((prev) => {
      const currentValues = prev[filterKey] || [];
      if (option === "all") return { ...prev, [filterKey]: [] };
      if (currentValues.includes(option)) {
        return {
          ...prev,
          [filterKey]: currentValues.filter((val) => val !== option),
        };
      } else {
        return { ...prev, [filterKey]: [...currentValues, option] };
      }
    });
    */
  };

  const clearAllFilters = () => {
    // Görseli temizle
    setVisualFilters({});

    // Gerçeği temizle (KAPALI)
    // setFilters({});

    localStorage.removeItem("uniq_id");
    setStartDate(new Date());
    clearAddressSelection();
  };
  const handleAddressSelect = (address) => {
    if (address.latitude && address.longitude) {
      setUserLocation({
        lat: parseFloat(address.latitude),
        lon: parseFloat(address.longitude),
      });
      setSelectedAddressTitle(address.title);
      setOpenDropdown(null);
    } else {
      setErrorMessage("Bu adresin konum bilgisi eksik.");
      setErrorModalOpen(true);
    }
  };
  const clearAddressSelection = () => {
    setSelectedAddressTitle(null);
    setUserLocation({ lat: null, lon: null });
  };
  const AddressDropdown = () => (
    <div className="relative h-fit w-full md:w-auto">
      <ErrorModal
        open={errorModalOpen}
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />

      <button
        onClick={() => toggleDropdown("address-filter")}
        className={`flex items-center justify-between px-3 py-2 rounded-4xl shadow-xl cursor-pointer w-full md:min-w-40 border border-gray-100 bg-white ${
          selectedAddressTitle ? "bg-black text-black" : "text-black"
        }`}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="text-md font-light truncate">
            {selectedAddressTitle || "Kayıtlı Adreslerim"}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            openDropdown === "address-filter" ? "rotate-180" : ""
          }`}
        />
      </button>

      {openDropdown === "address-filter" && (
        <div className="absolute w-full md:w-[250px] top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="py-1">
            {selectedAddressTitle && (
              <button
                onClick={clearAddressSelection}
                className="w-full px-4 py-2 text-left text-md text-red-500 hover:bg-red-50 font-bold border-b border-gray-100"
              >
                Seçimi Temizle
              </button>
            )}
            {myAddresses?.length > 0 ? (
              myAddresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => handleAddressSelect(addr)}
                  className={`w-full px-4 py-3 text-left text-md hover:bg-black text-black hover:text-white transition-colors flex flex-col items-start border-b border-gray-50 last:border-0 ${
                    selectedAddressTitle === addr.title ? "bg-gray-100" : ""
                  }`}
                >
                  <span className="font-bold flex items-center gap-2">
                    {addr.main_adress ? (
                      <Home size={14} />
                    ) : (
                      <MapPin size={14} />
                    )}
                    {addr.title}
                  </span>
                  <span className="text-xs opacity-70 truncate w-full">
                    {addr.district} / {addr.city}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                Kayıtlı adres yok.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
  const DropdownButton = ({ label, value, options, filterKey, icon: Icon }) => (
    <div className="relative h-fit w-full md:w-auto">
      <button
        onClick={() => toggleDropdown(filterKey)}
        className={`flex items-center justify-between px-3 py-2 rounded-4xl shadow-xl cursor-pointer w-full md:min-w-40 border border-gray-100 bg-white ${
          value ? "text-gray-700" : "text-black"
        }`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          <span className="text-md font-light truncate">{value || label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            openDropdown === filterKey ? "rotate-180" : ""
          }`}
        />
      </button>

      {openDropdown === filterKey && (
        <div className="absolute w-full md:w-[200px] top-full left-0 md:-left-5 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleFilterChange(filterKey, option)}
                className={`w-full px-4 py-2 text-left text-md hover:bg-black hover:text-white transition-colors ${
                  value === option ? "text-black bg-[#fdd207]" : "text-black"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const MultiSelectDropdown = ({
    label,
    value,
    options,
    filterKey,
    icon: Icon,
  }) => {
    const selectedValues = Array.isArray(value) ? value : [];

    // Toggle işlemini handleMultiFilterChange içine taşıdık, burası sadece tetikleyici
    const toggleOption = (option) => {
      handleMultiFilterChange(filterKey, option);
    };

    const toggleDropdownRef = useRef();
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          toggleDropdownRef.current &&
          !toggleDropdownRef.current.contains(event.target)
        ) {
          // setOpenDropdown(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [openDropdown]);

    return (
      <div ref={toggleDropdownRef} className="relative w-full md:w-auto">
        <button
          onClick={() => toggleDropdown(filterKey)}
          className={`flex items-center justify-between px-3 py-2 rounded-4xl shadow-xl cursor-pointer w-full md:min-w-40 border border-gray-100 bg-white ${
            selectedValues.length ? "text-gray-700" : "text-black"
          }`}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            <span className="text-md font-light truncate">
              {selectedValues.length ? selectedValues.join(", ") : label}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openDropdown === filterKey ? "rotate-180" : ""
            }`}
          />
        </button>

        {openDropdown === filterKey && (
          <div className="absolute top-full w-full md:w-[440px] left-0 md:-left-28 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto p-2">
            <div className="space-y-3 flex flex-wrap justify-center items-center gap-3 p-4 rounded-xl">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`group text-sm relative px-5 py-3 rounded-4xl cursor-pointer transition-all duration-200 shadow-lg border ${
                    selectedValues.includes(option)
                      ? "bg-[#ffd207] text-black border-transparent shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFilterInputs = () => {
    return categories?.map((item) => {
      const values = item.options["tr"];

      // NOT: Burada 'activeFilters' kullanıyoruz (görsel state).
      // İleride gerçek state'e dönmek için 'activeFilters' tanımını değiştirmek yeterli.

      if (item.question_type === "single")
        return (
          <DropdownButton
            key={item.id}
            label={item.question["tr"]}
            value={activeFilters[item.id] || ""}
            options={values}
            filterKey={item.id}
          />
        );
      if (item.question_type === "checkbox")
        return (
          <MultiSelectDropdown
            key={item.id}
            label={item.question["tr"]}
            value={activeFilters[item.id] || []}
            options={values}
            filterKey={item.id}
          />
        );
      if (item.question_type === "date")
        return (
          <div key={item.id} className="w-full md:w-auto">
            <DatePicker
              locale="tr"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput />}
              wrapperClassName="w-full"
            />
          </div>
        );
      if (item.question_type === "multiple")
        return (
          <MultiSelectDropdown
            key={item.id}
            label={item.question["tr"]}
            value={activeFilters[item.id] || ""}
            options={values}
            filterKey={item.id}
          />
        );
      if (item.question_type === "text")
        return (
          <input
            key={item.id}
            type="text"
            placeholder={item.question["tr"]}
            value={activeFilters[item.id] || ""}
            onChange={(e) => handleFilterChange(item.id, e.target.value)}
            className="border border-gray-200 shadow-xl px-3 py-2 rounded-4xl w-full md:w-40 text-md"
          />
        );
      return null;
    });
  };

  const renderActiveTags = () => (
    <div className="flex flex-wrap gap-2">
      {/* Burada da activeFilters kullanıyoruz ki etiketler ekranda belirebilsin */}
      {/* 👇 YENİ EKLENECEK KISIM: Seçili adres varsa etiket olarak göster */}
      {selectedAddressTitle && (
        <span className="px-3 py-1 text-sm font-semibold rounded-full gap-2 bg-black text-white shadow-md border border-black flex justify-center items-center">
          📍 {selectedAddressTitle}
          <X
            size={16}
            onClick={clearAddressSelection}
            className="ml-1 text-gray-300 hover:text-white cursor-pointer"
          />
        </span>
      )}
      {Object.entries(activeFilters).map(([filterKey, value]) => {
        if (Array.isArray(value)) {
          return value
            .filter((val) => val && val.trim().length > 0)
            .map((val) => (
              <span
                key={`${filterKey}-${val}`}
                className="px-3 py-1 text-sm font-semibold rounded-full gap-2 bg-white shadow-md border border-gray-100 flex justify-center items-center"
              >
                {val}
                <X
                  size={16}
                  onClick={
                    () =>
                      // Çarpıya basınca görsel state'den sil
                      setVisualFilters((prev) => {
                        const updatedValues = prev[filterKey].filter(
                          (v) => v !== val
                        );
                        if (updatedValues.length === 0) {
                          const { [filterKey]: _, ...rest } = prev;
                          return rest;
                        }
                        return { ...prev, [filterKey]: updatedValues };
                      })
                    // GERÇEK SİLME İŞLEMİ (KAPALI)
                    /*
                    setFilters((prev) => { ... })
                    */
                  }
                  className="ml-1 text-gray-500 hover:text-red-500 cursor-pointer"
                />
              </span>
            ));
        } else {
          if (!value || value.trim().length === 0) return null;
          return (
            <span
              key={`${filterKey}-${value}`}
              className="px-3 py-1 text-sm font-semibold rounded-full gap-2 bg-white shadow-md border border-gray-100 flex justify-center items-center"
            >
              {value}
              <X
                size={16}
                onClick={
                  () =>
                    // Görsel silme
                    setVisualFilters((prev) => {
                      const updated = { ...prev };
                      delete updated[filterKey];
                      return updated;
                    })
                  // GERÇEK SİLME (KAPALI)
                  /*
                  setFilters((prev) => { ... })
                  */
                }
                className="ml-1 text-gray-500 hover:text-red-500 cursor-pointer"
              />
            </span>
          );
        }
      })}
    </div>
  );

  return (
    <div className="w-full container mx-auto bg-white z-50 px-4 md:px-0">
      {/* DESKTOP GÖRÜNÜM */}
      <div className="hidden md:flex mx-auto pt-4 gap-4 justify-between">
        <div className="flex flex-wrap gap-3 w-3/4 h-fit">
          {renderFilterInputs()}
          <AddressDropdown />
        </div>

        <div className="w-1/4 flex flex-col justify-end items-end gap-4">
          <div className="w-full flex justify-end items-end">
            {/* KONUM FİLTRESİ AKTİF (Gerçek fonksiyonları kullanıyor) */}
            <GetLocation
              setUserLocation={setUserLocation}
              userLocation={userLocation}
              setRange={setRange}
              range={range}
            />
          </div>
          <button
            onClick={() => clearAllFilters()}
            className="cursor-pointer bg-black text-white rounded-4xl px-4 py-2 hover:scale-105 transition-all text-sm font-bold"
          >
            Filtreleri Kaldır
          </button>
        </div>
      </div>

      {/* MOBİL ÜST BAR */}
      <div className="md:hidden pt-4 pb-2 flex justify-between items-center gap-3 max-md:flex-col">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex-1 bg-black max-md:w-full text-white px-4 py-3 rounded-4xl flex justify-center items-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Filter size={18} />
          <span className="font-bold">Filtrele</span>
          {Object.keys(activeFilters).length > 0 && (
            <span className="bg-[#FFD207] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.keys(activeFilters).length}
            </span>
          )}
        </button>
        <div className="w-fit max-md:w-full">
          <GetLocation
            setUserLocation={setUserLocation}
            userLocation={userLocation}
            setRange={setRange}
            range={range}
          />
        </div>
      </div>

      {/* MOBİL FİLTRE EKRANI */}
      {showMobileFilters &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[99999999] bg-white flex flex-col animate-in slide-in-from-bottom-10 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white shadow-sm">
              <h2 className="text-xl font-bold flex text-black items-center gap-2">
                <Filter className="text-[#FFD207]" /> Filtreler
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X className="text-black" size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-20">
              <p className="text-sm text-gray-500 font-medium">
                Arama kriterlerinizi belirleyin:
              </p>
              <div className="flex flex-col gap-5">
                {renderFilterInputs()}
                <AddressDropdown />{" "}
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-white flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] absolute bottom-0 w-full">
              <button
                onClick={() => clearAllFilters()}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Temizle
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-[2] py-3 bg-[#FFD207] rounded-xl font-bold text-black shadow-md hover:bg-[#eec205] transition-colors"
              >
                Sonuçları Göster
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* SEÇİLİ FİLTRELER GÖSTERİMİ */}
      <div className="flex justify-start items-start my-4 px-1 md:px-0 overflow-x-auto pb-2">
        {activeFilters && Object.keys(activeFilters).length > 0 && (
          <p className="font-light pr-3 hidden md:block">Filtreleme:</p>
        )}
        <div className="w-full md:w-3/4">{renderActiveTags()}</div>
      </div>
    </div>
  );
}

export default FilterComp;
