import React from "react";
import { Suspense } from "react";
import InstructorLoginComp from "../../../components/instructor-auth-comp/Login/InstructorLogin";
const baseUrl = process.env.NEXTAUTH_URL;

export const metadata = {
  title: "Session oluştur ve Kazanmaya Başla! | English Point",
  description:
    "English Point eğitmen panelinize giriş yaparak yeni konuşma oturumları oluşturun, randevularınızı yönetin ve kazancınızı takip edin.",
  alternates: {
    canonical: `${baseUrl}instructor-login`,
  },
};
function InstroctorLogin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InstructorLoginComp />
    </Suspense>
  );
}

export default InstroctorLogin;
