"use client";

import { useState } from "react";
import Calendar from "react-calendar";

export default function MyCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="calendar-container">
      <Calendar onChange={setDate} value={date} className="modern-calendar" />
    </div>
  );
}
