"use client"; // Next.js App Router için zorunlu

import CookieConsent from "react-cookie-consent";

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Kabul Ediyorum"
      cookieName="site_cerez_onayi" // Çerezin tarayıcıdaki adı
      style={{ background: "#2B373B" }} // Banner arka plan rengi
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }} // Buton stili
      expires={150} // Çerezin kaç gün geçerli olacağı
    >
      Sitemizde deneyiminizi iyileştirmek için çerezler kullanılmaktadır.
      Detaylı bilgi için{" "}
      <a href="/kvkk" style={{ color: "#FFF", textDecoration: "underline" }}>
        Çerez Politikamızı
      </a>{" "}
      inceleyebilirsiniz.
    </CookieConsent>
  );
}
