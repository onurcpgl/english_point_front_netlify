// utils/lib/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  debug: true,
  providers: [
    // 1. MEVCUT EMAIL/PASSWORD GİRİŞİ (Dokunmuyoruz)
    CredentialsProvider({
      id: "credentials", // Buna bir ID verdik (varsayılanı zaten credentials ama açıkça yazmak iyidir)
      name: "Credentials",
      credentials: {
        email: { label: "E-posta", type: "text" },
        password: { label: "Şifre", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        // ... senin mevcut kodun aynen kalacak ...
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const rememberMe = credentials.rememberMe;
        let url;

        if (credentials.role === "instructor") {
          url = `https://api.englishpoint.com.tr/api/instructor/login`;
        } else {
          url = `https://api.englishpoint.com.tr/api/login`;
        }

        try {
          const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          const data = await res.json();
          const user = data.user;
          if (res.ok && user) {
            return {
              ...user,
              role: credentials.role,
              token: data.token,
              rememberMe: rememberMe,
            };
          } else {
            console.error("Login failed:", data);
            return null;
          }
        } catch (error) {
          console.error("Fetch error during login:", error);
          return null;
        }
      },
    }),

    // 2. YENİ EKLENEN SOCIAL LOGIN PROVIDER (Token ile Giriş)
    // 2. YENİ EKLENEN SOCIAL LOGIN PROVIDER (Token ile Profil Çeken Versiyon)
    CredentialsProvider({
      id: "social-login-token",
      name: "Social Login",
      credentials: {
        token: { label: "Token", type: "text" },
        // User verisine artık ihtiyacımız yok, token ile gidip kendimiz alacağız
      },
      async authorize(credentials) {
        // Token yoksa işlem yapma
        if (!credentials?.token) {
          return null;
        }

        const token = credentials.token;

        try {
          // SENİN İSTEDİĞİN MANTIK: Token ile Profile İstek Atıyoruz
          const res = await fetch(
            "https://api.englishpoint.com.tr/api/user/profile",
            {
              method: "GET", // Genelde profil çekmek GET olur, endpoint POST ise burayı değiştir
              headers: {
                Authorization: `Bearer ${token}`, // Token'ı header'a ekledik
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          // API'den gelen cevap
          const data = await res.json();
          const user = data.user || data.data || data;

          if (res.ok && user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              profile_image: user.avatar || user.profile_image,
              role: user.role || "user",
              token: token,
            };
          } else {
            console.error("Profile fetch failed:", data);
            return null;
          }
        } catch (error) {
          console.error("Error fetching user profile with token:", error);
          return null;
        }
      },
    }),
  ],

  // ... SESSION, JWT, EVENTS, PAGES ve CALLBACKS kısımları aynen kalıyor ...
  session: {
    strategy: "jwt",
    maxAge: 60 * 3000,
  },
  jwt: {
    maxAge: 60 * 3000,
  },
  events: {
    error(message) {
      console.error("NEXTAUTH ERROR:", message);
    },
    // ...
  },
  pages: {
    signIn: "/api/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.profile_image = user.profile_image;
        token.role = user.role;

        // DİKKAT: Normal girişte user.token, social girişte yine user.token olarak ayarladık
        token.accessToken = user.token || user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.profile_image = token.profile_image;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return url;
    },
  },
};
