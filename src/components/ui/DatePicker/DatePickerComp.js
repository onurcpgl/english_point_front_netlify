"use client";
import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function ModernDatePicker({ formik }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const now = new Date();
    const currentHour = now.getHours() % 12 || 12;
    const currentMinutes = now.getMinutes();

    const fp = flatpickr(inputRef.current, {
      enableTime: true,
      noCalendar: false,
      dateFormat: "Y-m-d H:i", // <-- MySQL uyumlu format
      minDate: now,
      time_24hr: true, // <-- AM/PM disabled
      defaultHour: currentHour,
      defaultMinute: currentMinutes,
      onReady: function (selectedDates, dateStr, instance) {
        const minTimeStr = `${currentHour}:${currentMinutes}`;
        instance.set("minTime", minTimeStr);
      },
      onChange: function (selectedDates, dateStr) {
        formik.setFieldValue("session_date", dateStr + ":00"); // saniye ekle
      },
    });

    return () => fp.destroy();
  }, [formik]);

  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        Session Date
      </label>
      <input
        ref={inputRef}
        type="text"
        value={formik.values.session_date || ""}
        onChange={() => {}}
        className="w-full h-14 outline-none px-4 bg-white text-black placeholder:text-gray-400"
        placeholder="Select date & time"
      />
      {formik.touched.session_date && formik.errors.session_date && (
        <div className="text-red-500 text-sm">{formik.errors.session_date}</div>
      )}
    </div>
  );
}
