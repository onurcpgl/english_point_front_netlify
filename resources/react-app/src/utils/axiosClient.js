import axios from "axios";
import Cookies from "js-cookie";

const AxiosClient = axios.create({
    baseURL: `http://127.0.0.1:8000/admin/`,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Otomatik Çıkış Yardımcı Fonksiyonu
const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    Cookies.remove("refreshToken");
    // Kullanıcıyı login sayfasına yönlendir
    window.location.href = "/";
};

// Request Interceptor
AxiosClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("ACCESS_TOKEN");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
AxiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 Hatası (Unauthorized) ve daha önce denenmemişse
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = Cookies.get("refreshToken");

            if (refreshToken) {
                try {
                    // ÖNEMLİ: Kendi AxiosClient'ımızı değil, ana axios'u kullanıyoruz (sonsuz döngü olmasın diye)
                    const response = await axios.post(
                        "https://api.englishpoint.com.tr/admin/refresh-token",
                        { refresh_token: refreshToken }
                    );

                    const newAccessToken = response.data.access_token;

                    // Yeni token'ı kaydet
                    localStorage.setItem("ACCESS_TOKEN", newAccessToken);

                    // Header'ı güncelle ve isteği tekrarla
                    originalRequest.headers[
                        "Authorization"
                    ] = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    // Refresh token da geçersizse veya API hata verirse
                    console.error("Oturum yenilenemedi, çıkış yapılıyor...");
                    handleLogout();
                    return Promise.reject(refreshError);
                }
            } else {
                // Refresh token yoksa direkt çıkış yap
                handleLogout();
            }
        }

        // Diğer hataları (403, 404, 500 vb.) olduğu gibi fırlat
        return Promise.reject(error);
    }
);

export default AxiosClient;
