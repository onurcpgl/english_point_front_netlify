import React from "react";
import UserResetPassword from "../../../../components/user-auth-comp/user-reset-password/UserResetPassword";

export const metadata = {
  title: "Şifrenizi Sıfırlayın | English Point",
  description:
    "Güvenliğiniz için hesabınızın şifresini bu sayfadan güncelleyebilirsiniz.",
  // BU KISIM ÇOK ÖNEMLİ:
  robots: {
    index: false, // Google bu sayfayı dizine eklemez
    follow: false, // Sayfadaki hiçbir linki takip etmez
  },
};

function page() {
  return <UserResetPassword />;
}

export default page;
