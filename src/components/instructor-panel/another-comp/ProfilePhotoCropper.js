"use client";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../../utils/cropImage";

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
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(croppedBlob);
      setImageSrc(null);
    } catch (e) {
      console.error("Crop error:", e);
    }
  };

  const handleCancel = () => {
    setImageSrc(null);
    setZoom(1);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {!imageSrc ? (
        <label className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-800 transition-colors">
          Fotoğraf Yükle
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        // 🔹 MODAL BAŞLANGICI
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Modal Kutusu */}
          <div className="bg-white w-full max-w-[500px] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* 1. Kırpma Alanı (Resim) */}
            <div className="relative w-full h-[400px] bg-gray-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect" // Yuvarlak istersen 'round' yapabilirsin
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* 2. Alt Kontrol Paneli (Butonlar) */}
            <div className="flex items-center justify-end gap-3 p-4 bg-white border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                İptal
              </button>

              <button
                onClick={handleCrop}
                className="px-6 py-2 text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-md transition-all active:scale-95"
              >
                Kırp ve Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoCropper;
