"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const InstructorSessionContext = createContext();

export const InstructorSessionProvider = ({ children }) => {
  const { data: session, status } = useSession({
    refetchInterval: 10, // session güncelleme aralığı
  });
  const [instructorSession, setInstructorSession] = useState(session);
  const router = useRouter();

  // Session state güncelleme
  useEffect(() => {
    setInstructorSession(session);
  }, [session]);

  // Otomatik logout / redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      // signOut kullanabilirsin veya direkt router.push
      signOut({ callbackUrl: "/instructor-login" });
    }
  }, [status, router]);

  return (
    <InstructorSessionContext.Provider value={{ instructorSession, status }}>
      {children}
    </InstructorSessionContext.Provider>
  );
};

// Custom hook
export const useInstructorSession = () => useContext(InstructorSessionContext);
