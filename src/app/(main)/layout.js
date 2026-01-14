"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { CartProvider } from "../../context/CartContext";
import Loading from "../../components/loading/LoadingSimple";
export default function MainLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Eğer login değilse login sayfasına yönlendir
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Henüz oturum kontrolü yükleniyorsa boş bir ekran gösterebiliriz
  if (status === "loading") {
    return <Loading />;
  }

  // Giriş yapılmışsa sayfayı göster
  if (status === "authenticated") {
    return (
      <CartProvider>
        <div className="main-layout">
          <Header />
          {children}
          <Footer />
        </div>
      </CartProvider>
    );
  }

  // Aksi halde (örneğin yönlendirme aşamasında) hiçbir şey gösterme
  return null;
}
