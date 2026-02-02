// import { Geist, Geist_Mono } from "next/font/google";
import { Jost } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // Script bileşeni burada önemli
import Providers from "../utils/providers";

import { CartProvider } from "../context/CartContext";
import "react-calendar/dist/Calendar.css";
import TransitionProvider from "../components/transitionProvider/TransitionProvider";

const jost = Jost({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-jost",
});

export const metadata = {
  title: "English Point - İngilizce Öğrenme Platformu",
  description: "İngilizce öğrenmek hiç bu kadar kolay olmamıştı!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      {/* 1. ADIM: Google Tag Manager Script (Head kısmı için) */}
      {/* Next.js Script bileşeni bu kodu otomatik olarak head'e veya en uygun yere enjekte eder */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KBRWQQSP');
        `}
      </Script>

      <body className={jost.variable}>
        {/* 2. ADIM: Google Tag Manager NoScript (Body'nin hemen girişi) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KBRWQQSP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <TransitionProvider>
          <Providers>
            <CartProvider> {children}</CartProvider>
          </Providers>
        </TransitionProvider>
      </body>
    </html>
  );
}
