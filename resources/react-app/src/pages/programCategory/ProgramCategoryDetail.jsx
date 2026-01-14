import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Edit, // Düzenle ikonu
    Plus, // Ekle ikonu
    Trash2, // Sil ikonu
    X, // Kapat ikonu
    Save, // Kaydet ikonu
} from "lucide-react";
// generalService importunu senin dosyana göre ayarla
import generalService from "../../services/generalService";
import spinner from "../../../src/assets/instructor/spinner.png";

function ProgramCategoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- STATE ---
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(!!id);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Ana Form (Program Category)
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        is_active: 1,
    });

    // --- ALT KATEGORİ (BUSINESS CATEGORY) STATE'LERİ ---
    const [subItems, setSubItems] = useState([]);
    const [subItemsLoading, setSubItemsLoading] = useState(false); // Liste yükleniyor mu?

    // Modal State'leri
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // null ise Yeni Ekle, doluysa o obje düzenleniyor
    const [modalInput, setModalInput] = useState("");
    const [modalLoading, setModalLoading] = useState(false); // Modal işlem yapıyor mu?

    // --- VERİ ÇEKME (Ana Kategori ve Alt Liste) ---
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                // 1. Ana Kategori Bilgisini Çek
                const response = await generalService.getProgramCategoryById(
                    id
                );
                const data = response?.data?.data || response?.data;

                if (data) {
                    setFormData({
                        name: data.name || "",
                        slug: data.slug || "",
                        is_active:
                            data.is_active === 1 || data.is_active === true
                                ? 1
                                : 0,
                    });

                    // 2. Eğer ID 2 ise, Business Kategorileri API'den Çek
                    if (parseInt(id) === 2) {
                        fetchBusinessCategories();
                    }
                }
            } catch (error) {
                console.error("Veri hatası:", error);
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Alt Kategorileri (Business Categories) Listeleme Fonksiyonu
    const fetchBusinessCategories = async () => {
        setSubItemsLoading(true);
        try {
            const res = await generalService.getProgramBusinessCategories();
            // Backend yapına göre res.data veya res.data.data kontrolü
            setSubItems(res?.data?.data || []);
        } catch (error) {
            console.error("Alt kategoriler çekilemedi:", error);
        } finally {
            setSubItemsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "is_active" ? parseInt(value) : value,
        }));
    };

    // --- MODAL İŞLEMLERİ ---

    // 1. Yeni Ekleme Modalını Aç
    const openAddModal = () => {
        setEditingItem(null); // Yeni kayıt modu
        setModalInput("");
        setIsModalOpen(true);
    };

    // 2. Düzenleme Modalını Aç
    const openEditModal = (item) => {
        setEditingItem(item); // Düzenleme modu, tüm objeyi al
        setModalInput(item.title); // Backend'de title demiştik
        setIsModalOpen(true);
    };

    // 3. Modalı Kapat
    const closeModal = () => {
        setIsModalOpen(false);
        setModalInput("");
        setEditingItem(null);
        setModalLoading(false);
    };

    // 4. Modal İçindeki "Kaydet" Butonu (Business Category API İşlemleri)
    const handleSaveModal = async () => {
        if (!modalInput.trim()) return;

        setModalLoading(true);
        try {
            if (editingItem) {
                // --- GÜNCELLEME (PUT) ---
                await generalService.updateProgramBusinessCategory(
                    editingItem.id,
                    {
                        title: modalInput.trim(),
                    }
                );
            } else {
                // --- YENİ EKLEME (POST) ---
                await generalService.postProgramBusinessCategory({
                    title: modalInput.trim(),
                });
            }
            // Başarılı olursa listeyi yenile ve modalı kapat
            await fetchBusinessCategories();
            closeModal();
        } catch (error) {
            console.error("Kaydetme hatası:", error);
            alert("İşlem sırasında bir hata oluştu.");
        } finally {
            setModalLoading(false);
        }
    };

    // 5. Modal İçindeki "Sil" Butonu (Business Category API Silme)
    const handleDeleteFromModal = async () => {
        if (!editingItem) return;

        if (!window.confirm("Bu maddeyi silmek istediğinize emin misiniz?"))
            return;

        setModalLoading(true);
        try {
            await generalService.deleteProgramBusinessCategory(editingItem.id);
            await fetchBusinessCategories(); // Listeyi yenile
            closeModal();
        } catch (error) {
            console.error("Silme hatası:", error);
            alert("Silme işlemi başarısız.");
        } finally {
            setModalLoading(false);
        }
    };

    // --- ANA SUBMIT (Sadece Ana Kategoriyi Günceller) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        // Not: sub_items artık ayrı yönetildiği için payload'a eklememize gerek yok,
        // ama backend yapın bozulmasın diye boş gönderebilirsin veya hiç göndermezsin.
        const payload = {
            ...formData,
        };

        try {
            let response;
            if (id) {
                response = await generalService.getProgramCategoryUpdate(
                    id,
                    payload
                );
            } else {
                response = await generalService.getProgramCategorySave(payload);
            }

            if (response?.data?.status || response?.status === 200) {
                setMessage({
                    type: "success",
                    text: "Ana kategori başarıyla güncellendi!",
                });
                // Eğer yeni ekleme ise ve ID yoksa yönlendir
                if (!id) setTimeout(() => navigate("/program-category"), 1500);
            } else {
                setMessage({ type: "error", text: "Hata oluştu." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Bir hata oluştu." });
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading)
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <img src={spinner} className="w-12" alt="Loading" />
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-4xl relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-semibold text-white">
                        {id ? "Kategoriyi Düzenle" : "Yeni Kategori"}
                    </h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-400 hover:text-white"
                    >
                        &larr; Geri Dön
                    </button>
                </div>

                {/* Mesaj */}
                {message.text && (
                    <div
                        className={`mb-6 p-4 rounded-xl border ${
                            message.type === "error"
                                ? "bg-red-900/30 border-red-800 text-red-400"
                                : "bg-green-900/30 border-green-800 text-green-400"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Standart Inputlar */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">
                                    Kategori Adı
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">
                                Durum
                            </label>
                            <select
                                name="is_active"
                                value={formData.is_active}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white outline-none"
                            >
                                <option value={1}>Aktif</option>
                                <option value={0}>Pasif</option>
                            </select>
                        </div>

                        {/* --- LİSTE ALANI (Sadece ID=2 - Business Categories) --- */}
                        {parseInt(id) === 2 && (
                            <div className="mt-8 border-t border-gray-700 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            İşletme Kategorileri
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            Bu alandaki değişiklikler anında
                                            kaydedilir.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={openAddModal}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                    >
                                        <Plus size={16} /> Yeni Ekle
                                    </button>
                                </div>

                                {/* Liste Görünümü */}
                                <div className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">
                                    {subItemsLoading ? (
                                        <div className="p-6 text-center text-gray-400">
                                            Yükleniyor...
                                        </div>
                                    ) : subItems.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500 italic">
                                            Henüz kategori eklenmemiş.
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-700">
                                            {subItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition"
                                                >
                                                    <span className="text-gray-200 font-medium ml-2">
                                                        {item.title}{" "}
                                                        {/* Backend'de 'title' demiştik */}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(item)
                                                        }
                                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition"
                                                    >
                                                        <Edit size={14} />{" "}
                                                        Düzenle
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Submit Butonları (Ana Form) */}
                        <div className="pt-6 flex items-center gap-4 border-t border-gray-700 mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-white shadow-lg transition"
                            >
                                {loading
                                    ? "İşleniyor..."
                                    : id
                                    ? "Ana Bilgileri Kaydet"
                                    : "Oluştur"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3.5 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-gray-300"
                            >
                                İptal
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- MODAL (POPUP) --- */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md p-6 transform transition-all scale-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">
                                    {editingItem
                                        ? "Kategoriyi Düzenle"
                                        : "Yeni Kategori Ekle"}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Ad
                                    </label>
                                    <input
                                        type="text"
                                        value={modalInput}
                                        onChange={(e) =>
                                            setModalInput(e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:border-indigo-500 outline-none"
                                        placeholder="Örn: Yazılım"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
                                    {/* Eğer Düzenleme modundaysak SİL butonu görünür */}
                                    {editingItem && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteFromModal}
                                            disabled={modalLoading}
                                            className="px-4 py-2.5 bg-red-900/30 text-red-400 border border-red-800 hover:bg-red-900/50 hover:text-red-300 rounded-xl font-medium transition flex items-center gap-2"
                                        >
                                            <Trash2 size={18} />{" "}
                                            {modalLoading ? "..." : "Sil"}
                                        </button>
                                    )}

                                    <div className="flex-1 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2.5 text-gray-300 hover:text-white font-medium transition"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSaveModal}
                                            disabled={modalLoading}
                                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center gap-2"
                                        >
                                            <Save size={18} />
                                            {modalLoading
                                                ? "Kaydediliyor..."
                                                : editingItem
                                                ? "Güncelle"
                                                : "Ekle"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProgramCategoryDetail;
