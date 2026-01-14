import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, FileText, Music } from "lucide-react"; // İkonlar eklendi
import generalServiceFonk from "../../services/generalService";
import spinner from "../../assets/instructor/spinner.png";

function ProgramDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- STATE ---
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Dropdown verileri
    const [categories, setCategories] = useState([]);
    const [businessCategories, setBusinessCategories] = useState([]);

    // Mevcut Dosya Yolları (Ekranda göstermek için)
    const [currentFiles, setCurrentFiles] = useState({
        voice_path: null,
        document_path: null,
    });

    // Form Verisi
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        program_category_id: "",
        business_slug: "",
        video_url: "",
        duration_minutes: "60",
        is_active: 1,
        voice_path: null, // Yeni yüklenecek dosya
        document_path: null, // Yeni yüklenecek dosya
    });

    // --- VERİ ÇEKME ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [programRes, catRes, busRes] = await Promise.all([
                    generalServiceFonk.getProgramDetail(id),
                    generalServiceFonk.getProgramCategory(),
                    generalServiceFonk.getProgramBusinessCategories(),
                ]);

                // Kategorileri Doldur
                setCategories(catRes?.data?.data || catRes?.data || []);
                setBusinessCategories(busRes?.data?.data || busRes?.data || []);

                // Mevcut Program Verisini Form'a İşle
                const data = programRes?.data; // veya programRes?.data?.data backend yapına göre
                if (data) {
                    setFormData({
                        title:
                            typeof data.title === "object"
                                ? data.title?.tr || ""
                                : data.title || "",
                        description:
                            typeof data.description === "object"
                                ? data.description?.tr || ""
                                : data.description || "",
                        program_category_id: data.program_category_id || "",
                        business_slug: data.business_slug || "",
                        video_url: data.video_url || "",
                        duration_minutes: data.duration_minutes || "",
                        is_active: data.is_active ? 1 : 0,
                        voice_path: null, // Başlangıçta yeni dosya yok
                        document_path: null, // Başlangıçta yeni dosya yok
                    });

                    // Mevcut dosyaları kaydet (Göstermek için)
                    setCurrentFiles({
                        voice_path: data.voice_path,
                        document_path: data.document_path,
                    });
                }
            } catch (error) {
                console.error("Veri yükleme hatası:", error);
                setMessage({
                    type: "error",
                    text: "Veriler yüklenirken bir hata oluştu.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // --- HANDLERS ---

    // Metin Değişiklikleri
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
            // Kategori Business değilse slug temizle
            if (name === "program_category_id") {
                if (parseInt(value) !== 2) {
                    newData.business_slug = "";
                }
            }
            return newData;
        });
    };

    // Dosya Değişiklikleri (YENİ EKLENDİ)
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files && files[0] ? files[0] : null;
        setFormData((prev) => ({
            ...prev,
            [name]: file,
        }));
    };

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            // FormData Oluşturma (Dosya yükleme olduğu için zorunlu)
            const payload = new FormData();

            // Laravel PUT isteklerinde dosya yüklemek için bu yöntem şarttır:
            // İstek POST olarak gider ama Laravel bunu PUT olarak işler.

            payload.append("title", formData.title);
            payload.append("description", formData.description || "");
            payload.append("program_category_id", formData.program_category_id);
            payload.append("is_active", formData.is_active);

            // Opsiyonel Alanlar
            if (formData.video_url)
                payload.append("video_url", formData.video_url);
            if (formData.duration_minutes)
                payload.append("duration_minutes", formData.duration_minutes);

            // Business Slug Logic
            if (
                parseInt(formData.program_category_id) === 2 &&
                formData.business_slug
            ) {
                payload.append("business_slug", formData.business_slug);
            } else {
                // Eğer null göndermek gerekiyorsa backend null kabul etmeli
                payload.append("business_slug", "");
            }

            // Dosyalar (Sadece yeni dosya seçildiyse ekle)
            if (formData.voice_path) {
                payload.append("voice_path", formData.voice_path);
            }
            if (formData.document_path) {
                payload.append("document_path", formData.document_path);
            }

            // Servis çağrısı (Burada URL'in sonuna ID eklenmeli)
            // generalServiceFonk.updateProgram fonksiyonunun axios.post veya put yaptığından emin ol.
            // Dosya olduğu için header'da 'Content-Type': 'multipart/form-data' olmalı (axios otomatik yapar).

            await generalServiceFonk.updateProgram(id, payload);

            setMessage({
                type: "success",
                text: "Program başarıyla güncellendi!",
            });

            // Başarılı kayıttan sonra mevcut dosya yollarını güncellemek için sayfayı yenileyebilir
            // veya manuel set edebilirsin ama en temizi kullanıcıya bilgi vermektir.
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            const errorMsg =
                error.response?.data?.message || "Güncelleme başarısız oldu.";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <img
                    src={spinner}
                    alt="Loading"
                    className="w-24 h-24 object-contain animate-pulse"
                />
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">
                            Programı Düzenle
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">ID: #{id}</p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition text-sm"
                    >
                        <ArrowLeft size={16} /> Geri Dön
                    </button>
                </div>

                {/* Mesaj Alanı */}
                {message.text && (
                    <div
                        className={`mb-6 p-4 rounded-xl font-medium border ${
                            message.type === "error"
                                ? "bg-red-900/20 border-red-800 text-red-400"
                                : "bg-green-900/20 border-green-800 text-green-400"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* --- KATEGORİ SEÇİM ALANI --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                            {/* Ana Kategori */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">
                                    Ana Kategori
                                </label>
                                <select
                                    name="program_category_id"
                                    value={formData.program_category_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:border-indigo-500 outline-none transition"
                                >
                                    <option value="">Seçiniz</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Business Kategori */}
                            {parseInt(formData.program_category_id) === 2 && (
                                <div className="space-y-2 animate-fadeIn">
                                    <label className="text-sm font-medium text-orange-400">
                                        İş Alanı (Business Area)
                                    </label>
                                    <select
                                        name="business_slug"
                                        value={formData.business_slug}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-orange-500/50 text-white focus:border-orange-500 outline-none transition"
                                    >
                                        <option value="">Seçiniz</option>
                                        {businessCategories.map((bus) => (
                                            <option
                                                key={bus.id}
                                                value={bus.slug}
                                            >
                                                {bus.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Başlık */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">
                                Program Başlığı
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:border-indigo-500 outline-none transition"
                            />
                        </div>

                        {/* Açıklama */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">
                                Açıklama
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:border-indigo-500 outline-none transition resize-none"
                            />
                        </div>

                        {/* --- YENİ EKLENEN DOSYA YÜKLEME ALANLARI --- */}
                        <div className="border-t border-gray-700 pt-6 mt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Medya ve Dokümanlar
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">
                                        Video URL
                                    </label>
                                    <input
                                        type="text"
                                        name="video_url"
                                        value={formData.video_url}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:border-indigo-500 outline-none transition"
                                    />
                                </div>
                                {/* SES DOSYASI */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400">
                                        Ses Dosyası (MP3, WAV)
                                    </label>

                                    {/* Mevcut Ses Dosyası Gösterimi - TIKLANABİLİR YAPILDI */}
                                    {currentFiles.voice_path && (
                                        <div className="flex items-center gap-2 mb-2 p-2 bg-gray-700/50 rounded-lg text-xs text-indigo-300 border border-indigo-500/30">
                                            <Music size={14} />
                                            <a
                                                href={currentFiles.voice_path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="truncate hover:text-indigo-100 hover:underline cursor-pointer flex-1"
                                                title="Ses dosyasını dinle/indir"
                                            >
                                                Mevcut:{" "}
                                                {currentFiles.voice_path
                                                    .split("/")
                                                    .pop()}
                                            </a>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        name="voice_path"
                                        accept=".mp3,.wav,.ogg"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer bg-gray-900 border border-gray-600 rounded-lg"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Sadece değiştirmek istiyorsanız dosya
                                        seçin.
                                    </p>
                                </div>

                                {/* DOKÜMAN DOSYASI (DÜZELTİLDİ: Tekrar Dosya Inputu Yapıldı) */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400">
                                        Doküman (PDF, DOC, DOCX)
                                    </label>

                                    {/* Mevcut Doküman Linki - Tıklanabilir (Backend URL gönderiyor) */}
                                    {currentFiles.document_path && (
                                        <div className="flex items-center gap-2 mb-2 p-2 bg-gray-700/50 rounded-lg text-xs text-green-300 border border-green-500/30">
                                            <FileText size={14} />
                                            <a
                                                href={
                                                    currentFiles.document_path
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="truncate hover:text-green-100 hover:underline cursor-pointer flex-1"
                                                title="Dokümanı Görüntüle"
                                            >
                                                Mevcut Dosyayı Görüntüle
                                            </a>
                                        </div>
                                    )}

                                    {/* Input tipi FILE yapıldı ve handleFileChange bağlandı */}
                                    <input
                                        type="file"
                                        name="document_path"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer bg-gray-900 border border-gray-600 rounded-lg"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Değiştirmek isterseniz yeni dosya seçin.
                                    </p>
                                </div>

                                {/* VIDEO URL (Bu Link Olarak Kalıyor) */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-400">
                                        Video URL
                                    </label>
                                    <input
                                        type="text"
                                        name="video_url"
                                        value={formData.video_url}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:border-indigo-500 outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Durum (Aktif/Pasif) */}
                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-gray-400">
                                Yayın Durumu
                            </label>
                            <select
                                name="is_active"
                                value={formData.is_active}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white outline-none transition ${
                                    parseInt(formData.is_active) === 1
                                        ? "text-green-400 border-green-500/30"
                                        : "text-red-400 border-red-500/30"
                                }`}
                            >
                                <option value={1}>Aktif (Yayında)</option>
                                <option value={0}>Pasif (Gizli)</option>
                            </select>
                        </div>

                        {/* Butonlar */}
                        <div className="pt-6 border-t border-gray-700 flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-white shadow-lg transition flex justify-center items-center gap-2"
                            >
                                {saving ? (
                                    "Kaydediliyor..."
                                ) : (
                                    <>
                                        <Save size={20} /> Değişiklikleri Kaydet
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProgramDetail;
