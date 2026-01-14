import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useStateContext } from "../../src/context/ContextProvider"; // Context yolunu kontrol et
import axios from "axios"; // Axios importu
import generalService from "../../src/services/generalService";
// Eğer axiosClient dosyan varsa onu import et, yoksa direkt axios kullanacağız.
// import axiosClient from '../../axios-client';

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    // Form verileri
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Hata ve Yükleniyor durumu
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Context'ten setToken ve setUser çekiyoruz
    const { setToken, setUser } = useStateContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const payload = {
            email: email,
            password: password,
        };

        try {
            const response = await generalService.login(payload);
            const { user, access_token } = response.data.data;
            setUser(user);
            setToken(access_token);

            // 3. YÖNLENDİRME İŞLEMİ BURADA YAPILIYOR25525
            // Token set edildikten hemen sonra kullanıcıyı dashboard'a atıyoruz.
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            const response = err.response;
            if (response && response.status === 422) {
                setError("Lütfen bilgileri eksiksiz giriniz.");
            } else if (response && response.status === 401) {
                setError("E-posta veya şifre hatalı.");
            } else {
                setError("Sunucuya bağlanırken bir hata oluştu.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-lg mb-4">
                            <Lock className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Admin Paneli
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Yönetici hesabınıza giriş yapın
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                E-posta Adresi
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-shadow"
                                    placeholder="admin@englishpoint.com.tr"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Şifre
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-shadow"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-gray-600 cursor-pointer select-none"
                                >
                                    Beni hatırla
                                </label>
                            </div>
                            {/* <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Şifremi unuttum
                                </a>
                            </div> */}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                "Giriş Yap"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-400">
                        © 2024 English Point Yönetim Paneli
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
