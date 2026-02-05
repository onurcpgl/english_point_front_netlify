// utils/lib/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  debug: false,
  providers: [
    // 1. MEVCUT EMAIL/PASSWORD GİRİŞİ
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "E-posta", type: "text" },
        password: { label: "Şifre", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const rememberMe = credentials.rememberMe;

        // ENV: http://127.0.0.1:8000 (Sonunda slash yok)
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

        let url;

        // DÜZELTME: Araya /api/ ekledik
        if (credentials.role === "instructor") {
          url = `${baseURL}/api/instructor/login`;
        } else {
          url = `${baseURL}/api/login`;
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

    // 2. SOCIAL LOGIN PROVIDER
    CredentialsProvider({
      id: "social-login-token",
      name: "Social Login",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token) {
          return null;
        }

        const token = credentials.token;
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

        try {
          // DÜZELTME: Araya /api/ ekledik
          const res = await fetch(`${baseURL}/api/user/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

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
