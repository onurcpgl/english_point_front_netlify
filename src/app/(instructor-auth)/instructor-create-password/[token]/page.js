import React from "react";
import InstructorCreatePassword from "../../../../components/instructor-auth-comp/instructor-create-password/InstructorCreatePassword";
export const metadata = {
  title: "Create Your Password | English Point",
  description:
    "Set up a secure password for your account to start organizing or joining English conversation sessions.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};
function page() {
  return <InstructorCreatePassword />;
}

export default page;
