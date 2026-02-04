"use client";
import React, { useEffect, useState } from "react";
import generalService from "../../../utils/axios/generalService"; // baseURL: "/api/proxy" olmalı
import { useQuery } from "@tanstack/react-query";
import { MapPin, Edit2, Star, Trash2 } from "lucide-react";
import SuccesMessageComp from "../../ui/SuccesModal/SuccesMessageComp";
import ErrorModal from "../../ui/ErrorModal/ErrorModal";
import ConfirmModal from "../../ui/ConfirmModal/ConfirmModal";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

function MyAddresses() {
  // TanStack Query ile verileri çekiyoruz
  // İstek artık şu adrese gidecek: englishpoint.com.tr/api/proxy/my-addresses
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
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  useEffect(() => {
    if (data) setAddresses(data);
  }, [data]);

  const handleAddAddress = () => {
    resetForm();
    setShowForm(true);
  };

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

  const handleSelect = async (address) => {
    setAddressInput(address);
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      const addressComponents = results[0].address_components;

      let city = "",
        district = "",
        country = "",
        postal_code = "";

      addressComponents.forEach((component) => {
        const types = component.types;
        if (types.includes("administrative_area_level_1"))
          city = component.long_name;
        if (
          types.includes("administrative_area_level_2") ||
          types.includes("sublocality_level_1")
        )
          district = component.long_name;
        if (types.includes("country")) country = component.long_name;
        if (types.includes("postal_code")) postal_code = component.long_name;
      });

      setFormData((prev) => ({
        ...prev,
        address_line: results[0].formatted_address,
        city,
        district,
        country,
        postal_code,
        latitude: latLng.lat,
        longitude: latLng.lng,
      }));
    } catch (error) {
      console.error("Google Maps Error", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);
    setErrorModalOpen(false);

    const payload = {
      ...formData,
      address_line: addressInput || formData.address_line,
    };

    try {
      let result;
      if (editingAddress) {
        result = await generalService.updatedAdress({
          ...payload,
          id: editingAddress,
        });
      } else {
        result = await generalService.storeAdresses(payload);
      }

      if (result && result.status) {
        setOpenModal(true);
        setModalMessage(result.message || "İşlem başarıyla tamamlandı.");
        resetForm();
        refetch();
      } else {
        throw new Error(result?.message || "İşlem başarısız oldu.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Bir hata oluştu.");
      setErrorModalOpen(true);
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleAskDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteAddress = async () => {
    setConfirmOpen(false);
    if (!deleteId) return;
    try {
      const result = await generalService.deleteAdresses(deleteId);
      if (result.status) {
        setOpenModal(true);
        setModalMessage(result.message || "Adres silindi.");
        refetch();
      }
    } catch (err) {
      setErrorMessage("Silme işlemi başarısız.");
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
      setErrorMessage("Hata oluştu.");
      setErrorModalOpen(true);
    } finally {
      setDefLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  if (isLoading) return <div className="p-10">Yükleniyor...</div>;

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
      <ConfirmModal
        open={confirmOpen}
        message="Bu adresi silmek istediğinize emin misiniz?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDeleteAddress}
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
          className="bg-black text-white px-6 py-2 font-medium hover:bg-white hover:text-black transition-all border border-black"
        >
          + Yeni Adres
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            {/* FORM İÇERİĞİ - Senin mevcut tasarımın buraya gelecek */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {editingAddress ? "Düzenle" : "Yeni Ekle"}
              </h2>
              <button onClick={resetForm} className="text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Adres Başlığı"
                className="w-full p-3 border"
                required
              />

              <PlacesAutocomplete
                value={addressInput}
                onChange={setAddressInput}
                onSelect={handleSelect}
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
                        placeholder: "Adres Ara...",
                        className: "w-full p-3 border",
                      })}
                    />
                    <div className="absolute z-10 bg-white w-full border">
                      {loading && <div>Yükleniyor...</div>}
                      {suggestions.map((s, i) => (
                        <div
                          {...getSuggestionItemProps(s)}
                          key={i}
                          className="p-2 hover:bg-gray-100"
                        >
                          {s.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>

              <div className="flex gap-2">
                <input
                  value={formData.city}
                  readOnly
                  placeholder="Şehir"
                  className="w-1/2 p-3 bg-gray-100"
                />
                <input
                  value={formData.district}
                  readOnly
                  placeholder="İlçe"
                  className="w-1/2 p-3 bg-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={loadingBtn}
                className="w-full bg-black text-white p-3"
              >
                {loadingBtn ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 mt-5">
        {addresses?.map((address) => (
          <div
            key={address.id}
            className="bg-white rounded-2xl p-6 border flex justify-between items-center shadow-sm"
          >
            <div className="flex gap-4">
              <div
                className={`p-3 rounded-lg ${address.main_adress ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-400"}`}
              >
                <MapPin />
              </div>
              <div>
                <h3 className="font-bold">{address.title}</h3>
                <p className="text-sm text-gray-500">{address.address_line}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditAddress(address)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              {!address.main_adress && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Star className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleAskDelete(address.id)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAddresses;
