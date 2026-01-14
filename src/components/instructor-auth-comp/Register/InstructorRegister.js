"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import generalService from "../../../utils/axios/generalService";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
import FınalImage from "../../../assets/final/finalimage.png";
import ProfilePhotoCropperRegister from "../another-comp/ProfilePhotoCropperRegister";
import RegisterLastIcon from "../../../assets/final/register-last-icon.png";
import Logo from "../../../assets/logo/logo.png";
import { formatPhone } from "../../../utils/helpers/formatters";
import Image from "next/image";
import { AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
async function fetchCountries() {
  const res = await fetch("/countries.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Countries fetch failed");
  return res.json();
}

export default function InstructorRegister() {
  const {
    data: countries,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const wrapperRefCountryBirth = useRef(null);
  const wrapperRefCurrentLocation = useRef(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isOpenLevel, setIsOpenLevel] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isEduYearOpen, setIsEduYearOpen] = useState(false);
  const [existsingEmail, setExistingEmail] = useState(false);
  const filtered =
    countries
      ?.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name)) || [];

  const filteredCountries =
    countries
      ?.filter((c) =>
        c.name.toLowerCase().includes(searchCountry.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name)) || [];

  const filteredCities =
    selectedCountry?.stateProvinces
      ?.filter((s) => s.name.toLowerCase().includes(searchCity.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name)) || [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRefCountryBirth.current &&
        !wrapperRefCountryBirth.current.contains(event.target)
      ) {
        setIsOpen(false);
      }

      if (
        wrapperRefCurrentLocation.current &&
        !wrapperRefCurrentLocation.current.contains(event.target)
      ) {
        setIsCountryOpen(false);
        setIsCityOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const registerStepSection = useMemo(() => {
    return [
      {
        id: 1,
        title: "About",
        desc: "Start creating your public tutor profile. Your progress will be automatically saved as you complete each section. You can return at any time to finish your registration.",
      },
      {
        id: 2,
        title: "Photo",
        desc: "Choose a photo that will help learners get to know you.",
      },
      {
        id: 3,
        title: "Certification",
        desc: "Do you have teaching certificates? If so, describe them to enhance your profile credibility and get more students.",
      },
      {
        id: 4,
        title: "Education",
        desc: "Tell students more about the higher education that you've completed or are working on",
      },
      {
        id: 5,
        title: "Description",
        desc: "This info will go on your public profile. Write it in the language you’ll be teaching and make sure to follow our guidelines to get approved",
      },
      {
        id: 6,
        title: "Availability",
        desc: "A correct timezone is essential to coordinate lessons with international students",
      },
      { id: 7, title: "Ready" },
    ];
  }, []);

  const [selectedStepSection, setSelectedStepSection] = useState(1);
  const [certificateToggle, setCertificateToggle] = useState(true);
  const [availabilityToggle, setAvailabilityToggle] = useState(true);

  const [educationToggle, setEducationToggle] = useState(true);
  const [finalStep, setFinalStep] = useState(false);
  // Tüm adımların verisini tek yerde topla
  const [formData, setFormData] = useState({
    about: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country_birth: "",
      current_location: "",
      current_city: "",
      level: "",
    },
    photo: { file: null },
    certifications: [{ name: "", issuer: "", year: "", uploadCertificate: "" }],
    educations: [
      {
        university: "",
        degree: "",
        degree_type: "",
        specialization: "",
        graduationYear: "",
        uploadDegree: "",
      },
    ],
    description: { bio: "" },
    availability: [{ day: "sunday", timeFrom: "", timeTo: "" }],
  });
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const addAvailability = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [
        ...prev.availability,
        { day: "monday", timeFrom: "", timeTo: "" },
      ],
    }));
  };

  const updateAvailability = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeAvailability = (index) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };
  const [errors, setErrors] = useState({});

  const currentIndex = useMemo(
    () => registerStepSection.findIndex((s) => s.id === selectedStepSection),
    [selectedStepSection, registerStepSection]
  );

  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };
  const updateArrayField = (section, index, field, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      return { ...prev, [section]: updatedArray };
    });
  };
  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: "", issuer: "", year: "", uploadCertificate: null },
      ],
    }));
  };
  const removeCertification = (index) => {
    if (index != 0) {
      setFormData((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((_, i) => i !== index),
      }));
    }
  };
  // Education alanı ekleme
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        { degree: "", institution: "", graduationYear: "" },
      ],
    }));
  };

  // Education alanı silme
  const removeEducation = (index) => {
    if (index != 0) {
      setFormData((prev) => ({
        ...prev,
        educations: prev.educations.filter((_, i) => i !== index),
      }));
    }
  };

  const validateCurrent = () => {
    const step = selectedStepSection;
    let stepErrors = {};

    if (step === 1) {
      const {
        firstName,
        lastName,
        email,
        phone,
        country_birth,
        current_location,
        current_city,
        level,
      } = formData.about;

      if (!firstName) stepErrors.firstName = "First name is required";
      if (!lastName) stepErrors.lastName = "Last name is required";

      if (!email) {
        stepErrors.email = "Email is required";
      } else {
        // E-posta format kontrolü (regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          stepErrors.email = "Please enter a valid email address";
        }
      }

      if (!phone) {
        stepErrors.phone = "Phone number is required";
      } else {
        // Boşlukları ve rakam dışı karakterleri kaldır
        const digits = phone.replace(/\D/g, "");

        // Türkiye telefon numarası 11 haneli olmalı
        if (digits.length !== 11) {
          stepErrors.phone = "Please enter a valid phone number";
        }
      }

      const allowedCountries = countries.map((c) => c.name);
      const allowedSelectedCountyCitys = countries.filter(
        (c) => c.name === current_location
      );

      //Country of birth doğrulaması
      if (!country_birth) {
        stepErrors.country_birth = "Country of birth is required";
      } else if (!allowedCountries.includes(country_birth)) {
        stepErrors.country_birth =
          "Please select a country birth from the list";
      }
      //Current location doğrulaması
      if (!current_location) {
        stepErrors.current_location = "Current location is required";
      } else if (!allowedCountries.includes(current_location)) {
        stepErrors.current_location =
          "Please select a country location from the list";
      }

      //Current city doğrulaması
      if (!current_city) {
        stepErrors.current_city = "Current city is required";
      } else if (
        !allowedSelectedCountyCitys[0].stateProvinces.some(
          (province) => province.name === current_city
        )
      ) {
        stepErrors.current_city = "Please select a country city from the list";
      }

      if (!level) stepErrors.level = "Level is required";
    }

    if (step === 2) {
      const file = formData.photo.file;
      if (file === null) {
        stepErrors.photo = "Please upload a photo";
      }
      if (!file) {
        stepErrors.file = "Please upload a photo";
      } else {
        // Kabul edilen formatlar
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!allowedTypes.includes(file.type)) {
          stepErrors.photo = "Only JPG or PNG images are allowed";
        }
      }
    }

    if (step === 3) {
      if (certificateToggle) {
        formData.certifications.forEach((cert, idx) => {
          if (!cert.name) {
            stepErrors[`certifications[${idx}].name`] =
              "Certificate name required.";
          }
          if (!cert.issuer) {
            stepErrors[`certifications[${idx}].issuer`] = "Issuer is required.";
          }
          if (!cert.uploadCertificate) {
            stepErrors[`certifications[${idx}].uploadCertificate`] =
              "Please upload your certificate in PDF or PNG format.";
          }
        });
      }
    }

    if (step === 4) {
      if (educationToggle) {
        if (
          Array.isArray(formData.educations) &&
          formData.educations.length > 0
        ) {
          formData.educations.forEach((edu, idx) => {
            if (!edu.university) {
              stepErrors[`educations[${idx}].university`] =
                "University is required.";
            }
            // if (!edu.degree_type) {
            //   stepErrors[`educations[${idx}].degree_type`] =
            //     "Degree type is required.";
            // }
            if (!edu.specialization) {
              stepErrors[`educations[${idx}].specialization`] =
                "Specialization type is required.";
            }
            if (!edu.graduationYear) {
              stepErrors[`educations[${idx}].graduationYear`] =
                "Graduation year type is required.";
            }
            if (!edu.degree) {
              stepErrors[`educations[${idx}].degree`] = "Degree is required.";
            }
            if (!edu.uploadDegree) {
              stepErrors[`educations[${idx}].uploadDegree`] =
                "Please upload your certificate in PDF or PNG format.";
            }
          });
        }
      }
    }

    if (step === 5) {
      if (!formData.description.bio)
        stepErrors.bio = "Enter a short description.";
    }

    if (step === 6) {
      // Eğer kullanıcı "herhangi bir tarih belirtmek istemiyorum" toggle'ını açtıysa kontrol gerekmez
      if (availabilityToggle) {
        if (!formData.availability.length) {
          stepErrors.days = "Select at least one day.";
        } else {
          formData.availability.forEach((a, idx) => {
            if (!a.day) {
              stepErrors[`availability.${idx}.day`] =
                "Day needs to be selected.";
            }
            if (!a.timeFrom || !a.timeTo) {
              stepErrors[`availability.${idx}.time`] =
                "Start and end time required.";
            }
          });
        }
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };
  const goNext = () => {
    if (!validateCurrent()) return;

    if (currentIndex < registerStepSection.length - 1) {
      setSelectedStepSection(registerStepSection[currentIndex + 1].id);

      // Sayfayı en üste kaydır
      window.scrollTo({
        top: 0,
        behavior: "smooth", // yumuşak kaydırma
      });
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setSelectedStepSection(registerStepSection[currentIndex - 1].id);
    }
  };

  const handleFinalSubmit = async () => {
    setLoadingBtn(true);
    if (!validateCurrent()) return;

    const fd = new FormData();

    // About
    Object.entries(formData.about).forEach(([k, v]) =>
      fd.append(`about[${k}]`, v || "")
    );

    // Photo
    if (formData.photo.file) {
      fd.append("photo[file]", formData.photo.file);
    }

    // Certifications

    if (certificateToggle) {
      formData.certifications.forEach((cert, idx) => {
        Object.entries(cert).forEach(([k, v]) => {
          if (v instanceof File) {
            fd.append(`certifications[${idx}][${k}]`, v);
          } else {
            fd.append(`certifications[${idx}][${k}]`, v || "");
          }
        });
      });
    } else {
      formData.certifications = null;
    }
    // Education
    if (educationToggle) {
      formData.educations.forEach((edu, idx) => {
        Object.entries(edu).forEach(([k, v]) => {
          if (v instanceof File) {
            fd.append(`educations[${idx}][${k}]`, v);
          } else {
            fd.append(`educations[${idx}][${k}]`, v || "");
          }
        });
      });
    } else {
      formData.educations = null;
    }

    // Description

    // Availability
    fd.append("description[bio]", formData.description.bio || "");

    if (availabilityToggle) {
      formData.availability.forEach((item, index) => {
        fd.append(`availability[${index}][day]`, item.day);
        fd.append(`availability[${index}][timeFrom]`, item.timeFrom || "");
        fd.append(`availability[${index}][timeTo]`, item.timeTo || "");
      });
    } else {
      formData.availability = null;
    }

    try {
      const res = await generalService.registerInstructor(fd);
      if (res.status === "success") {
        //setSelectedStepSection(selectedStepSection + 1);
        setFinalStep(true);
        setLoadingBtn(false);
      } else {
        if (res.status === "error") {
          setErrors((prev) => ({
            ...prev,
            finalError: res.errors.join("\n"), // \n ile ayır
          }));
        }
        throw new Error("Kayıt başarısız");
        setLoadingBtn(false);
      }
      // alert("Eğitmen kaydı başarıyla gönderildi!");
    } catch (e) {
      //console.error(e);
      //alert("Gönderimde bir hata oluştu. Konsolu kontrol edin.");
      setLoadingBtn(false);
    } finally {
      setLoadingBtn(false);
    }
  };
  const handleCropDone = (blob, setFormData) => {
    const file = new File([blob], "photo.png", { type: blob.type });

    //setFormData("photo", file); // kırpılmış resmi Formik’e ekle
    setFormData((prev) => ({
      ...prev,
      photo: { file },
    }));
  };

  const checkRegisterEmailExist = async (email) => {
    try {
      const res = await instructorPanelService.registerEmailExist(email);
      return res; // true veya false döner
    } catch (error) {
      // console.error("Email kontrol hatası:", error);
      return false; // Hata durumunda false dönebiliriz
    }
  };
  const removeError = (key) => {
    setErrors((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div className="w-full  min-h-screen bg-[#FFD207] relative">
      <div className="w-full h-20 bg-white flex justify-center items-center">
        <div className=" container mx-auto max-lg:px-6">
          <Link href={"/"}>
            <Image src={Logo} width={200} height={200} alt="English Point" />
          </Link>
        </div>
      </div>
      {selectedStepSection === 7 && (
        <Image
          className="absolute right-10 bottom-10 max-lg:hidden "
          src={RegisterLastIcon}
          alt="English Point Icon"
          width={200}
          height={200}
        />
      )}

      <div
        className={`w-full bg-[#FFD207] py-10 ${
          finalStep !== false ? "hidden" : ""
        }`}
      >
        <div className="container mx-auto">
          <div className="flex flex-col">
            {/* Üstte adım göstergesi */}
            <div className="w-full flex justify-center items-center gap-2 py-4 sm:py-10 flex-wrap overflow-x-auto px-2">
              {registerStepSection.map((item, i) => (
                <div
                  className="flex justify-center items-center gap-2 flex-shrink-0"
                  key={item.id}
                >
                  <button
                    type="button"
                    // onClick={() => setSelectedStepSection(item.id)}
                    className={`${
                      selectedStepSection === item.id
                        ? "bg-black text-[#B3AFAF]"
                        : "bg-white text-black"
                    } px-3 sm:px-4 py-1.5 sm:py-1 rounded-3xl transition-colors whitespace-nowrap`}
                  >
                    {item.title}
                  </button>

                  {registerStepSection.length - 1 !== i && (
                    <IoIosArrowDroprightCircle className="text-lg sm:text-xl text-black" />
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 max-w-xl w-full mx-auto ">
              <p className="text-black font-bold text-[40px]">
                {registerStepSection[selectedStepSection - 1].title}
              </p>
              <p className="text-[#686464] font-sm">
                {" "}
                {registerStepSection[selectedStepSection - 1].desc}
              </p>
            </div>

            {/* İçerik */}
            <div className=" p-6 max-w-xl w-full mx-auto text-black">
              {selectedStepSection === 1 && (
                <section className="flex flex-col gap-4">
                  <Field label="Name" error={errors.firstName}>
                    <input
                      id="Name"
                      autoComplete="off"
                      className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                      value={formData.about.firstName}
                      placeholder="First Name"
                      onChange={(e) =>
                        updateField("about", "firstName", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Surname" error={errors.lastName}>
                    <input
                      id="Surname"
                      autoComplete="off"
                      className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                      value={formData.about.lastName}
                      placeholder="Surname"
                      onChange={(e) =>
                        updateField("about", "lastName", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input
                      id="Email"
                      autoComplete="off"
                      type="email"
                      className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                      value={formData.about.email}
                      placeholder="Email"
                      onBlur={async () => {
                        const email = formData.about.email;

                        // 1. Boşsa hata temizle
                        if (!email) {
                          removeError("email");
                          return;
                        }

                        // 2. Regex ile email format kontrolü
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(email)) {
                          setErrors((prev) => ({
                            ...prev,
                            email: "Please enter a valid email address",
                          }));
                          return;
                        }

                        // 3. Backend kontrolü (email mevcut mu?)
                        const exists = await checkRegisterEmailExist(email);

                        if (exists.status === "error") {
                          setErrors((prev) => ({
                            ...prev,
                            email: exists.message,
                          }));
                        } else {
                          removeError("email");
                        }
                      }}
                      onChange={(e) =>
                        updateField("about", "email", e.target.value)
                      }
                    />
                    {existsingEmail && <p>{existsingEmail}</p>}
                  </Field>
                  <Field label="Phone" error={errors.phone}>
                    <input
                      id="Phone"
                      autoComplete="off"
                      className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                      value={formData.about.phone}
                      placeholder="Phone"
                      onChange={(e) =>
                        updateField(
                          "about",
                          "phone",
                          formatPhone(e.target.value)
                        )
                      }
                    />
                  </Field>
                  <div className="relative w-full" ref={wrapperRefCountryBirth}>
                    <label className="block mb-1 font-medium">
                      Country of Birth
                    </label>

                    <div className="relative">
                      <input
                        className="w-full h-14 px-4 pr-10 outline-none placeholder:text-[#999] bg-white font-light"
                        value={formData.about.country_birth}
                        placeholder="Select country"
                        autoComplete="off"
                        onFocus={() => setIsOpen(true)}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          updateField("about", "country_birth", e.target.value);
                        }}
                      />
                      {/* Sağa ok eklemek */}
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </div>

                    {isOpen && (
                      <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white">
                        {isLoading && (
                          <div className="p-2 text-sm">Loading...</div>
                        )}
                        {error && (
                          <div className="p-2 text-sm text-red-500">
                            Error loading
                          </div>
                        )}
                        {filtered.length > 0 ? (
                          filtered.map((country) => (
                            <div
                              key={country.countryCode}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                updateField(
                                  "about",
                                  "country_birth",
                                  country.name
                                );
                                setSearch("");
                                setIsOpen(false);
                              }}
                            >
                              {country.flag && (
                                <Image
                                  src={country.flag}
                                  alt={country.name}
                                  className="inline-block w-5 h-4 mr-2"
                                  width={20}
                                  height={15}
                                />
                              )}
                              {country.name}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">
                            No results
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className="relative w-full"
                    ref={wrapperRefCurrentLocation}
                  >
                    {/* Ülke seçimi */}
                    <label className="block mb-1 font-medium">
                      Current Location
                    </label>
                    <div className="relative">
                      <input
                        className="w-full h-14 px-4 pr-10 outline-none placeholder:text-[#999] bg-white font-light"
                        value={formData.about.current_location}
                        placeholder="Select country"
                        onFocus={() => setIsCountryOpen(true)}
                        onChange={(e) => {
                          setSearchCountry(e.target.value);
                          updateField(
                            "about",
                            "current_location",
                            e.target.value
                          );
                        }}
                      />
                      {/* Ülke input sağ ok */}
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                            isCountryOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </div>

                    {isCountryOpen && (
                      <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white">
                        {isLoading && (
                          <div className="p-2 text-sm">Loading...</div>
                        )}
                        {error && (
                          <div className="p-2 text-sm text-red-500">
                            Error loading
                          </div>
                        )}
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <div
                              key={country.countryCode}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setSearchCity("");
                                updateField("about", "current_city", "");
                                updateField(
                                  "about",
                                  "current_location",
                                  country.name
                                );
                                setSelectedCountry(country);
                                setSearchCountry("");
                                setIsCountryOpen(false);
                                setIsCityOpen(false);
                              }}
                            >
                              {country.flag && (
                                <Image
                                  src={country.flag}
                                  alt={country.name}
                                  className="inline-block w-5 h-4 mr-2"
                                  width={20}
                                  height={15}
                                />
                              )}
                              {country.name}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">
                            No results
                          </div>
                        )}
                      </div>
                    )}

                    {/* Şehir seçimi */}
                    {selectedCountry && (
                      <div className="relative mt-4">
                        <label className="block mb-1 font-medium">City</label>
                        <div className="relative">
                          <input
                            autoComplete="off"
                            className="w-full h-14 px-4 pr-10 outline-none placeholder:text-[#999] bg-white font-light"
                            value={searchCity}
                            placeholder="Select city"
                            onFocus={() => setIsCityOpen(true)}
                            onChange={(e) => {
                              setSearchCity(e.target.value);
                              updateField(
                                "about",
                                "current_city",
                                e.target.value
                              );
                            }}
                          />
                          {/* Şehir input sağ ok */}
                          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg
                              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                isCityOpen ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        </div>

                        {isCityOpen && (
                          <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white">
                            {filteredCities.length > 0 ? (
                              filteredCities.map((city) => (
                                <div
                                  key={city.name}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => {
                                    setSearchCity(city.name);
                                    updateField(
                                      "about",
                                      "current_city",
                                      city.name
                                    );
                                    setIsCityOpen(false);
                                  }}
                                >
                                  {city.name}
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-sm text-gray-500">
                                No results
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative w-full">
                    <label className="block mb-1 font-medium">Level</label>

                    <div
                      className="relative w-full h-14 px-4 flex items-center justify-between cursor-pointer bg-white"
                      onClick={() => setIsOpenLevel(!isOpenLevel)}
                    >
                      <span className="text-gray-700 font-light">
                        {formData.about.level || "Select Level"}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                          isOpenLevel ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    {isOpenLevel && !isCityOpen && (
                      <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white   ">
                        {[
                          "Native Speaker",
                          "Nativelike",
                          "English Teacher (Turkish)",
                        ].map((level) => (
                          <div
                            key={level}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              updateField("about", "level", level);
                              setIsOpenLevel(false);
                            }}
                          >
                            {level}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {selectedStepSection === 2 && (
                <>
                  <section className="grid grid-cols-1 gap-4">
                    <div className="flex justify-start items-center gap-4">
                      <div className="w-36 h-36 bg-white flex justify-center items-center relative">
                        {formData.photo.file ? (
                          <Image
                            width={50}
                            height={50}
                            alt="preview"
                            className="w-full h-full object-cover"
                            src={URL.createObjectURL(formData.photo.file)}
                          />
                        ) : (
                          <p className="text-center p-4">JPG or PNG, max 5MB</p>
                        )}

                        {/* Hata mesajı burada */}
                      </div>

                      <div className="flex flex-col">
                        <p className="text-2xl font-bold py-2">
                          {formData.about.firstName} {formData.about.lastName}
                        </p>
                        <p className="text-md font-light">
                          Teaches English lessons
                        </p>
                        <p className="text-md font-light">
                          Speaks English (Native), English (B2)
                        </p>
                        <div className="w-full flex justify-start mt-2">
                          <ProfilePhotoCropperRegister
                            onCropDone={(blob) =>
                              handleCropDone(blob, setFormData)
                            }
                          />
                        </div>

                        {/* <label className="mt-4 cursor-pointer inline-block">
                          <span className="bg-black text-white py-1 px-4 rounded-4xl">
                            Upload Foto
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              console.log("fileee", file);
                              setFormData((prev) => ({
                                ...prev,
                                photo: { file },
                              }));
                            }}
                          />
                        </label> */}
                      </div>
                    </div>
                    {errors.photo && (
                      <div className="bg-white border-gray-100 p-3 flex gap-2 items-center">
                        <AlertCircle className="text-red-500 inline-block mr-2" />
                        <p className="text-black text-sm w-full ">
                          {errors.photo}
                        </p>
                      </div>
                    )}
                  </section>
                </>
              )}

              {selectedStepSection === 3 && (
                <section className="flex flex-col gap-4">
                  <div className="flex justify-start items-center gap-4">
                    <button
                      type="button"
                      aria-pressed={!certificateToggle}
                      onClick={() => setCertificateToggle(!certificateToggle)}
                      className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ${
                        certificateToggle ? "bg-black" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                          certificateToggle ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <p className="font-bold">
                      I don’t have a teaching certificate
                    </p>
                  </div>
                  {!certificateToggle && (
                    <p>
                      You are still welcome to join our platform as a
                      Mentor/Speaker, please add your other qualifications.
                    </p>
                  )}
                  {certificateToggle && (
                    <>
                      {formData.certifications.map((cert, idx) => (
                        <div key={idx} className="space-y-4 border-b pb-4 mb-4">
                          <Field
                            label="Certificate Name"
                            error={errors[`certifications.${idx}.name`]}
                          >
                            <input
                              autoComplete="off"
                              className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                              value={cert.name}
                              onChange={(e) =>
                                updateArrayField(
                                  "certifications",
                                  idx,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </Field>

                          <Field
                            label="Issuer"
                            error={errors[`certifications.${idx}.issuer`]}
                          >
                            <input
                              autoComplete="off"
                              className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                              value={cert.issuer}
                              onChange={(e) =>
                                updateArrayField(
                                  "certifications",
                                  idx,
                                  "issuer",
                                  e.target.value
                                )
                              }
                            />
                          </Field>

                          <Field
                            label="Year"
                            error={errors[`certifications.${idx}.year`]}
                          >
                            <div className="relative w-full">
                              <div
                                className="relative"
                                onClick={() => setIsYearOpen(!isYearOpen)}
                              >
                                <select
                                  className="w-full h-14 px-4 pr-10 outline-none bg-white font-light appearance-none cursor-pointer"
                                  value={cert.year}
                                  onChange={(e) => {
                                    updateArrayField(
                                      "certifications",
                                      idx,
                                      "year",
                                      e.target.value
                                    );
                                    setIsYearOpen(false);
                                  }}
                                  onBlur={() => setIsYearOpen(false)}
                                >
                                  <option value="">Select Year</option>
                                  {Array.from(
                                    {
                                      length:
                                        new Date().getFullYear() - 1920 + 1,
                                    },
                                    (_, i) => new Date().getFullYear() - i
                                  ).map((year) => (
                                    <option key={year} value={year}>
                                      {year}
                                    </option>
                                  ))}
                                </select>

                                {/* Aşağı/Yukarı dönen ikon */}
                                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                  <svg
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                      isYearOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </Field>

                          <Field label="Upload Certificate">
                            <div className="w-full py-10 bg-white flex justify-center items-center">
                              <div className="flex flex-col px-20 gap-2">
                                <p className="text-center">
                                  Our team will manually review your submission
                                </p>

                                {/* Gizli file input */}
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg, application/pdf"
                                  id={`certificate-upload-${idx}`}
                                  className="hidden"
                                  onChange={(e) =>
                                    updateArrayField(
                                      "certifications",
                                      idx,
                                      "uploadCertificate",
                                      e.target.files?.[0] || null
                                    )
                                  }
                                />
                                {/* Buton görünümü */}
                                <label
                                  htmlFor={`certificate-upload-${idx}`}
                                  className="bg-[#FFD207] text-center font-bold text-xl p-2 cursor-pointer rounded-4xl"
                                >
                                  Upload Certificate
                                </label>

                                {/* Dosya seçildiğinde göster */}
                                {cert.uploadCertificate && (
                                  <p className="text-green-600 text-sm text-center mt-2">
                                    {cert.uploadCertificate.name}
                                  </p>
                                )}

                                <div className="bg-[#EEEEEC] p-6">
                                  <p className="font-thin text-black">
                                    Only authentic documents will be accepted.
                                    Any false information can result in the
                                    disapproval or suspension of your account.
                                  </p>
                                </div>

                                <p className="font-bold text-center text-sm">
                                  JPG or PNG format; maximum size of 20MB.
                                </p>
                              </div>
                            </div>
                          </Field>

                          {idx != 0 && (
                            <button
                              type="button"
                              className="text-black font-bold text-sm cursor-pointer"
                              onClick={() => removeCertification(idx)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        className="text-black text-start cursor-pointer w-fit text-sm font-bold"
                        onClick={addCertification}
                      >
                        Add another certificate
                      </button>
                    </>
                  )}
                </section>
              )}

              {selectedStepSection === 4 && (
                <section className="flex flex-col gap-4">
                  <div className="flex justify-start items-center gap-4">
                    <button
                      type="button"
                      aria-pressed={!educationToggle}
                      onClick={() => setEducationToggle(!educationToggle)}
                      className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ${
                        educationToggle ? "bg-black" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                          educationToggle ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <p className="font-bold">
                      I don’t have a higher education degree
                    </p>
                  </div>
                  {!educationToggle &&
                    formData?.about?.level === "English Teacher (Turkish)" && (
                      <div className="mt-4 bg-orange-50 border-l-4 border-orange-500 p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-bold text-orange-800">
                              Bachelor`s Degree Required
                            </h3>
                            <div className="mt-2 text-sm text-orange-700">
                              <p>
                                To qualify as an{" "}
                                <strong>`English Teache,r</strong>, holding a
                                Bachelor`s Degree in English Teaching (or a
                                related field) is mandatory. Please add your
                                education details to proceed.
                              </p>
                            </div>
                            <div className="mt-3">
                              <button
                                type="button"
                                onClick={() => setEducationToggle(true)}
                                className="text-sm font-medium text-orange-800 hover:text-orange-900 underline transition-colors"
                              >
                                Add Education Details &rarr;
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  {educationToggle &&
                    formData.educations.map((edu, idx) => (
                      <div key={idx}>
                        <div className="flex flex-col  space-y-4 border-b pb-4 mb-4">
                          <Field
                            label="University"
                            error={errors?.educations?.[idx]?.university}
                          >
                            <input
                              autoComplete="off"
                              className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                              value={edu.university}
                              onChange={(e) =>
                                updateArrayField(
                                  "educations",
                                  idx,
                                  "university",
                                  e.target.value
                                )
                              }
                            />
                          </Field>
                          <Field
                            label="Degree"
                            error={errors?.educations?.[idx]?.degree}
                          >
                            <input
                              autoComplete="off"
                              className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                              value={edu.degree}
                              onChange={(e) =>
                                updateArrayField(
                                  "educations",
                                  idx,
                                  "degree",
                                  e.target.value
                                )
                              }
                            />
                          </Field>

                          <Field
                            label="Specialization"
                            error={errors?.educations?.[idx]?.specialization}
                          >
                            <input
                              autoComplete="off"
                              className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                              value={edu.specialization}
                              onChange={(e) =>
                                updateArrayField(
                                  "educations",
                                  idx,
                                  "specialization",
                                  e.target.value
                                )
                              }
                            />
                          </Field>

                          <Field
                            label="Year"
                            error={errors[`educations.${idx}.graduationYear`]}
                          >
                            <div className="relative w-full">
                              <div
                                className="relative"
                                onClick={() => setIsEduYearOpen(!isEduYearOpen)}
                              >
                                <select
                                  className="w-full h-14 px-4 pr-10 outline-none bg-white font-light appearance-none cursor-pointer"
                                  value={edu.graduationYear}
                                  onChange={(e) => {
                                    updateArrayField(
                                      "educations",
                                      idx,
                                      "graduationYear",
                                      e.target.value
                                    );
                                    setIsEduYearOpen(false);
                                  }}
                                  onBlur={() => setIsEduYearOpen(false)}
                                >
                                  <option value="">Select Year</option>
                                  {Array.from(
                                    {
                                      length:
                                        new Date().getFullYear() - 1920 + 1,
                                    },
                                    (_, i) => new Date().getFullYear() - i
                                  ).map((year) => (
                                    <option key={year} value={year}>
                                      {year}
                                    </option>
                                  ))}
                                </select>

                                {/* Aşağı/Yukarı dönen ikon */}
                                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                  <svg
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                      isEduYearOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </Field>
                          <Field label="Upload Degree">
                            <div className="w-full py-10 bg-white flex justify-center items-center">
                              <div className="flex flex-col px-20 gap-2">
                                <p className="text-center">
                                  Our team will manually review your submission
                                </p>

                                {/* Gizli file input */}
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg, application/pdf"
                                  id={`educations-upload-${idx}`}
                                  className="hidden"
                                  onChange={(e) =>
                                    updateArrayField(
                                      "educations",
                                      idx,
                                      "uploadDegree",
                                      e.target.files?.[0] || null
                                    )
                                  }
                                />

                                {/* Buton görünümü */}
                                <label
                                  htmlFor={`educations-upload-${idx}`}
                                  className="bg-[#FFD207] text-center font-bold text-xl p-2 cursor-pointer rounded-4xl"
                                >
                                  Upload Degree
                                </label>

                                {/* Dosya seçildiğinde göster */}
                                {edu.uploadDegree && (
                                  <p className="text-green-600 text-sm text-center mt-2">
                                    {edu.uploadDegree.name}
                                  </p>
                                )}

                                <div className="bg-[#EEEEEC] p-6">
                                  <p className="font-thin text-black">
                                    Only authentic documents will be accepted.
                                    Any false information can result in the
                                    disapproval or suspension of your account.
                                  </p>
                                </div>

                                <p className="font-bold text-center text-sm">
                                  JPG or PNG format; maximum size of 20MB.
                                </p>
                              </div>
                            </div>
                          </Field>
                          {idx != 0 && (
                            <button
                              type="button"
                              className="text-black font-bold text-sm cursor-pointer text-start"
                              onClick={() => removeEducation(idx)}
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          className="text-black text-start cursor-pointer w-fit text-sm font-bold"
                          onClick={addEducation}
                        >
                          Add another education
                        </button>
                      </div>
                    ))}
                </section>
              )}

              {selectedStepSection === 5 && (
                <section className="grid grid-cols-1 gap-4">
                  <Field label="Short Bio" error={errors.bio}>
                    <textarea
                      className="w-full h-14 py-2 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light min-h-32"
                      value={formData.description.bio}
                      onChange={(e) =>
                        updateField("description", "bio", e.target.value)
                      }
                    />
                    <div className="bg-black text-white w-full p-2 text-sm">
                      Don’t include your last name or present your information
                      in a CV format
                    </div>
                  </Field>
                </section>
              )}

              {selectedStepSection === 6 && (
                <section className="grid grid-cols-1 gap-6">
                  {/* Toggle */}
                  <div className="flex justify-start items-center gap-4">
                    <button
                      type="button"
                      aria-pressed={!availabilityToggle}
                      onClick={() => setAvailabilityToggle(!availabilityToggle)}
                      className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ${
                        availabilityToggle ? "bg-black" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                          availabilityToggle ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <p className="font-bold">
                      {`I don't want to specify any date`}
                    </p>
                  </div>

                  {/* Availability Alanları */}
                  {availabilityToggle && (
                    <>
                      {formData.availability.map((item, index) => (
                        <div
                          key={index}
                          className="relative space-y-4 border-b pb-4 mb-4"
                        >
                          {/* Gün seçimi */}
                          <div className="mb-3 ">
                            <label className="block text-sm mb-1">Day</label>
                            <select
                              className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                              value={item.day}
                              onChange={(e) =>
                                updateAvailability(index, "day", e.target.value)
                              }
                            >
                              {days.map((day) => (
                                <option key={day} value={day}>
                                  {day.toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Saat aralıkları */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm mb-1">From</label>
                              <input
                                autoComplete="off"
                                type="time"
                                className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                                value={item.timeFrom}
                                onChange={(e) =>
                                  updateAvailability(
                                    index,
                                    "timeFrom",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label className="block text-sm mb-1">To</label>
                              <input
                                autoComplete="off"
                                type="time"
                                className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#999999] bg-white font-light"
                                value={item.timeTo}
                                onChange={(e) =>
                                  updateAvailability(
                                    index,
                                    "timeTo",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div>
                            {" "}
                            <button
                              type="button"
                              onClick={() => removeAvailability(index)}
                              className="text-black font-bold text-sm cursor-pointer text-start "
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Yeni availability ekle */}
                      <div className="flex flex-col">
                        <button
                          type="button"
                          className="text-black text-start cursor-pointer w-fit text-sm font-bold"
                          onClick={addAvailability}
                        >
                          Add another availability
                        </button>
                      </div>
                    </>
                  )}
                </section>
              )}

              {selectedStepSection === 7 && (
                <section className="flex flex-col gap-5">
                  <div className="bg-white flex flex-col py-5 px-10 gap-4">
                    <p className="text-black text-4xl font-semibold">
                      How much will you earn via English Point ?
                    </p>
                    <p className="font-light text-lg">
                      We provide you a{" "}
                      <b className="text-bold">dynamic earning system</b> to
                      make things transparent and sustainable. The more students
                      you have in your session, the more money you earn
                    </p>
                    <p>Per session:</p>
                  </div>
                  <div className="flex gap-6  max-lg:flex-col">
                    {/* Pricing Table */}
                    <div className="w-1/2 max-lg:w-full bg-white  p-8">
                      <table className="w-full">
                        <tbody className="text-sm">
                          <tr className="">
                            <td className="py-2 font-semibold text-[#686464]">
                              1 student
                            </td>
                            <td className="py-2 text-right font-bold">
                              200 TL
                            </td>
                          </tr>
                          <tr className=" border-gray-100">
                            <td className="py-2 font-semibold text-[#686464]">
                              2 students
                            </td>
                            <td className="py-2 text-right font-bold">
                              250 TL
                            </td>
                          </tr>
                          <tr className=" border-gray-100">
                            <td className="py-2 font-semibold text-[#686464]">
                              3 students
                            </td>
                            <td className="py-2 text-right font-bold">
                              300 TL
                            </td>
                          </tr>
                          <tr className=" border-gray-100">
                            <td className="py-2 font-semibold text-[#686464]">
                              4 students
                            </td>
                            <td className="py-2 text-right font-bold">
                              400 TL
                            </td>
                          </tr>
                          <tr className=" border-gray-100">
                            <td className=" py-2 font-semibold text-[#686464]">
                              5 students
                            </td>
                            <td className=" py-2 text-right font-bold">
                              500 TL
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-semibold text-[#686464]">
                              6 students
                            </td>
                            <td className="py-2 text-right font-bold">
                              600 TL
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Weekly Performance Bonuses */}
                    <div className="w-1/2 max-lg:w-full bg-white  p-4">
                      <h2 className="text-lg font-bold text-center my-4 text-gray-800">
                        weekly performance
                        <br />
                        bonuses
                      </h2>
                      <table className="w-full">
                        <tbody className="text-sm">
                          <tr>
                            <td className="py-3 font-bold">0-10</td>
                            <td className="py-3 text-gray-600">sessions</td>
                            <td className="py-3 text-right font-bold">
                              %0 bonus
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold">10-20</td>
                            <td className="py-3 text-gray-600">sessions</td>
                            <td className="py-3 text-right font-bold">
                              %10 bonus
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold">20-30</td>
                            <td className="py-3 text-gray-600">sessions</td>
                            <td className="py-3 text-right font-bold">
                              %20 bonus
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold">30+</td>
                            <td className="py-3 text-gray-600">sessions</td>
                            <td className="py-3 text-right font-bold">
                              %25 bonus
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* <div className="bg-white flex flex-col py-5 px-10 gap-4">
                    <p className="text-black text-4xl font-semibold">
                      Commission
                    </p>
                    <p className="font-light text-lg flex ">
                      We use the funds for getting more students and for
                      constant improvements of our learning platform
                    </p>

                    <p className="font-light text-lg flex items-start">
                      <FaCheck className="w-6 h-6  mr-2 shrink-0" />
                      For every trial lesson with a new student English Point’s
                      commission is 100%
                    </p>

                    <p className="font-light text-lg flex items-start">
                      <FaCheck className="w-6 h-6  mr-2 shrink-0" />
                      For all the subsequent lessons, English Point charges a
                      percentage (18% - 33%) of the hourly rate
                    </p>

                    <p className="font-light text-lg flex items-start">
                      <FaCheck className="w-6 h-6  mr-2 shrink-0" />
                      The more hours you teach, the lower your rate of
                      commission will be
                    </p>
                  </div> */}
                </section>
              )}

              {selectedStepSection != 2 && (
                <div className="mt-8 flex items-center justify-between flex-col">
                  <div className="w-full">
                    <AnimatePresence>
                      {Object.keys(errors).length > 0 && (
                        <motion.div
                          key="errorBox"
                          className="bg-white border border-gray-100 text-black px-4 py-3 mb-4 flex items-start gap-2"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div className="flex flex-col">
                            {Object.values(errors).map((err, idx) => (
                              <p
                                key={idx}
                                className="text-sm font-medium  whitespace-pre-line"
                              >
                                {err}
                              </p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center gap-3 w-full justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={currentIndex === 0}
                      className="px-5 py-2 bg-white text-black text-sm cursor-pointer font-bold rounded-2xl  disabled:opacity-40"
                    >
                      Back
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {currentIndex + 1} / {registerStepSection.length}
                      </span>

                      {currentIndex < registerStepSection.length - 1 ? (
                        <button
                          type="button"
                          onClick={goNext}
                          className="px-5 py-2 rounded-2xl cursor-pointer font-bold text-sm bg-black text-white"
                        >
                          Save and continue
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFinalSubmit}
                          disabled={loadingBtn} // Yüklenirken tıklamayı engelle
                          className={`px-5 py-2 rounded-2xl bg-black text-white font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            loadingBtn
                              ? "opacity-70 cursor-not-allowed"
                              : "hover:bg-gray-800"
                          }`}
                        >
                          {loadingBtn ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Complete registration"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedStepSection === 2 && (
          <div className="w-full bg-white ">
            <div className="container mx-auto max-w-xl py-6">
              <p className="font-bold text-4xl text-black px-6">
                What your photo needs
              </p>
              <ul className="text-black mt-5 font-light">
                <li className="flex justify-start items-center gap-2">
                  <FaCheck className="text-2xl" /> You should be facing forward
                </li>
                <li className="flex justify-start items-center gap-2">
                  <FaCheck className="text-2xl" /> Frame your head and shoulders
                </li>
                <li className="flex justify-start items-center gap-2">
                  <FaCheck className="text-2xl" /> You should be centered and
                  upright
                </li>
                <li className="flex justify-start items-center gap-2">
                  <FaCheck className="text-2xl" /> Your face and eyes should be
                  visible (except for religious reasons)
                </li>
                <li className="flex justify-start items-center gap-2">
                  <FaCheck className="text-2xl" /> You should be the only person
                  in the photo
                </li>
                <li className="flex justify-start items-center gap-2">
                  <FaCheck className="text-2xl" /> Use a color photo with high
                  resolution and no filters
                </li>
                <li className="flex justify-start items-center gap-2">
                  <FaCheck className="text-2xl" /> Avoid logos or contact
                  information
                </li>
              </ul>
              <div className="flex items-center gap-3 w-full justify-between mt-5">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={currentIndex === 0}
                  className="px-5 py-2 rounded-2xl bg-black text-white cursor-pointer"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  className="px-5 py-2 rounded-2xl bg-black text-white cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
        <style jsx>{`
          .input {
            @apply w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/50;
          }
        `}</style>
      </div>
      {finalStep && (
        <div className="w-full bg-[#FFD207] h-screen overflow-hidden flex justify-center items-center">
          <div className="container mx-auto px-10 max-w-4xl py-20 flex flex-col justify-center items-center">
            <Image src={FınalImage} alt="English Point" />
            <p className="font-bold text-black text-[40px] text-center">
              {'"Thanks for registering! We’ll get in touch with you shortly."'}
            </p>
            <p className="text-black text-center">
              {" "}
              After your account has been verified, a password setup screen will
              be sent to you.
            </p>
            <Link
              href="/instructor-login"
              className="round rounded-4xl px-10 py-2 text-white bg-black cursor-pointer mt-5 text-2xl hover:scale-105 transition-all"
            >
              Go to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
function Field({ label, error, children }) {
  return (
    <div className="relative mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}
