"use client";
import React, { useEffect, useState } from "react";
import generalService from "../../../utils/axios/generalService";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Edit2, Star, Trash2 } from "lucide-react";
import SuccesMessageComp from "../../ui/SuccesModal/SuccesMessageComp";
import ErrorModal from "../../ui/ErrorModal/ErrorModal";

// Google Places Autocomplete importları
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

function MyAddresses() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["myAddresses"],
    queryFn: generalService.getMyAdresses,
  });

  const [addresses, setAddresses] = useState(data || []);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [defLoading, setDefLoading] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    country: "",
    address_line: "",
    district: "",
    city: "",
    postal_code: "",
    latitude: null,
    longitude: null,
    isDefault: false,
  });

  const [addressInput, setAddressInput] = useState("");

  const resetForm = () => {
    setEditingAddress(null);
    setShowForm(false);
    setAddressInput("");
    setFormData({
      title: "",
      country: "",
      address_line: "",
      district: "",
      city: "",
      postal_code: "",
      latitude: null,
      longitude: null,
      isDefault: false,
    });
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    resetForm();
    setShowForm(true);
  };

  useEffect(() => {
    if (data) {
      setAddresses(data);
    }
  }, [data]);

  const handleEditAddress = (address) => {
    setFormData({
      title: address.title || "",
      address_line: address.address_line || "",
      district: address.district || "",
      city: address.city || "",
      country: address.country || "",
      postal_code: address.postal_code || "",
      latitude: address.latitude || null,
      longitude: address.longitude || null,
      isDefault: address.isDefault || false,
    });
    setAddressInput(address.address_line || "");
    setEditingAddress(address.id);
    setShowForm(true);
  };

  // --- GOOGLE PLACES İŞLEMLERİ ---
  const handleSelect = async (address) => {
    setAddressInput(address);
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      const addressComponents = results[0].address_components;

      let city = "";
      let district = "";
      let country = "";
      let postal_code = "";

      addressComponents.forEach((component) => {
        const types = component.types;
        if (types.includes("administrative_area_level_1")) {
          city = component.long_name;
        }
        if (
          types.includes("administrative_area_level_2") ||
          types.includes("sublocality_level_1")
        ) {
          district = component.long_name;
        }
        if (types.includes("country")) {
          country = component.long_name;
        }
        if (types.includes("postal_code")) {
          postal_code = component.long_name;
        }
      });

      setFormData((prev) => ({
        ...prev,
        address_line: results[0].formatted_address,
        city: city,
        district: district,
        country: country,
        postal_code: postal_code,
        latitude: latLng.lat,
        longitude: latLng.lng,
      }));
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      address_line: addressInput || formData.address_line,
    };

    if (editingAddress) {
      try {
        const updateResult = await generalService.updatedAdress({
          ...payload,
          id: editingAddress,
        });

        if (updateResult.status) {
          setOpenModal(true);
          setModalMessage(
            updateResult.message || "Adresiniz başarıyla güncellendi."
          );
          resetForm();
          refetch();
        }
      } catch (err) {
        console.error("Hata:", err);
      }
    } else {
      try {
        const result = await generalService.storeAdresses(payload);
        if (result.status) {
          resetForm();
          setOpenModal(true);
          setModalMessage(result.message || "Adres başarıyla eklendi.");
          refetch();
        }
      } catch (err) {
        console.error("Hata:", err);
      }
    }
  };

  const handleDeleteAddress = async (id) => {
    const result = await generalService.deleteAdresses(id);
    if (result.status) {
      resetForm();
      setOpenModal(true);
      setModalMessage(result.message || "Adres silindi.");
      refetch();
    } else {
      setErrorMessage(result.message || "Bir hata meydana geldi!");
      setErrorModalOpen(true);
    }
  };

  const handleSetDefault = async (id) => {
    setDefLoading(true);
    try {
      const result = await generalService.saveMainAdres(id);
      if (result.status) {
        setOpenModal(true);
        setModalMessage(result.message || "Varsayılan adres güncellendi.");
        refetch();
      }
    } catch (err) {
      setModalMessage("Hata oluştu.");
    } finally {
      setDefLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // --- SKELETON LOADER ALANI ---
  if (isLoading) {
    return (
      <div className="flex flex-col w-full max-w-full overflow-hidden bg-[#F5F5F5] p-10 max-lg:p-4 h-auto rounded-3xl relative min-h-[500px]">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6 animate-pulse">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-64 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Adres Kartları Skeleton (3 adet örnek gösteriyoruz) */}
        <div className="grid grid-cols-1 gap-5 mt-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 w-full">
                  {/* Sol İkon Skeleton */}
                  <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0"></div>

                  {/* Text Skeleton */}
                  <div className="space-y-3 w-full max-w-md">
                    <div className="h-5 w-1/3 bg-gray-200 rounded"></div>{" "}
                    {/* Başlık */}
                    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>{" "}
                    {/* İl/İlçe */}
                    <div className="h-3 w-3/4 bg-gray-200 rounded mt-1"></div>{" "}
                    {/* Adres satırı */}
                  </div>
                </div>

                {/* Sağ Butonlar Skeleton */}
                <div className="flex gap-2">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                  <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                  <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden bg-[#F5F5F5] p-10 max-lg:p-4 h-auto rounded-3xl relative">
      <SuccesMessageComp
        open={openModal}
        message={modalMessage}
        onClose={() => setOpenModal(false)}
      />
      <ErrorModal
        open={errorModalOpen}
        message={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Adreslerim</h1>
          <p className="text-gray-600 mt-1">
            Konum bazlı filtreleme için adreslerinizi yönetin
          </p>
        </div>
        <button
          onClick={handleAddAddress}
          className="bg-black text-white px-6 py-2 cursor-pointer font-medium border border-black transition-all duration-200 flex items-center space-x-2 hover:bg-white hover:text-black "
        >
          <span className="text-xl">+</span>
          <span>Yeni Adres</span>
        </button>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingAddress ? "Adresi Düzenle" : "Yeni Konum Ekle"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Adres Başlığı (Ev, İş vb.) *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Örn: Ev"
                    className="w-full px-4 py-3 border border-gray-200  focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* GOOGLE PLACES AUTOCOMPLETE */}
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Adres Ara (Otomatik Doldurma) *
                  </label>
                  <PlacesAutocomplete
                    value={addressInput}
                    onChange={setAddressInput}
                    onSelect={handleSelect}
                    searchOptions={{
                      componentRestrictions: { country: ["tr"] },
                    }}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div className="relative">
                        <input
                          {...getInputProps({
                            placeholder:
                              "Mahalle, cadde veya mekan adı yazın...",
                            className:
                              "w-full px-4 py-3 border border-gray-200  focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all pl-10",
                            autoComplete: "chrome-off",
                            name: "search_places_input_random_id",
                          })}
                        />
                        <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />

                        {(loading || suggestions.length > 0) && (
                          <div className="absolute z-50 w-full bg-white shadow-xl  mt-2 border border-gray-100 overflow-hidden">
                            {loading && (
                              <div className="p-3 text-sm text-gray-500">
                                Yükleniyor...
                              </div>
                            )}
                            {suggestions.map((suggestion, i) => {
                              const style = suggestion.active
                                ? {
                                    backgroundColor: "#f3f4f6",
                                    cursor: "pointer",
                                  }
                                : {
                                    backgroundColor: "#ffffff",
                                    cursor: "pointer",
                                  };
                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    style,
                                    className:
                                      "p-3 text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50 flex items-center gap-2",
                                  })}
                                  key={suggestion.placeId}
                                >
                                  <MapPin
                                    key={i}
                                    className="w-4 h-4 text-gray-400"
                                  />
                                  <span key={i + 1}>
                                    {suggestion.description}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İl
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200  text-gray-500 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İlçe
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200  text-gray-500 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açık Adres Detayı
                  </label>
                  <textarea
                    name="address_line"
                    value={formData.address_line}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        address_line: e.target.value,
                      });
                      setAddressInput(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-200  focus:ring-2 focus:ring-black outline-none min-h-[80px]"
                  />
                </div>

                <input
                  type="hidden"
                  name="latitude"
                  value={formData.latitude || ""}
                />
                <input
                  type="hidden"
                  name="longitude"
                  value={formData.longitude || ""}
                />

                <div className="flex items-center p-4 bg-gray-50 ">
                  <input
                    type="checkbox"
                    name="isDefault"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black accent-black"
                  />
                  <label
                    htmlFor="isDefault"
                    className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Bu adresi varsayılan konumum olarak kullan
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3  border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3  bg-black text-white font-bold hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
                  >
                    {editingAddress ? "Güncelle" : "Adresi Kaydet"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Adres Kartları Listesi */}
      <div className="grid grid-cols-1 gap-5 mt-5">
        {addresses?.map((address, i) => (
          <div
            key={i}
            className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div
                  className={`p-3  h-fit ${
                    address.main_adress
                      ? "bg-red-50 text-red-500"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {address.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {address.district} / {address.city}
                  </p>
                  <p className="text-gray-400 text-xs mt-2 max-w-md">
                    {address.address_line}
                  </p>
                  {(address.main_adress === 1 ||
                    address.main_adress === true) && (
                    <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">
                      Varsayılan
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditAddress(address)}
                  className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                {!address.main_adress && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="p-2 hover:bg-yellow-50 text-gray-400 hover:text-yellow-500 rounded-lg transition-colors"
                  >
                    {defLoading ? "..." : <Star className="w-5 h-5" />}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAddresses;
