"use client";

import { useState, useEffect } from "react";

export default function NearbyCafes({
  setUserLocation,
  userLocation,
  range,
  setRange,
}) {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, [setUserLocation]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col">
        <div className="w-full flex justify-between items-center text-black font-bold mb-2">
          <p>1km</p>
          <p>20km</p>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="w-full h-3 bg-black rounded-lg appearance-none cursor-pointer shadow-2xl"
        />
        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 25px; /* dikey boy */
            width: 12px; /* yatay boy */
            background: #ffd207; /* sarı */
            border-radius: 25px; /* elips */
            cursor: pointer;
            margin-top: -10px; /* track ortalama */
          }

          input[type="range"]::-webkit-slider-runnable-track {
            height: 8px;
            background: black;
            border-radius: 4px;
          }

          input[type="range"]::-moz-range-track {
            height: 8px;
            background: black;
            border-radius: 4px;
          }
        `}</style>
      </div>
    </div>
  );
}
