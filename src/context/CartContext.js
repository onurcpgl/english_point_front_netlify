"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import generalService from "../utils/axios/generalService";
import { useSession } from "next-auth/react";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(true); // <-- loading state
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (status === "loading") return;

    // Role kontrolü
    if (status !== "authenticated" || session.user.role !== "user") {
      setSessions({ basket: null, success: false });
      setLoading(false);
      return;
    }
    async function loadCart() {
      setLoading(true);
      try {
        const res = await generalService.getBasket();
        setSessions(res || { basket: null, success: true });
        localStorage.setItem("cartSessions", JSON.stringify(res));
      } catch (e) {
        //const stored = localStorage.getItem("cartSessions");
        //if (stored) setSessions(JSON.parse(stored));
        setSessions({ basket: null, success: true });
      } finally {
        setLoading(false); // <-- loading bitiyor
      }
    }
    loadCart();
  }, [status]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    localStorage.setItem("cartSessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = async (session) => {
    try {
      const result = await generalService.addToBasket(session.id);
      if (result.success) {
        setSessions(session); // array olmalı
        localStorage.setItem("cartSessions", JSON.stringify(session));
        return true;
      } else {
        console.error("Sepete ekleme başarısız:", result.message);
        return false;
      }
    } catch (e) {
      console.error("Sepete ekleme hatası:", e);
      return false;
    }
  };

  const removeSession = async (basket_id) => {
    try {
      const resultSession = await generalService.clearBasket(basket_id);
      //setSessions(updated);
      if (resultSession.success) {
        localStorage.removeItem("cartSessions");
        setSessions({ basket: null, success: true });
      }
    } catch (e) {
      console.error(e);
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
