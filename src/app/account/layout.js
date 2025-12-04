// app/login/layout.js
import UserHeader from "../../components/header/UserHeader";
import SideBar from "../../components/account/sidebar/SideBar";
import { UserSessionProvider } from "../../providers/UserSessionProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../utils/lib/authOptions";
import { redirect } from "next/navigation";
import Script from "next/script";
export default async function MainLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  if (session === null) {
    redirect("/login");
  } else {
    if (session.user.role === "instructor") {
      redirect("/");
    }
  }

  return (
    <UserSessionProvider>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />
      <div className="main-layout text-black ">
        <UserHeader />
        <div className="container mx-auto max-lg:flex-col flex gap-10 max-xl:max-w-full max-xl:px-4">
          <div className="">
            <SideBar />
          </div>
          <div className="flex-1 max-lg:px-1 max-lg:w-full ">{children}</div>
        </div>
      </div>
    </UserSessionProvider>
  );
}
