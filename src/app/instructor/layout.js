// app/login/layout.js
import InstructorSidebar from "../../components/instructor-panel/instructor-sidebar/InstructorSidebar";
import InstroctorHeader from "../../components/header/InstroctorHeader";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../utils/lib/authOptions";
import { InstructorSessionProvider } from "../../providers/InstructorSessionProvider";

export const metadata = {
  title: "Instructor Panel | English Point",
  description:
    "Access your instructor dashboard to create, manage, and edit your English conversation sessions. Track your schedule and connect with students effortlessly.",
  robots: {
    index: false, // Panel olduğu için arama sonuçlarında gizliyoruz
    follow: false,
    nocache: true,
  },
};

export default async function InstructorLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/instructor-login");
  }
  if (session === null) {
    redirect("/instructor-login");
  } else {
    if (session.user.role === "user") {
      redirect("/");
    }
  }

  return (
    <InstructorSessionProvider>
      <div className="main-layout">
        <InstroctorHeader />
        <div className="container mx-auto max-lg:flex-col flex gap-2 max-xl:max-w-full max-xl:px-2">
          <div className="">
            <InstructorSidebar />
          </div>
          <div className="flex-1 pl-6 max-lg:px-0 max-lg:w-full max-lg:mt-20 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </InstructorSessionProvider>
  );
}
