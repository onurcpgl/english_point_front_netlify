import { useState, forwardRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  X,
  Filter,
  Briefcase,
  MessageSquare,
  MessageCircle,
  List,
} from "lucide-react";

import { IoMdArrowDropdown } from "react-icons/io";
import { DatePicker, registerLocale } from "react-datepicker";
import { tr } from "date-fns/locale/tr";
import GetLocation from "../../../components/get-location/GetLocation";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import generalService from "../../../utils/axios/generalService";
import ErrorModal from "../../ui/ErrorModal/ErrorModal";
import ilData from "../../../utils/helpers/il";
import ilceData from "../../../utils/helpers/ilce";

function FilterComp({
  categories,
  categoriesLoading,
  filters, // Parent'tan gelen (veya local'den set edilen) filtreler
  setFilters, // Gerçek filtreleme fonksiyonu
  setUserLocation,
  handleGetLocation,
  userLocation,
  range,
  setRange,
  locationSelection,
  setLocationSelection,
  setSelectedSkillTitle,
  selectedSkillTitle,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedAddressTitle, setSelectedAddressTitle] = useState(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  // Görsel state
  const [visualFilters, setVisualFilters] = useState({});

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Ekranda gösterilecek filtreler visualFilters'dır
  const activeFilters = visualFilters;

  const handleSkillSelect = (skill) => {
    // 1. Dropdown üzerindeki yazıyı güncelle
    setSelectedSkillTitle(skill);

    // 2. GÖRSEL FİLTRELERE EKLE (Aşağıda etiket olarak görünmesi için)
    setVisualFilters((prev) => ({
      ...prev,
      english_skill: skill.title, // Key: 'english_skill', Değer: 'Business English'
    }));

    // 3. GERÇEK FİLTRELERE EKLE (API'ye istek atması için)
    // NOT: Backend'de bu parametrenin adı 'program_category_slug' ise böyle kalsın.
    // Değilse backend'deki parametre adını yaz.
    setFilters((prev) => ({
      ...prev,
      program_category_slug: skill.title, // skill.id -> 'business' veya 'daily'
    }));

    setOpenDropdown(null); // Menüyü kapat
  };

  const clearSkillSelection = (e) => {
    // 1. Tıklama olayını durdur
    if (e) e.stopPropagation();

    // 2. Dropdown yazısını sıfırla
    setSelectedSkillTitle(null);

    // 3. GÖRSEL FİLTRELERDEN SİL (DÜZELTİLEN KISIM)
    setVisualFilters((prev) => {
      const { english_skill, program_category_slug, ...rest } = prev;
      return rest;
    });

    // 4. GERÇEK FİLTRELERDEN SİL (Backend isteği için)
    setFilters((prev) => {
      const { program_category_slug, ...rest } = prev;
      return rest;
    });

    // 5. Menüyü kapat
    setOpenDropdown(null);
  };

  const { data: myAddresses } = useQuery({
    queryKey: ["myAddresses"],
    queryFn: generalService.getMyAdresses,
  });

  // --- İL SEÇİMİ ---
  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const index = e.target.selectedIndex;
    const cityName = index > 0 ? e.target.options[index].text : "";

    // Kayıtlı adresi temizle
    clearAddressSelection();

    // 1. State'i güncelle
    setLocationSelection({
      cityId: cityId,
      cityName: cityName,
      district: "", // İl değişince ilçe sıfırlanır
    });

    // 2. ESKİ USUL FİLTRELEME (useMemo yok)
    if (cityId) {
      // ilceData[0].data içinden o ile ait ilçeleri bul
      const dists = ilceData[0].data.filter(
        (d) => String(d.il_id) === String(cityId),
      );
      setFilteredDistricts(dists);
    } else {
      setFilteredDistricts([]);
    }
  };
  // --- İLÇE SEÇİMİ VE FİLTRELEME ---
  const handleDistrictChange = (e) => {
    const districtName = e.target.value;

    // Local state'i güncelle
    setLocationSelection((prev) => ({
      ...prev,
      district: districtName,
    }));

    // Filtreleme mantığı
    const locationLabel = `${locationSelection.cityName} / ${districtName}`;
    setVisualFilters((prev) => ({ ...prev, location: locationLabel }));

    setFilters((prev) => ({
      ...prev,
      city: locationSelection.cityName,
      district: districtName,
    }));

    setOpenDropdown(null);
  };

  // --- TEMİZLEME FONKSİYONU ---
  const clearLocationLocalState = () => {
    setLocationSelection({
      cityId: "",
      cityName: "",
      district: "",
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- KRİTİK EKLEME: LocalStorage veya dışarıdan gelen filters prop'unu görsel state'e eşitle ---
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      setVisualFilters(filters);
    } else {
      // Eğer dışarıdan filtreler temizlenirse görseli de temizle
      // setVisualFilters({}); // İsteğe bağlı, sonsuz döngüye dikkat
    }
  }, [filters]);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  const toggleLocationDropdown = (e) => {
    e.stopPropagation();
    setIsLocationOpen((prev) => !prev);
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
    // 1. GÖRSEL GÜNCELLEME
    setVisualFilters((prev) => ({ ...prev, [key]: value }));

    // 2. GERÇEK FİLTRELEME (AÇIK)
    setFilters((prev) => ({ ...prev, [key]: value }));

    if (key !== 4) setOpenDropdown(null);
  };

  const handleMultiFilterChange = (filterKey, option) => {
    // 1. GÖRSEL GÜNCELLEME
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

    // 2. GERÇEK FİLTRELEME (AÇIK)
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
  };

  const clearAllFilters = () => {
    // Görseli temizle
    setVisualFilters({});
    clearLocationLocalState();
    setSelectedSkillTitle(null);
    // Gerçeği temizle (AÇIK)
    setFilters({});
    localStorage.removeItem("uniq_id");
    setStartDate(new Date());
    clearAddressSelection();
  };
  const handleAddressSelect = (address) => {
    if (address.latitude && address.longitude) {
      // 1. Kayıtlı Adresi Set Et
      setUserLocation({
        lat: parseFloat(address.latitude),
        lon: parseFloat(address.longitude),
      });
      setSelectedAddressTitle(address.title);

      // --- YENİ EKLENEN KISIM: Manuel İl/İlçe Seçimini Temizle ---
      clearLocationLocalState(); // State'leri sıfırla

      // Filtre objesinden il/ilçe verilerini sil (Backend'e gitmesin)
      setVisualFilters((prev) => {
        const { location, ...rest } = prev;
        return rest;
      });
      setFilters((prev) => {
        const { city, district, ...rest } = prev;
        return rest;
      });
      // ------------------------------------------------------------

      setOpenDropdown(null); // Menüyü kapat
    } else {
      setErrorMessage("Bu adresin konum bilgisi eksik.");
      setErrorModalOpen(true);
    }
  };

  const clearAddressSelection = () => {
    setSelectedAddressTitle(null);
    handleGetLocation();
    //setUserLocation({ lat: null, lon: null });
  };
  const handleClearLocation = (e) => {
    // 1. Menünün kapanmasını veya event çakışmasını önle
    if (e) e.stopPropagation();

    // 2. Seçili il/ilçe local state'ini sıfırla
    clearLocationLocalState();

    // 3. Kalan ilçe listesini temizle
    setFilteredDistricts([]);

    // 4. Görsel filtrelerden TÜM İLGİLİ KEYLERİ sil
    setVisualFilters((prev) => {
      // 'location': Senin elle eklediğin key
      // 'city' ve 'district': useEffect tarafından filters'dan kopyalanmış olabilecek keyler
      const { location, city, district, ...rest } = prev;
      return rest;
    });

    // 5. Gerçek filtrelerden "city" ve "district" key'lerini sil
    setFilters((prev) => {
      const { city, district, ...rest } = prev;
      return rest;
    });

    // Dropdown açıksa kapat (opsiyonel, garanti olsun diye)
    setIsLocationOpen(false);
  };
  const locationRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    }
    // Event listener ekle
    document.addEventListener("mousedown", handleClickOutside);
    // Temizlik
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const CityDistrictSelector = () => (
    // 4. YENİ: ref={locationRef} buraya eklendi. Artık div'in sınırları belli.
    <div ref={locationRef} className="relative h-fit w-full md:w-auto">
      {/* Tetikleyici Buton */}
      <button
        onClick={toggleLocationDropdown}
        className={`flex items-center justify-between px-3 py-2 rounded-4xl shadow-xl cursor-pointer w-full md:min-w-40 border border-gray-100 bg-white ${
          locationSelection.cityId
            ? "text-black bg-gray-50 border-gray-200"
            : "text-black"
        }`}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="text-md font-light truncate">
            {locationSelection.cityName
              ? `${locationSelection.cityName} ${
                  locationSelection.district
                    ? `/ ${locationSelection.district}`
                    : ""
                }`
              : "İl / İlçe Seç"}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isLocationOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown İçeriği */}
      {isLocationOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute w-full md:w-[280px] top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] p-4 flex flex-col gap-3 "
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-1">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Konum Seçimi
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLocationOpen(false);
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} className="text-gray-400 hover:text-black" />
            </button>
          </div>

          {/* İl Seçimi */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 ml-1">İl</span>
            <select
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FFD207] focus:border-transparent outline-none bg-gray-50 cursor-pointer text-black"
              value={locationSelection.cityId}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                // stopPropagation burada önemli, yoksa yukarı bubbling yapıp kapatabilir
                e.stopPropagation();
                handleCityChange(e);
              }}
            >
              <option value="">İl Seçiniz</option>
              {ilData[0].data.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* İlçe Seçimi */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 ml-1">İlçe</span>
            <select
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FFD207] focus:border-transparent outline-none bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors cursor-pointer text-black"
              value={locationSelection.district}
              onChange={(e) => {
                e.stopPropagation();
                handleDistrictChange(e);
              }}
              disabled={!locationSelection.cityId}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">
                {locationSelection.cityId ? "İlçe Seçiniz" : "Önce İl Seçin"}
              </option>
              {filteredDistricts.map((dist) => (
                <option key={dist.id} value={dist.name}>
                  {dist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Temizle Butonu */}
          {locationSelection.cityId && (
            <button
              onClick={handleClearLocation} // Artık yeni fonksiyonu çağırıyoruz
              className="text-xs text-red-500 hover:text-red-700 font-bold self-end mt-1 border-b border-transparent hover:border-red-500 transition-colors"
            >
              Seçimi Temizle
            </button>
          )}
        </div>
      )}
    </div>
  );
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
        <div className="absolute w-full md:w-[250px] top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
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

  const EnglishSkillsDropdown = () => {
    // Seçenekleri burada tanımlıyoruz
    const skillOptions = [
      { id: "bussines", title: "Business English" },
      { id: "daily", title: "Daily English Skills" },
    ];

    return (
      <div className="relative h-fit w-full md:w-auto">
        <button
          onClick={() => toggleDropdown("english-filter")}
          className={`flex items-center justify-between px-3 py-2 rounded-4xl shadow-xl cursor-pointer w-full md:min-w-40 border border-gray-100 bg-white ${
            selectedSkillTitle ? "bg-black text-white" : "text-black"
          }`}
        >
          <div className="flex items-center gap-2 text-black">
            <List className="w-4 h-4" />
            <span className="text-md font-light truncate">
              {selectedSkillTitle?.title || "Kategori Seç"}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openDropdown === "english-filter" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openDropdown === "english-filter" && (
          <div className="absolute w-full md:w-[250px] top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="py-1">
              {/* Seçimi Temizle */}
              {selectedSkillTitle && (
                <button
                  onClick={clearSkillSelection}
                  className="w-full px-4 py-2 text-left text-md text-red-500 hover:bg-red-50 font-bold border-b border-gray-100"
                >
                  Seçimi Temizle
                </button>
              )}

              {/* Sabit İki Seçenek */}
              {skillOptions.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => handleSkillSelect(skill)}
                  className={`w-full px-4 py-3 text-left text-md hover:bg-black text-black hover:text-white transition-colors flex flex-col items-start border-b border-gray-50 last:border-0 ${
                    selectedSkillTitle === skill.title ? "bg-gray-100" : ""
                  }`}
                >
                  <span className="font-bold flex items-center gap-2">
                    {skill.id === "business" ? (
                      <Briefcase size={14} />
                    ) : (
                      <MessageCircle size={14} />
                    )}
                    {skill.title}
                  </span>
                  <span className="text-xs opacity-70">
                    {skill.id === "business"
                      ? "Profesyonel Yetkinlik"
                      : "Günlük Konuşma"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

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
      {/* Seçili adres etiketi */}
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

      {/* Dinamik filtre etiketleri */}
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
                  onClick={() => {
                    // 1. Görsel Silme
                    setVisualFilters((prev) => {
                      const updatedValues = prev[filterKey].filter(
                        (v) => v !== val,
                      );
                      if (updatedValues.length === 0) {
                        const { [filterKey]: _, ...rest } = prev;
                        return rest;
                      }
                      return { ...prev, [filterKey]: updatedValues };
                    });

                    // 2. Gerçek Silme (AÇIK)
                    setFilters((prev) => {
                      const currentValues = prev[filterKey] || [];
                      const updatedValues = currentValues.filter(
                        (v) => v !== val,
                      );
                      if (updatedValues.length === 0) {
                        const { [filterKey]: _, ...rest } = prev;
                        return rest;
                      }
                      return { ...prev, [filterKey]: updatedValues };
                    });
                  }}
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
                onClick={() => {
                  // 1. Görsel Silme
                  setVisualFilters((prev) => {
                    const updated = { ...prev };
                    delete updated[filterKey];
                    return updated;
                  });

                  // 2. Gerçek Silme (AÇIK)
                  setFilters((prev) => {
                    const updated = { ...prev };
                    delete updated[filterKey];
                    return updated;
                  });
                }}
                className="ml-1 text-gray-500 hover:text-red-500 cursor-pointer"
              />
            </span>
          );
        }
      })}
    </div>
  );
  const renderSkeletonLoader = () => {
    // Tahmini olarak 4-5 tane filtre geleceğini varsayarak array oluşturuyoruz
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          // Inputların stiline (rounded-4xl, h-10 vb.) benzeyen gri kutular
          className="h-10 w-full md:w-40 bg-gray-200 rounded-4xl animate-pulse"
        />
      ));
  };

  return (
    <div className="w-full container mx-auto bg-white z-50 px-4 md:px-0 transition-all">
      {/* DESKTOP GÖRÜNÜM */}
      <div className="hidden md:flex mx-auto pt-4 gap-4 justify-between">
        <div className="flex flex-wrap gap-3 w-3/4 h-fit">
          {!categoriesLoading ? (
            <>
              {/* {renderFilterInputs()} */}
              <AddressDropdown />
              <CityDistrictSelector />
              <EnglishSkillsDropdown />
            </>
          ) : (
            renderSkeletonLoader()
          )}
        </div>

        <div className="w-1/4 flex flex-col justify-end items-end gap-4">
          <div className="w-full flex justify-end items-end">
            <GetLocation
              setUserLocation={setUserLocation}
              userLocation={userLocation}
              setRange={setRange}
              range={range}
            />
          </div>
          <div className="w-full flex justify-between ">
            <p className=" text-black font-bold mb-2 text-sm">{range}km</p>
            <button
              onClick={() => clearAllFilters()}
              className="cursor-pointer bg-black text-white rounded-4xl px-4 py-2 hover:scale-105 transition-all text-sm font-bold"
            >
              Filtreleri Kaldır
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL ÜST BAR */}
      <div className="md:hidden pt-4 max-lg:pt-0 pb-2 flex justify-between items-center gap-3 max-md:flex-col">
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
                {/* {renderFilterInputs()} */}
                <AddressDropdown /> <CityDistrictSelector />
                <EnglishSkillsDropdown />
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
          document.body,
        )}

      {/* SEÇİLİ FİLTRELER GÖSTERİMİ */}
      <div
        className={
          activeFilters && Object.keys(activeFilters).length > 0
            ? `flex justify-start items-start my-4 px-1 md:px-0 overflow-x-auto pb-2`
            : "pb-2"
        }
      >
        {activeFilters && Object.keys(activeFilters).length > 0 && (
          <p className="font-light pr-3 hidden md:block">Filtreleme:</p>
        )}
        <div className="w-full md:w-3/4">{renderActiveTags()}</div>
      </div>
    </div>
  );
}

export default FilterComp;
