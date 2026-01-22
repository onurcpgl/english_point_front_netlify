"use client";
import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function ModernDatePicker({ formik }) {
  const inputRef = useRef(null);
  const fpInstance = useRef(null);

  useEffect(() => {
    if (!inputRef.current || fpInstance.current) return;

    const now = new Date();
    const startHour = now.getHours() + 2;

    const initialMinTime = new Date();
    initialMinTime.setHours(startHour);
    initialMinTime.setMinutes(0);

    fpInstance.current = flatpickr(inputRef.current, {
      enableTime: true,
      noCalendar: false,
      dateFormat: "Y-m-d H:i",
      minDate: "today",
      time_24hr: true,
      closeOnSelect: false, // Seçim yapınca hemen kapanmasın
      disableMobile: "true",
      defaultHour: startHour,
      defaultMinute: 0,
      minTime: initialMinTime,
      defaultDate: formik.values.session_date,

      // --- OK BUTONU EKLEME ---
      onReady: function (selectedDates, dateStr, instance) {
        // Eğer zaten buton varsa tekrar ekleme
        if (instance.calendarContainer.querySelector(".flatpickr-confirm-btn"))
          return;

        const confirmBtn = document.createElement("div");
        confirmBtn.className = "flatpickr-confirm-btn";
        confirmBtn.innerHTML = "OK";

        // Stil Ayarları (Tasarımınıza uygun sarı buton)
        Object.assign(confirmBtn.style, {
          backgroundColor: "#FFD207",
          color: "#000",
          padding: "10px",
          margin: "10px",
          textAlign: "center",
          cursor: "pointer",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "14px",
        });

        confirmBtn.addEventListener("click", () => {
          instance.close();
        });

        instance.calendarContainer.appendChild(confirmBtn);
      },

      onChange: function (selectedDates, dateStr, instance) {
        if (selectedDates.length > 0) {
          const selectedDate = selectedDates[0];
          const currentDate = new Date();
          const isToday =
            selectedDate.toDateString() === currentDate.toDateString();

          if (isToday) {
            const dynamicNow = new Date();
            dynamicNow.setHours(dynamicNow.getHours() + 2);
            dynamicNow.setMinutes(0);
            instance.set("minTime", dynamicNow);
          } else {
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

  useEffect(() => {
    if (fpInstance.current && !formik.values.session_date) {
      fpInstance.current.clear();
    }
  }, [formik.values.session_date]);

  return (
    <div className="space-y-2">
      <style
        dangerouslySetInnerHTML={{
          __html: `
  /* Seçili Günün Arka Planı (Mavi yerine Sarı) */
  .flatpickr-day.selected, 
  .flatpickr-day.startRange, 
  .flatpickr-day.endRange, 
  .flatpickr-day.selected:focus, 
  .flatpickr-day.selected:hover, 
  .flatpickr-day.prevMonthDay.selected, 
  .flatpickr-day.nextMonthDay.selected {
    background: #FFD207 !important;
    border-color: #FFD207 !important;
    color: #000 !important; /* Yazı siyah olsun ki okunsun */
  }

  /* Bugünün Etrafındaki Çizgi */
  .flatpickr-day.today {
    border-color: #FFD207 !important;
  }

  /* Bugünün üzerine gelince veya seçince */
  .flatpickr-day.today:hover {
    background: #FFD207 !important;
    color: #000 !important;
  }

  /* Saat seçimindeki mavi odaklanmayı (focus) sarı yapma */
  .flatpickr-time input:focus {
    background: rgba(253, 210, 7, 0.1) !important;
  }

  /* Takvimin genelindeki OK butonunun hover efekti (önceki eklediğimiz) */
  .flatpickr-confirm-btn:hover {
    background-color: #eec506 !important;
  }
`,
        }}
      />
      <label className="flex items-center text-sm font-medium text-gray-700">
        Session Date
      </label>
      <input
        ref={inputRef}
        type="text"
        readOnly={true}
        className="w-full h-14 rotate-0 focus:rounded-0 outline-0 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black"
        placeholder="Select date & time"
      />
      {formik.touched.session_date && formik.errors.session_date && (
        <div className="text-red-500 text-sm">{formik.errors.session_date}</div>
      )}
    </div>
  );
}
