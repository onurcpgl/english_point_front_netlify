import React from "react";

import InstructorsComp from "../../../components/instructors/InstructorsComp";

const baseUrl = process.env.NEXTAUTH_URL;

export const metadata = {
  title: "Join Us Now! Become a Native Speaker! | English Point",
  description:
    "English Point is a platform where native speakers of English can organize English conversation sessions at various cafés in Türkiye.",
  alternates: {
    // Başına değişkeni koyup sonuna yolu ekliyoruz
    canonical: `${baseUrl}become-instructors`,
  },
};
function Instructors() {
  return (
    <div>
      <InstructorsComp />
    </div>
  );
}

export default Instructors;
