import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor -> her isteğe token ekle
api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }

  return config;
});

// Response interceptor -> token süresi dolduysa çıkış
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Backend 401 veya "Unauthenticated." mesajı gönderirse
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.data?.message === "Unauthenticated.") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // sonsuz döngüye girmesin

      // NextAuth ile kullanıcıyı çıkart
      await signOut({ callbackUrl: "/login" }); // istediğin login sayfasına yönlendir

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
