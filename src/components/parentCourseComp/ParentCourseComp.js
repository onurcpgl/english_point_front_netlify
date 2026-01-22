"use client";

import React from "react";
import { useSession } from "next-auth/react";
import CourseSessionsComp from "../course-sessions/CourseSessionsComp";
import CourseComp from "../course/CourseComp";
import LoadingSimple from "../loading/LoadingSimple";

function Educations() {
  const { data: session, status } = useSession();

  // 🔄 Session yüklenirken
  if (status === "loading") {
    return <LoadingSimple />;
  }

  // 🔒 Kullanıcı login olmuşsa CourseSessionsComp, değilse CourseComp
  if (session?.user) {
    return <CourseSessionsComp />;
  } else {
    return <CourseComp />;
  }
}

export default Educations;
