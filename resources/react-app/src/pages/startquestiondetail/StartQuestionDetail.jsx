import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import generalServiceFonk from "../../services/generalService";
import spinner from "../../assets/instructor/spinner.png"
function StartQuestionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [updateMessage, setUpdateMessage] = useState("");
    const [formData, setFormData] = useState({
        question_tr: "",
        question_en: "",
        options_tr: "",
        options_en: "",
        question_type: "single",
        is_active: 1,
        banner: "",
        created_at: "",
        updated_at: ""
    });

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await generalServiceFonk.getAnswerDetailById(id);
                const data = response?.data;

                if (data) {
                    setFormData({
                        question_tr: data.question?.tr || "",
                        question_en: data.question?.en || "",
                        // API'den gelen ["Seçenek 1", "Seçenek 2"] yapısını textarea için "Seçenek 1\nSeçenek 2" yapıyoruz
                        options_tr: Array.isArray(data.options?.tr) ? data.options.tr.join('\n') : "",
                        options_en: Array.isArray(data.options?.en) ? data.options.en.join('\n') : "",
                        question_type: data.question_type || "single",
                        is_active: data.is_active !== undefined ? data.is_active : 1,
                        banner: data.banner || "",
                        created_at: data.created_at,
                        updated_at: data.updated_at
                    });
                }
            } catch (error) {
                console.error("Detay getirilemedi:", error);
                setUpdateMessage("Hata: Soru detayları yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'is_active' ? Number(value) : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Backend'in beklediği iç içe (nested) JSON yapısı
            const payload = {
                question: {
                    tr: formData.question_tr,
                    en: formData.question_en
                },
                options: {
                    // Textarea'daki her satırı dizi elemanı yap, boşlukları temizle ve boş satırları filtrele
                    tr: formData.options_tr.split('\n').map(s => s.trim()).filter(s => s !== ""),
                    en: formData.options_en.split('\n').map(s => s.trim()).filter(s => s !== "")
                },
                question_type: formData.question_type,
                is_active: formData.is_active,
                banner: formData.banner,
            };

            const result = await generalServiceFonk.updateStartQuestion(id, payload);

            if (result) {
                setUpdateMessage("Başarıyla güncellendi! Listeye yönlendiriliyorsunuz...");
                setTimeout(() => navigate("/start-questions"), 2000);
            }
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            setUpdateMessage("Hata: Güncelleme işlemi başarısız oldu.");
        }
    };

    if (loading)
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center">
                    <img
                        src={spinner}
                        alt="English Point Logo"
                        className="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10"
                    />
                </div>


            </div>
        );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto bg-gray-800 p-6 md:p-10 rounded-3xl border border-gray-700 shadow-2xl">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-700 pb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-extrabold text-white">Soru Detaylarını Düzenle</h2>
                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-mono">ID: #{id}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                            Oluşturma: {new Date(formData.created_at).toLocaleString('tr-TR')}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all text-sm font-semibold shadow-inner"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Listeye Dön
                    </button>
                </div>

                {updateMessage && (
                    <div className={`mb-8 p-4 rounded-2xl font-bold border transition-all animate-bounce ${updateMessage.includes('Hata')
                        ? 'bg-red-900/20 border-red-800 text-red-400'
                        : 'bg-green-900/20 border-green-800 text-green-400'
                        }`}>
                        {updateMessage}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-8">

                    {/* Soru Metinleri Bölümü */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                Soru Metni (Türkçe)
                            </label>
                            <textarea
                                name="question_tr"
                                value={formData.question_tr}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600"
                                placeholder="Türkçe soruyu buraya yazın..."
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Soru Metni (İngilizce)
                            </label>
                            <textarea
                                name="question_en"
                                value={formData.question_en}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-600"
                                placeholder="Write English question here..."
                                required
                            />
                        </div>
                    </div>

                    {/* Seçenekler Bölümü */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-300">Cevap Seçenekleri (TR)</label>
                            <textarea
                                name="options_tr"
                                value={formData.options_tr}
                                onChange={handleChange}
                                rows="8"
                                placeholder="Örn:&#10;Hiç bilmiyorum&#10;Anlıyorum..."
                                className="w-full p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                required
                            />
                            <p className="text-xs text-gray-500 italic">* Her satıra tek bir seçenek gelecek şekilde yazınız.</p>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-300">Cevap Seçenekleri (EN)</label>
                            <textarea
                                name="options_en"
                                value={formData.options_en}
                                onChange={handleChange}
                                rows="8"
                                placeholder="Example:&#10;I don't know&#10;I understand..."
                                className="w-full p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required
                            />
                            <p className="text-xs text-gray-500 italic">* Write one option per line.</p>
                        </div>
                    </div>

                    {/* Alt Ayarlar Kartı */}
                    <div className="bg-gray-900/60 p-8 rounded-3xl border border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Soru Tipi</label>
                            <div className="relative">
                                <select
                                    name="question_type"
                                    value={formData.question_type}
                                    onChange={handleChange}
                                    className="w-full p-3.5 rounded-xl bg-gray-800 border border-gray-600 text-white outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                                >
                                    <option value="single">Tek Seçim (Radio)</option>
                                    <option value="multiple">Çoklu Seçim (Checkbox)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Yayın Durumu</label>
                            <select
                                name="is_active"
                                value={formData.is_active}
                                onChange={handleChange}
                                className={`w-full p-3.5 rounded-xl bg-gray-800 border border-gray-600 font-bold outline-none focus:ring-2 transition-all ${formData.is_active === 1 ? 'text-green-400 focus:ring-green-500/50' : 'text-red-400 focus:ring-red-500/50'
                                    }`}
                            >
                                <option value={1}>● Aktif / Yayında</option>
                                <option value={0}>○ Pasif / Gizli</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Banner URL</label>
                            <input
                                type="url"
                                name="banner"
                                value={formData.banner}
                                onChange={handleChange}
                                placeholder="Görsel linki..."
                                className="w-full p-3.5 rounded-xl bg-gray-800 border border-gray-600 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Banner Önizleme ve Meta Bilgi */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {formData.banner && (
                            <div className="flex-1 w-full">
                                <label className="text-xs font-bold text-gray-500 mb-3 block uppercase">Banner Görsel Önizleme</label>
                                <div className="relative group overflow-hidden rounded-2xl border-2 border-gray-700">
                                    <img
                                        src={formData.banner}
                                        alt="Banner"
                                        className="w-full h-48 object-contain bg-black/20 transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Görsel+Bulunamadı"; }}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex-1 w-full p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 self-stretch flex flex-col justify-center">
                            <h4 className="text-indigo-400 font-bold mb-2">💡 İpucu</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Soru tipi <b>"Tek Seçim"</b> olarak ayarlandığında kullanıcı sadece bir cevap verebilir.
                                <b> "Çoklu Seçim"</b> seçeneğinde ise birden fazla kutucuğu işaretleyebilir.
                            </p>
                        </div>
                    </div>

                    {/* Aksiyon Butonları */}
                    <div className="flex flex-col sm:flex-row gap-5 pt-10 border-t border-gray-700">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 py-4 rounded-2xl font-black text-white transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3 active:scale-95"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            DEĞİŞİKLİKLERİ KAYDET
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/start-questions")}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 py-4 rounded-2xl font-bold text-gray-200 transition-all active:scale-95"
                        >
                            İPTAL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StartQuestionDetail;