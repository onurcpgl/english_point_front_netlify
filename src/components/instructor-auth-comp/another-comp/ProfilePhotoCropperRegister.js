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
      setImageSrc(null); // kırpma ekranını kapat
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    setImageSrc(null);
    setZoom(1);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {!imageSrc ? (
        <>
          <label className="bg-black text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-gray-800 transition-colors">
            Upload Photo
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </>
      ) : (
        // 🔹 MODAL BAŞLANGICI
        // fixed inset-0: Ekranı kaplar
        // bg-black/70: Arka planı koyu yarı saydam yapar
        // backdrop-blur-sm: Arkadaki siteyi hafifçe bulanıklaştırır
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Modal Kutusu (Beyaz Kart) */}
          <div className="bg-white w-full max-w-[500px] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
            {/* 1. Kırpma Alanı Container */}
            <div className="relative w-full h-[400px] bg-gray-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* 2. Alt Buton Alanı (Footer) */}
            <div className="flex items-center justify-end gap-3 p-4 bg-white border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleCrop}
                className="px-5 py-2 text-sm font-bold text-black bg-[#ffd207] hover:bg-[#e6bd06] rounded-full shadow-sm hover:scale-105 transition-all duration-150"
              >
                Crop and Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoCropper;
