import NextAuth from "next-auth";
import { authOptions } from "../../../../utils/lib/authOptions";

// NextAuth'u ayarlar ile çalıştırıp bir handler oluşturuyoruz
const handler = NextAuth(authOptions);

// App Router için en kritik kısım:
// GET ve POST istekleri için handler'ı export ediyoruz.
export { handler as GET, handler as POST };
