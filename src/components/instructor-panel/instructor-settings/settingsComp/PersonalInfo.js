"use client";
import { useEffect, useState, useRef } from "react";
import ProfilePhotoCropper from "../../../profilePhotoCropper/ProfilePhotoCropper";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import instructorPanelService from "../../../../utils/axios/instructorPanelService";
import AlertMessage from "../../another-comp/AlertMessage";
import { useQueryClient } from "@tanstack/react-query";

async function fetchCountries() {
  const res = await fetch("/countries.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Countries fetch failed");
  return res.json();
}
function PersonalInfo() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["instructorProfile"],
    queryFn: instructorPanelService.getInstructorProfile,
  });

  const {
    data: countries,
    isLoading: countriesLoading,
    error: countriesError,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });
  const queryClient = useQueryClient();
  const [btnLoading, setBtnLoading] = useState(false);
  const wrapperRefCountryBirth = useRef(null);
  const wrapperRefCurrentLocation = useRef(null);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);

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

  const [photoPreview, setPhotoPreview] = useState(null);

  const initialValues = {
    first_name: data?.user?.first_name || "",
    last_name: data?.user?.last_name || "",
    country_birth: data?.user?.country_birth || "", // 🔹 eklendi
    current_location: data?.user?.current_location || "",
    current_city: data?.user?.current_city || "",
    photo: {},
  };

  useEffect(() => {
    if (data?.user?.photo) {
      setPhotoPreview(data.user.photo);
    }
    if (data?.user?.current_location) {
      setSearchCountry(data.user.current_location); // input’a yaz
      const country = countries?.find(
        (c) => c.name === data.user.current_location
      );
      if (country) setSelectedCountry(country);

      if (data?.user?.current_city) {
        setSearchCity(data.user.current_city);
        setIsCityOpen(false); // dropdown açılmasın
      }
    }
  }, [data, countries]);

  const handleCropDone = (blob, setFieldValue) => {
    const file = new File([blob], "profile_photo.png", { type: blob.type });
    setPhotoPreview(URL.createObjectURL(blob)); // önizleme
    setFieldValue("photo", { file }); // kırpılmış resmi Formik’e ekle
  };
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

  const handleSubmit = async (values, { setSubmitting }) => {
    setBtnLoading(true);

    try {
      const formData = new FormData();
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("country_birth", values.country_birth);
      formData.append("current_location", values.current_location);
      formData.append("current_city", values.current_city);

      // 🔹 Fotoğraf varsa ekle
      if (values.photo?.file) {
        formData.append("profile_image", values.photo.file);
      }

      // 🔹 API isteği
      const result = await instructorPanelService.getInstructorProfileUpdate(
        formData
      );

      // 🔹 Sonuç kontrolü
      if (result.success) {
        if (result.success) {
          queryClient.invalidateQueries(["instructorProfile"]); // 🔹 tüm component’leri güncelle
        }
        setAlert({
          visible: true,
          type: "success",
          message: "Profile updated successfully!",
        });
      } else {
        setAlert({
          visible: true,
          type: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        type: "error",
        message: "Server error occurred.",
      });
    } finally {
      setBtnLoading(false);
      setSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile!</p>;

  return (
    <>
      {alert.visible && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ visible: false, type: "", message: "" })}
        />
      )}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <p className="text-black font-semibold text-2xl">Photo</p>
              <p className="text-[#686464]">
                Choose a photo that will help learners get to know you.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Profile Photo"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <ProfilePhotoCropper
                  onCropDone={(blob) => handleCropDone(blob, setFieldValue)}
                />
                {/* <label className="bg-black text-white px-4 py-2 rounded-full text-sm cursor-pointer">
                  Upload Photo
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPhotoPreview(URL.createObjectURL(file));
                        setFieldValue("photo", { file });
                      }
                    }}
                  />
                </label> */}
              </div>

              {/* Form alanları */}
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-black font-semibold text-2xl">About</p>
                  <p className="text-[#686464]">
                    Start creating your public tutor profile. Your progress will
                    be automatically saved as you complete each section. You can
                    return at any time to finish your registration.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label id="first_name" className="text-gray-700 text-sm">
                      Name
                    </label>
                    <Field
                      id="first_name"
                      type="text"
                      name="first_name"
                      placeholder="Enter your name"
                      className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm">Surname</label>
                    <Field
                      type="text"
                      name="last_name"
                      placeholder="Enter your surname"
                      className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                    />
                  </div>
                </div>

                <div className="relative w-full" ref={wrapperRefCountryBirth}>
                  <label className="text-gray-700 text-sm">Country Birth</label>
                  <input
                    className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                    value={isOpen ? search : values.country_birth}
                    placeholder="Select country"
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => setSearch(e.target.value)} // 🔹 sadece search için
                  />

                  {isOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded shadow">
                      {countriesLoading && (
                        <div className="p-2 text-sm">Loading...</div>
                      )}
                      {countriesError && (
                        <div className="p-2 text-sm text-red-500">
                          Error loading
                        </div>
                      )}
                      {filtered.length > 0 ? (
                        filtered.map((country) => (
                          <div
                            key={country.countryCode}
                            className="px-4 py-2 cursor-pointer text-black hover:bg-gray-100"
                            onClick={() => {
                              setFieldValue("country_birth", country.name); // 🔹 Formik update
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
                  <label className="text-gray-700 text-sm">
                    Current Location
                  </label>
                  <input
                    className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                    value={searchCountry || values.current_location || ""}
                    placeholder="Select country"
                    onFocus={() => {
                      setIsCountryOpen(true);
                      setSearchCountry(""); // focus olduğunda input boşalsın
                      setFieldValue("current_location", ""); // Formik state sıfırlansın
                      setFieldValue("current_city", ""); // 🔹 city de boşalsın
                      setSearchCity(""); // city input boşalsın
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchCountry(val);
                      setFieldValue("current_location", val);
                      setFieldValue("current_city", ""); // city de değiştirildiğinde boşalıyor
                      setSearchCity(""); // city input boşalsın
                    }}
                  />

                  {isCountryOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <div
                            key={country.countryCode}
                            className="px-4 py-2 cursor-pointer text-black hover:bg-gray-100"
                            onClick={() => {
                              setSelectedCountry(country);
                              setSearchCountry("");
                              setFieldValue("current_location", country.name);
                              setFieldValue("current_city", ""); // şehir sıfırla
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
                      <label className="text-gray-700 text-sm">City</label>
                      <input
                        autoComplete="off"
                        className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black resize-none shadow"
                        value={searchCity || values.current_city || ""}
                        placeholder="Select city"
                        onFocus={() => {
                          setIsCityOpen(true);
                          setSearchCity(""); // 🔹 focus olduğunda input boşalsın
                          setFieldValue("current_city", ""); // Formik state sıfırlansın
                        }}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSearchCity(val);
                          setFieldValue("current_city", val);
                        }}
                      />

                      {isCityOpen && (
                        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white">
                          {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <div
                                key={city.name}
                                className="px-4 py-2 cursor-pointer text-black hover:bg-gray-100"
                                onClick={() => {
                                  setSearchCity(city.name);
                                  setFieldValue("current_city", city.name);
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
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={btnLoading} // Loading durumunda tıklanmasın
                className={`flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded-full text-sm mt-4 transition-all ${
                  btnLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
              >
                {btnLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save and continue"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default PersonalInfo;
