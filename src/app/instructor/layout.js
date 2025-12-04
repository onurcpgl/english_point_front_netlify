// app/login/layout.js
import InstructorSidebar from "../../components/instructor-panel/instructor-sidebar/InstructorSidebar";
import InstroctorHeader from "../../components/header/InstroctorHeader";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../utils/lib/authOptions";
import { InstructorSessionProvider } from "../../providers/InstructorSessionProvider";

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
          <div className="flex-1 px-6 max-lg:px-0 max-lg:w-full max-lg:mt-20">
            {children}
          </div>
        </div>
      </div>
    </InstructorSessionProvider>
  );
}
