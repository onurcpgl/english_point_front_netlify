// app/login/layout.js
import Providers from "../../utils/providers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../utils/lib/authOptions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Giriş Yap - English Point",
};

export default async function AuthLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (session !== null) {
    redirect("/");
  }
  return <Providers>{children}</Providers>;
}
