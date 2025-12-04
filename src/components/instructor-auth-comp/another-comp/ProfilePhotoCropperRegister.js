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
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropDone(croppedBlob);
    setImageSrc(null); // kırpma ekranını kapat
  };

  const handleCancel = () => {
    setImageSrc(null);
  };

  return (
    <div className="flex flex-col items-center gap-3 ">
      {!imageSrc ? (
        <>
          <label className="bg-black text-white px-4 py-2 rounded-full text-sm cursor-pointer">
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
        // 🔹 Tam ekran modal (tüm ekranı kaplar)
        <div className="fixed inset-0 z-[9999] bg-blacks/10 flex flex-col items-center justify-center w-full h-full">
          <div className="relative w-full h-full max-w-[600px] max-h-[600px] aspect-square bg-white rounded-xl overflow-hidden">
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

          {/* 🔹 Alt butonlar */}
          <div className="absolute bottom-10 flex gap-4">
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:scale-105 duration-150 transition-all"
            >
              İptal
            </button>
            <div
              onClick={handleCrop}
              className="bg-[#ffd207] text-black cursor-pointer px-4 py-2 rounded-full text-sm hover:scale-105 duration-150 transition-all"
            >
              Kırp ve Kaydet
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoCropper;
