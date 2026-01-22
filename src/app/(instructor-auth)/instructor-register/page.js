import InstructorRegister from "../../../components/instructor-auth-comp/Register/InstructorRegister";
import React from "react";

const baseUrl = process.env.NEXTAUTH_URL;

export const metadata = {
  title: "Join Us Now! Become a Native Speaker! | English Point",
  description:
    "English Point is a platform where native speakers of English can organize English conversation sessions at various cafés in Türkiye.",
  alternates: {
    // Başına değişkeni koyup sonuna yolu ekliyoruz
    canonical: `${baseUrl}instructor-register`,
  },
};

function page() {
  return (
    <div>
      <InstructorRegister />
    </div>
  );
}

export default page;
