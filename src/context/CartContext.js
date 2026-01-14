"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import generalService from "../utils/axios/generalService";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isInitialLoad = useRef(true);
  // --- YENİ EKLENEN MANİPÜLASYON FONKSİYONU ---
  // Bu fonksiyon gelen veriyi kontrol eder ve Google Cafe varsa
  // onu normal Cafe formatına çevirip 'cafe' alanına koyar.
  const processBasketData = (data) => {
    // Veri yapısı geçerli mi kontrol et
    if (!data?.basket?.course_session) return data;

    const courseSession = data.basket.course_session;
    // Eğer normal cafe YOKSA ama google_cafe VARSA
    if (!courseSession.cafe && courseSession.google_cafe) {
      const gCafe = courseSession.google_cafe;

      // Google verisini Cafe formatına uyduruyoruz (Mapping)
      // Frontend 'latitude', 'image' vb. bekliyor olabilir.
      courseSession.cafe = {
        ...gCafe, // Google verilerini kopyala
        // Eksik veya farklı isimlendirilmiş alanları düzelt:
        address: gCafe.vicinity || gCafe.address, // Google'da adres 'vicinity' olabilir
        latitude: gCafe.latitude || gCafe.lat || 0,
        longitude: gCafe.longitude || gCafe.lng || 0,
        // Google'da resim array olabilir veya icon olabilir, bunu 'image' yapıyoruz
        image: gCafe.image || gCafe.icon || gCafe.photos?.[0] || null,
        is_google: true, // İlerde lazım olur diye işaret koyduk
      };
    }

    return data;
  };
  // ------------------------------------------------

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated" || session.user.role !== "user") {
      setSessions({ basket: null, success: false });
      setLoading(false);
      return;
    }

    async function loadCart() {
      setLoading(true);
      try {
        const res = await generalService.getBasket();

        // --- DEĞİŞİKLİK BURADA ---
        // Veriyi state'e atmadan önce işliyoruz
        const processedRes = processBasketData(res);
        setSessions(processedRes || { basket: null, success: true });
        localStorage.setItem("cartSessions", JSON.stringify(processedRes));
      } catch (e) {
        setSessions({ basket: null, success: true });
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, [status, session, pathname]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    // Session değiştiğinde localStorage güncelle
    if (sessions) {
      localStorage.setItem("cartSessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  const addSession = async (data) => {
    const sessionData = data.basket;
    try {
      const result = await generalService.addToBasket(sessionData.id);

      if (result.success) {
        setSessions({ basket: result.basket, success: true });
        localStorage.setItem("cartSessions", JSON.stringify(result));
        return result;
      } else {
        // Backend 200 döndü ama success:false ise
        return result;
      }
    } catch (e) {
      console.error("Sepete ekleme hatası:", e);

      if (e.response && e.response.data) {
        return e.response.data; // { success: false, message: "Bu eğitimi zaten aldınız." } döner.
      }
      throw e;
    }
  };

  const removeSession = async (basket_id) => {
    try {
      const resultSession = await generalService.clearBasket(basket_id);

      if (resultSession.success) {
        localStorage.removeItem("cartSessions");
        // State'i güncelle
        setSessions({ basket: null, success: true });
        return true; // BAŞARILI: İşlem bitti, true dönüyoruz
      } else {
        return false; // BAŞARISIZ: Backend success: false döndü
      }
    } catch (e) {
      console.error(e);
      return false; // HATA: Try-catch'e düştü, false dönüyoruz
    }
  };

  const clearCart = async () => {
    localStorage.removeItem("cartSessions");
    setSessions({ basket: null, success: true });
  };

  return (
    <CartContext.Provider
      value={{ sessions, loading, addSession, removeSession, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
