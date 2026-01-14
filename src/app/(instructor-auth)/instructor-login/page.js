import React from "react";
import { Suspense } from "react";
import InstructorLoginComp from "../../../components/instructor-auth-comp/Login/InstructorLogin";
function InstroctorLogin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InstructorLoginComp />
    </Suspense>
  );
}

export default InstroctorLogin;
