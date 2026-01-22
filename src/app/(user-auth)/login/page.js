import Login from "../../../components/user-auth-comp/login/Login";
import React from "react";
const baseUrl = process.env.NEXTAUTH_URL;

export const metadata = {
  title: "Giriş Yap seviyene uygun eğitimlere katıl! | English Point",
  description:
    "English Point hesabınıza giriş yaparak seviyenize özel İngilizce konuşma oturumlarını keşfedin, randevularınızı yönetin ve ana dili İngilizce olan eğitmenlerle pratik yapmaya hemen başlayın.",
  alternates: {
    // Başına değişkeni koyup sonuna yolu ekliyoruz
    canonical: `${baseUrl}login`,
  },
};
function page({ searchParams }) {
  return <Login />;
}

export default page;
