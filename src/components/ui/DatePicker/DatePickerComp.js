"use client";
import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
// import { Turkish } from "flatpickr/dist/l10n/tr.js";

export default function ModernDatePicker({ formik }) {
  // Doğrudan input elementine referans veriyoruz.
  const inputRef = useRef(null);
  // Flatpickr örneğini saklamak için (temizlik ve dışarıdan müdahale için)
  const fpInstance = useRef(null);

  useEffect(() => {
    // Referans yoksa veya zaten başlatılmışsa dur.
    if (!inputRef.current || fpInstance.current) return;

    // Flatpickr'ı doğrudan INPUT elementi üzerinde başlatıyoruz.
    fpInstance.current = flatpickr(inputRef.current, {
      enableTime: true,
      noCalendar: false,
      dateFormat: "Y-m-d H:i",
      minDate: "today",
      time_24hr: true,
      closeOnSelect: false, // Tarih seçilince saat için açık kalsın
      disableMobile: "true", // iOS'un kendi dandik tarih seçicisini engelle
      // locale: Turkish,

      // ÖNEMLİ: Başlangıçta inputun içinde görünecek değeri buraya veriyoruz.
      // Eğer formik'te kayıtlı bir değer varsa onu gösterir.
      defaultDate: formik.values.session_date,

      onChange: function (selectedDates, dateStr, instance) {
        // Dinamik saat kontrolü (Bugün ise geçmiş saatleri kapat)
        if (selectedDates.length > 0) {
          const selectedDate = selectedDates[0];
          const isToday =
            selectedDate.toDateString() === new Date().toDateString();
          instance.set("minTime", isToday ? new Date() : null);
        }

        // SEÇİM YAPILDIĞINDA:
        // 1. Flatpickr otomatik olarak input'un görünen değerini günceller (Bizim bir şey yapmamıza gerek yok).
        // 2. Biz sadece arka planda Formik'in durumunu güncelliyoruz.
        formik.setFieldValue("session_date", dateStr ? dateStr + ":00" : "");
      },
    });

    // Temizlik: Bileşen ekrandan gidince Flatpickr'ı yok et.
    return () => {
      if (fpInstance.current) {
        fpInstance.current.destroy();
        fpInstance.current = null;
      }
    };

    // Bağımlılık dizisi BOŞ. Sadece ilk renderda çalışır.
    // Bu sayede seçim yapınca kapanma sorunu yaşanmaz.
  }, []);

  // EKSTRA: Eğer başka bir yerden "Formu Temizle" butonuna basılırsa
  // Flatpickr'ın görselini de temizlemek için bir senkronizasyon.
  useEffect(() => {
    if (fpInstance.current && !formik.values.session_date) {
      fpInstance.current.clear();
    }
  }, [formik.values.session_date]);

  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        Session Date
      </label>
      <input
        ref={inputRef}
        type="text"
        // ÖNEMLİ: value={} veya defaultValue={} KULLANMIYORUZ.
        // Input'un görsel kontrolünü tamamen Flatpickr'a bırakıyoruz.

        // iOS'ta klavye açılmasını engellemek için şart.
        readOnly={true}
        className="w-full h-14 outline-none px-4 bg-white text-black placeholder:text-gray-400   cursor-pointer"
        placeholder="Select date & time"
      />
      {formik.touched.session_date && formik.errors.session_date && (
        <div className="text-red-500 text-sm">{formik.errors.session_date}</div>
      )}
    </div>
  );
}
