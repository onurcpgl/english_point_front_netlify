import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Servis dosyanı import et
import generalService from "../../services/generalService";

function ProgramCategorySave() {
    const navigate = useNavigate();

    // --- STATE ---
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Form Verileri (Başlangıç değerleri)
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        is_active: 1, // Varsayılan olarak Aktif gelsin
    });

    // --- INPUT HANDLER ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            // is_active select kutusundan string gelebilir, sayıya çeviriyoruz
            [name]: name === "is_active" ? parseInt(value) : value,
        }));
    };

    // --- SUBMIT (KAYDET) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            // İsteğini gönder (generalService içindeki getProgramCategorySave fonksiyonunu kullanıyoruz)
            const response = await generalService.getProgramCategorySave(
                formData
            );

            // Başarılı kontrolü (Backend yapına göre response.status veya data.status değişebilir)
            if (
                response?.data?.status ||
                response?.status === 201 ||
                response?.status === 200
            ) {
                setMessage({
                    type: "success",
                    text: "Kategori başarıyla oluşturuldu! Yönlendiriliyorsunuz...",
                });

                // Formu temizle
                setFormData({ name: "", slug: "", is_active: 1 });

                // 1.5 saniye sonra listeye dön
                setTimeout(() => {
                    navigate("/program-category"); // Liste sayfasının rotası
                }, 1500);
            } else {
                setMessage({
                    type: "error",
                    text: response?.data?.message || "Kayıt oluşturulamadı.",
                });
            }
        } catch (error) {
            console.error("Kayıt hatası:", error);
            const errorMsg =
                error.response?.data?.message || "Sunucuyla iletişim hatası.";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-semibold text-white tracking-wide">
                        Yeni Kategori Oluştur
                    </h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
                    >
                        &larr; Listeye Dön
                    </button>
                </div>

                {/* Mesaj Alanı (Success/Error) */}
                {message.text && (
                    <div
                        className={`mb-6 p-4 rounded-xl font-medium border ${
                            message.type === "error"
                                ? "bg-red-900/30 text-red-400 border-red-800"
                                : "bg-green-900/30 text-green-400 border-green-800"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Form Kartı */}
                <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Satır: Name & Slug */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Kategori Adı */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">
                                    Kategori Adı{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Örn: General English"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                />
                            </div>

                            {/* Slug Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">
                                    Slug (URL Yolu)
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="Otomatik oluşturulur (Boş bırakılabilir)"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                />
                                <p className="text-xs text-gray-500">
                                    Boş bırakırsanız isme göre otomatik
                                    üretilir.
                                </p>
                            </div>
                        </div>

                        {/* 2. Satır: Status */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">
                                Durum
                            </label>
                            <div className="relative">
                                <select
                                    name="is_active"
                                    value={formData.is_active}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                                >
                                    <option value={1}>Aktif</option>
                                    <option value={0}>Pasif</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                                    <svg
                                        className="w-4 h-4 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Butonlar */}
                        <div className="pt-6 flex items-center gap-4 border-t border-gray-700 mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95 ${
                                    loading
                                        ? "bg-indigo-800 cursor-not-allowed opacity-70"
                                        : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/20"
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
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
                                        Kaydediliyor...
                                    </span>
                                ) : (
                                    "Oluştur"
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3.5 rounded-xl font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 hover:text-white transition"
                            >
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProgramCategorySave;
