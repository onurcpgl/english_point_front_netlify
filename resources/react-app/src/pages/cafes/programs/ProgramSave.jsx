import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import generalService from "../../../services/generalService";

function ProgramSave() {
    const navigate = useNavigate();

    // Seçenekler Listesi
    const subTopics = [
        { id: "english-shop", name: "General English for Shop Owners" },
        { id: "it", name: "IT" },
        { id: "law", name: "Law" },
        { id: "management", name: "Management" },
        { id: "medicine", name: "Medicine" },
        { id: "real-estate", name: "Real Estate" },
        { id: "tourism", name: "Tourism" },
    ];

    // --- STATE ---
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Form Verileri (Slug kaldırıldı)
    const [formData, setFormData] = useState({
        program_category_id: "",
        title: "",
        description: "",
        business_slug: "",
        video_url: "",
        // slug: "",  <-- ARTIK YOK
        is_active: 1,
        voice_path: null,
        document_path: null,
    });

    // --- VERİ ÇEKME ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await generalService.getProgramCategory();
                const data = response?.data?.data || response?.data || [];
                setCategories(data);
            } catch (error) {
                console.error("Kategoriler yüklenemedi:", error);
                setMessage({
                    type: "error",
                    text: "Kategori listesi yüklenirken hata oluştu.",
                });
            }
        };
        fetchCategories();
    }, []);

    // --- HANDLERS ---

    const handleTextChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: name === "is_active" ? parseInt(value) : value,
            };

            // Eğer Kategori değişiyorsa ve ID 2 değilse, business_slug'ı temizle
            if (name === "program_category_id" && value != "2") {
                newData.business_slug = "";
            }

            return newData;
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files && files[0] ? files[0] : null;

        setFormData((prev) => ({
            ...prev,
            [name]: file,
        }));
    };

    // --- SUBMIT (KAYDET) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const data = new FormData();

            // -- Zorunlu Alan Kontrolü --
            if (!formData.program_category_id) {
                setMessage({
                    type: "error",
                    text: "Lütfen bir program kategorisi seçiniz.",
                });
                setLoading(false);
                return;
            }

            // -- Verileri Ekleme --
            data.append("title", formData.title);
            data.append("description", formData.description || "");
            data.append("program_category_id", formData.program_category_id);

            // Slug GÖNDERMİYORUZ. Backend halledecek.

            // Business Slug
            const finalBusinessSlug =
                formData.program_category_id == 2 ? formData.business_slug : "";
            data.append("business_slug", finalBusinessSlug);

            data.append("video_url", formData.video_url || "");
            data.append("is_active", formData.is_active);

            // -- Dosyalar --
            if (formData.voice_path) {
                data.append("voice_path", formData.voice_path);
            }
            if (formData.document_path) {
                data.append("document_path", formData.document_path);
            }

            const response = await generalService.postProgram(data);

            if (
                response?.status === 201 ||
                response?.status === 200 ||
                response?.data?.status
            ) {
                setMessage({
                    type: "success",
                    text: "Program başarıyla oluşturuldu! Yönlendiriliyorsunuz...",
                });
                setTimeout(() => {
                    navigate("/programs");
                }, 1500);
            } else {
                setMessage({
                    type: "error",
                    text:
                        response?.data?.message ||
                        "Beklenmedik bir cevap alındı.",
                });
            }
        } catch (error) {
            console.error("Program kayıt hatası:", error);
            const errorData = error.response?.data;
            let errorMsg = "Bir hata oluştu.";

            if (errorData?.message) errorMsg = errorData.message;
            if (errorData?.errors) {
                const firstKey = Object.keys(errorData.errors)[0];
                errorMsg = errorData.errors[firstKey][0];
            }
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-5xl">
                {/* Başlık */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-semibold text-white tracking-wide">
                        Yeni Program Oluştur
                    </h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
                    >
                        &larr; Listeye Dön
                    </button>
                </div>

                {/* Mesaj */}
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

                {/* Form */}
                <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Title & Description */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">
                                    Program Başlığı{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleTextChange}
                                    placeholder="Program adı giriniz"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">
                                    Açıklama
                                </label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleTextChange}
                                    placeholder="Program açıklaması..."
                                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-700 my-4"></div>

                        {/* Genel Bilgiler (Slug Kaldırıldı) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* PROGRAM CATEGORY */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">
                                    Program Kategorisi{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="program_category_id"
                                        value={formData.program_category_id}
                                        onChange={handleTextChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">
                                            Bir Kategori Seçiniz
                                        </option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {typeof cat.name === "object"
                                                    ? cat.name.tr || cat.name.en
                                                    : cat.name}
                                            </option>
                                        ))}
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

                            {/* BUSINESS ALT KONU */}
                            {formData.program_category_id == 2 && (
                                <div className="space-y-2 animate-fadeIn">
                                    <label className="block text-sm font-medium text-gray-400">
                                        Business Alt Konusu (Sub Topic)
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="business_slug"
                                            value={formData.business_slug}
                                            onChange={handleTextChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="">
                                                Alt Konu Seçiniz
                                            </option>
                                            {subTopics.map((topic) => (
                                                <option
                                                    key={topic.id}
                                                    value={topic.id}
                                                >
                                                    {topic.name}
                                                </option>
                                            ))}
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
                            )}

                            {/* Video URL */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">
                                    Video URL
                                </label>
                                <input
                                    type="url"
                                    name="video_url"
                                    value={formData.video_url}
                                    onChange={handleTextChange}
                                    placeholder="https://youtube.com/..."
                                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                            </div>

                            {/* Durum */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">
                                    Durum
                                </label>
                                <div className="relative">
                                    <select
                                        name="is_active"
                                        value={formData.is_active}
                                        onChange={handleTextChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
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
                        </div>

                        <div className="border-t border-gray-700 my-4"></div>

                        {/* Dosya Yükleme */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">
                                    Ses Dosyası (MP3, WAV, OGG)
                                </label>
                                <input
                                    type="file"
                                    name="voice_path"
                                    accept=".mp3,.wav,.ogg"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer bg-gray-900 border border-gray-600 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">
                                    Doküman (PDF, DOC, DOCX)
                                </label>
                                <input
                                    type="file"
                                    name="document_path"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer bg-gray-900 border border-gray-600 rounded-lg"
                                />
                            </div>
                        </div>

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
                                {loading
                                    ? "Kaydediliyor..."
                                    : "Programı Oluştur"}
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

export default ProgramSave;
