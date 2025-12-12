"use client";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage"; // Yolun doğru olduğundan emin olun

const ProfilePhotoCropper = ({ onCropDone }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageDataUrl = URL.createObjectURL(file);
      setImageSrc(imageDataUrl);
    }
  };

  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(croppedBlob);
      setImageSrc(null); // Kırpma ekranını kapat
    } catch (e) {
      console.error("Kırpma hatası:", e);
    }
  };

  const handleCancel = () => {
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  return (
    <div>
      {!imageSrc ? (
        // 1. Fotoğraf Yükleme Butonu (Değişmedi)
        <label className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-800 transition-colors inline-block">
          Fotoğraf Yükle
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        // 2. Düzenleme Modalı (YENİLENDİ)
        // Dış katman: Ekranı kaplar, yarı saydam siyah arka plan sağlar.
        <div className="fixed inset-0 z-[9999] bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
          {/* Modal Kutusu: Beyaz arka plan, gölge ve yuvarlak köşeler */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-[550px] flex flex-col">
            {/* Kırpma Alanı Başlığı (Opsiyonel, istenirse açılabilir) */}
            {/* <div className="p-4 border-b border-gray-100 text-center font-semibold text-gray-700">
                Fotoğrafı Düzenle
            </div> */}

            {/* Kırpma Alanı Container */}
            <div className="relative w-full aspect-square bg-gray-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect" // Yuvarlak profil fotosu için 'round' yapabilirsiniz
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                // Cropper'ın kendi stillerini ezmek için (gerekirse)
                classes={{
                  containerClassName: "modal-cropper-container",
                  mediaClassName: "modal-cropper-media",
                }}
              />
            </div>

            {/* Alt Butonlar Alanı: Beyaz zemin üzerinde net butonlar */}
            <div className="flex items-center justify-end gap-4 p-5 border-t border-gray-100 bg-white">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              {/* Div yerine button kullanıldı ve stiller iyileştirildi */}
              <button
                onClick={handleCrop}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 transition-colors shadow-sm"
              >
                Kırp ve Kaydett
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoCropper;
