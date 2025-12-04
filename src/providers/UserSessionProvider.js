"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserSessionContext = createContext();

export const UserSessionProvider = ({ children }) => {
  const { data: session, status } = useSession({
    refetchInterval: 10, // session güncelleme aralığı
  });
  const [userSession, setUserSession] = useState(session);
  const router = useRouter();

  // Session state güncelleme
  useEffect(() => {
    setUserSession(session);
  }, [session]);

  // Otomatik logout / redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      // signOut kullanabilirsin veya direkt router.push
      signOut({ callbackUrl: "/login" });
    }
  }, [status, router]);

  return (
    <UserSessionContext.Provider value={{ userSession, status }}>
      {children}
    </UserSessionContext.Provider>
  );
};

// Custom hook
export const useUserSession = () => useContext(UserSessionContext);
