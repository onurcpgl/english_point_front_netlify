"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function TransitionProvider({ children }) {
  const pathname = usePathname();
  const [loaded, setLoaded] = useState(false);

  // sayfa yüklenmesini bekle
  useEffect(() => {
    setLoaded(true);
  }, [pathname]);

  if (!loaded) return <>{children}</>; // yüklenmeden göster

  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
