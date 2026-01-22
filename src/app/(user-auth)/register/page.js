import RegisterComponents from "../../../components/user-auth-comp/register/RegisterComponents";
import React from "react";
const baseUrl = process.env.NEXTAUTH_URL;

export const metadata = {
  title: "Aramıza Katıl! İngilizceyi Konuşarak Öğrenmeye Başla | English Point",
  description:
    "English Point'e ücretsiz üye olun, ana dili İngilizce olan eğitmenlerle kafelerde buluşun. Seviyenize uygun konuşma oturumlarına katılmak için hemen profilinizi oluşturun!",
  alternates: {
    canonical: `${baseUrl}register`, // URL yapına göre 'register' kısmını güncelleyebilirsin
  },
};
function page() {
  return (
    <div>
      <RegisterComponents />
    </div>
  );
}

export default page;
