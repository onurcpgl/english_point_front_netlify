// import { Geist, Geist_Mono } from "next/font/google";
import { Jost } from "next/font/google";
import "./globals.css";
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
      <body className={jost.variable}>
        <TransitionProvider>
          <Providers>
            <CartProvider> {children}</CartProvider>
          </Providers>
        </TransitionProvider>
      </body>
    </html>
  );
}
