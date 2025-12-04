"use client";

import { useEffect, useRef, useState } from "react";

function Counter({ end, duration }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          let totalMs = duration * 1000;
          let increment = end / (totalMs / 16);

          const counter = setInterval(() => {
            start += increment;
            if (start >= end) {
              start = end;
              clearInterval(counter);
            }
            setCount(Math.floor(start));
          }, 16);

          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function Talking() {
  return (
    <>
      <div className="container mx-auto my-20 px-5 sm:px-10 md:px-20">
        <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-4 items-center text-black text-center sm:text-left">
          <div className="text-2xl sm:text-3xl md:text-4xl leading-snug flex-1">
            <span className="font-medium">
              <Counter end={500} duration={3} />+{" "}
            </span>
            <p>Öğretmen</p>
          </div>

          <div className="text-2xl sm:text-3xl md:text-4xl leading-snug flex-1">
            <span className="font-medium">
              <Counter end={120} duration={3} />+{" "}
            </span>
            <p>Farklı Mekan</p>
          </div>

          <div className="text-2xl sm:text-3xl md:text-4xl leading-snug flex-1">
            <span className="font-medium">
              <Counter end={300000} duration={3} />+{" "}
            </span>
            <p>Öğretmen Yorumu</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Talking;
