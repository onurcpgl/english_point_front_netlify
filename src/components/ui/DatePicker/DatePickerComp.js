"use client";
import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function ModernDatePicker({ formik }) {
  const inputRef = useRef(null);
  const fpInstance = useRef(null);

  useEffect(() => {
    if (!inputRef.current || fpInstance.current) return;

    // --- HESAPLAMA ---
    // Şu anki zamanı al
    const now = new Date();
    // 2 saat ekle
    const startHour = now.getHours() + 2;
    // Dakikayı 00 yap (Kullanıcının isteği: 13:15 değil 13:00 görünsün)

    // Başlangıç için kısıtlama objesi oluşturuyoruz (Bugün için geçerli)
    const initialMinTime = new Date();
    initialMinTime.setHours(startHour);
    initialMinTime.setMinutes(0);

    fpInstance.current = flatpickr(inputRef.current, {
      enableTime: true,
      noCalendar: false,
      dateFormat: "Y-m-d H:i",
      minDate: "today",
      time_24hr: true,
      closeOnSelect: false,
      disableMobile: "true",

      // GÖRSEL AYAR: Takvim açıldığında saat tekerleği nerede dursun?
      // Eğer formik'te değer yoksa, hesapladığımız (Şu an + 2 saat) değerinde dursun.
      defaultHour: startHour,
      defaultMinute: 0,

      // KISITLAMA: En erken seçilebilecek saat (Dakikayı 00'a yuvarladık)
      minTime: initialMinTime,

      defaultDate: formik.values.session_date,

      onChange: function (selectedDates, dateStr, instance) {
        if (selectedDates.length > 0) {
          const selectedDate = selectedDates[0];
          const currentDate = new Date();

          // Seçilen gün bugün mü?
          const isToday =
            selectedDate.toDateString() === currentDate.toDateString();

          if (isToday) {
            // BUGÜN seçildiyse: Hesaplamayı tekrar yap (Anlık saat değişmiş olabilir)
            const dynamicNow = new Date();
            dynamicNow.setHours(dynamicNow.getHours() + 2);
            dynamicNow.setMinutes(0); // Dakikayı sıfırla

            instance.set("minTime", dynamicNow);
          } else {
            // BAŞKA GÜN seçildiyse: Saat kısıtlamasını kaldır (00:00 serbest)
            instance.set("minTime", null);
          }
        }

        formik.setFieldValue("session_date", dateStr ? dateStr + ":00" : "");
      },
    });

    return () => {
      if (fpInstance.current) {
        fpInstance.current.destroy();
        fpInstance.current = null;
      }
    };
  }, []);

  // Form temizleme senkronizasyonu
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
