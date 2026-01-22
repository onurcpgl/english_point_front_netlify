import React from "react";
import InstructorResetPassword from "../../../../components/instructor-auth-comp/instructor-reset-password/InstructorResetPassword";
export const metadata = {
  title: "Reset Your Password | English Point",
  description:
    "Securely update your account password to regain access to your instructor dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};
function page() {
  return <InstructorResetPassword />;
}

export default page;
