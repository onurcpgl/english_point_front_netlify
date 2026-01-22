import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const instructorAllowedPaths = [
  "/instructor/profile",
  "/instructor/dashboard",
  "/instructor/my-sessions",
  "/instructor/create-session",
  "/instructor/weekly-program",
  "/instructor/participant-information",
  "/instructor/payment",
  "/instructor/settings",
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Auth işlemleri için izin ver
    if (pathname.startsWith("/api/auth")) return NextResponse.next();

    if (pathname.startsWith("/survey")) {
      return NextResponse.next(); // Token olsa da olmasa da bu yolu middleware engellemesin
    }
    // --- YENİ EKLENEN KISIM BAŞLANGIÇ ---
    // Eğer kullanıcı giriş yapmışsa (token varsa) ve Ana Sayfadaysa ('/')
    if (token && pathname === "/") {
      // ÇAKIŞMA ÖNLEYİCİ: Eğer kullanıcı 'instructor' ise, onu course-sessions'a
      // gönderirsek aşağıdaki kısıtlamaya takılıp tekrar profile dönebilir (double redirect).
      // Bu yüzden instructor ise direkt profiline, değilse course-sessions'a gönderiyoruz.
      if (token.role === "instructor") {
        return NextResponse.redirect(new URL("/instructor/dashboard", req.url));
      }

      return NextResponse.redirect(new URL("/course-sessions", req.url));
    }
    // --- YENİ EKLENEN KISIM BİTİŞ ---

    // Token yoksa işlemi burada bitir (return undefined = public sayfaların açılmasına izin verir)
    if (!token) return;

    // Instructor erişim kontrolü (Mevcut kodunuz)
    if (token.role === "instructor") {
      const isAllowed = instructorAllowedPaths.some((path) =>
        pathname.startsWith(path),
      );

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/instructor/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Bu ayar, middleware fonksiyonunun her sayfada çalışmasını sağlar
    },
  },
);

export const config = {
  // matcher'da statik dosyaları hariç tutuyoruz, bu doğru.
  matcher: ["/((?!_next|images|favicon.ico).*)"],
};
