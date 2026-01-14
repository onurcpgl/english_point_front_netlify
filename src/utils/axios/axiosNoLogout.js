// apiNoLogout.js
import axios from "axios";
import { getSession } from "next-auth/react";

const apiNoLogout = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiNoLogout.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    // Sadece session varsa Authorization ekle
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
  } catch (err) {
    // session yoksa silent fail, redirect yok
    console.warn("No session available, proceeding without token");
  }
  return config;
});

// Response interceptor yok → 401 gelirse logout yapılmaz
export default apiNoLogout;
