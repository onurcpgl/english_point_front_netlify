import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// Axios instance'ınızın bulunduğu yolu buraya yazın veya generalService'ten çekin
import axiosInstance from "../../utils/axiosClient";
import spinner from "../../../src/assets/instructor/spinner.png";

// İstenilen API fonksiyonu (Bileşen içinde veya service dosyasında olabilir)
const getProgramCategories = async () => {
    const result = await axiosInstance.get(`program-categories`);
    return result;
};

// Durum çeviri yardımcısı
const translateStatus = (status) => {
    return status === "active" || status === 1 || status === true
        ? "Aktif"
        : "Pasif";
};

function ProgramCategory() {
    const navigate = useNavigate();

    // --- STATE TANIMLARI ---
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateMessage, setUpdateMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Dropdown menü yönetimi
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    // --- VERİ ÇEKME ---
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getProgramCategories();
            // Backend yapınıza göre data.data veya direkt data olabilir
            const data = response?.data?.data || response?.data || [];

            if (Array.isArray(data)) {
                setCategories(
                    data.map((c) => ({
                        ...c,
                        // is_active 1/0 veya true/false gelebilir, standardize ediyoruz
                        status:
                            c.is_active === 1 || c.is_active === true
                                ? "active"
                                : "inactive",
                    }))
                );
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setUpdateMessage(
                "Hata: Kategoriler listelenirken bir sorun oluştu."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // --- HANDLER FONKSİYONLARI ---

    // Detay sayfasına yönlendirme
    const handleEditNavigation = (id) => {
        navigate(`/program-category/detail/${id}`);
    };

    // Yeni ekleme sayfasına yönlendirme (Opsiyonel)
    const handleCreateNavigation = () => {
        navigate(`/program-category/create`);
    };

    // Silme işlemi
    const handleDelete = async (id) => {
        if (
            !window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")
        )
            return;

        try {
            // Silme API endpoint'i buraya gelecek
            await axiosInstance.delete(`program-categories/${id}`);

            setCategories((prev) => prev.filter((c) => c.id !== id));
            setUpdateMessage("Kategori başarıyla silindi.");
        } catch (error) {
            console.error("Error deleting category:", error);
            setUpdateMessage("Hata: Kategori silinirken bir sorun oluştu.");
        } finally {
            setOpenMenuId(null);
            setTimeout(() => setUpdateMessage(""), 3000);
        }
    };

    // Dropdown menüyü aç/kapa
    const handleMenuToggle = (e, id) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // Dışarı tıklayınca menüyü kapat
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- FİLTRELEME MANTIĞI ---
    const filteredCategories = categories.filter((category) => {
        // İsim alanı string veya obje (tr/en) gelebilir, kontrol ediyoruz
        const nameText =
            typeof category.name === "object"
                ? category.name.tr || category.name.en || ""
                : String(category.name || "");

        const slugText = String(category.slug || "");

        const matchesSearch =
            nameText.toLowerCase().includes(searchTerm.toLowerCase()) ||
            slugText.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || category.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    if (loading)
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center animate-pulse">
                    <img
                        src={spinner}
                        alt="Loading"
                        className="w-24 h-24 md:w-32 md:h-32 object-contain"
                    />
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-full mx-auto">
                {/* Üst Başlık ve Buton Alanı */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                    <h2 className="text-2xl font-semibold text-white tracking-wide">
                        Program Category Yönetimi
                    </h2>
                    <button
                        onClick={handleCreateNavigation}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-lg flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Yeni Kategori Ekle
                    </button>
                </div>

                {/* Bilgilendirme Mesajı */}
                {updateMessage && (
                    <div
                        className={`mb-4 p-3 rounded-lg font-semibold ${
                            updateMessage.startsWith("Hata")
                                ? "bg-red-900/50 text-red-400"
                                : "bg-green-900/50 text-green-400"
                        }`}
                    >
                        {updateMessage}
                    </div>
                )}

                {/* Arama ve Filtreleme */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Kategori adı veya slug ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-900 text-white focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-900 text-white focus:ring-blue-500 cursor-pointer outline-none"
                    >
                        <option value="all">Tümü</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                    </select>
                </div>

                {/* Tablo Alanı */}
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-x-auto">
                    <div className="min-w-[900px]">
                        {/* Tablo Başlıkları */}
                        <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 border-b border-gray-700 py-4 px-6 uppercase tracking-wider">
                            <div className="col-span-1"># ID</div>
                            <div className="col-span-4">Kategori Adı</div>
                            <div className="col-span-4">
                                Slug (Bağlantı Yolu)
                            </div>
                            <div className="col-span-2 text-center">Durum</div>
                            <div className="col-span-1 text-right">Aksiyon</div>
                        </div>

                        {/* Tablo Satırları */}
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => handleEditNavigation(cat.id)}
                                    className="grid grid-cols-12 items-center text-sm border-b border-gray-700/50 hover:bg-gray-700/30 transition-all cursor-pointer group"
                                >
                                    {/* ID */}
                                    <div className="col-span-1 px-6 py-4 text-gray-500">
                                        {cat.id}
                                    </div>

                                    {/* Kategori Adı */}
                                    <div className="col-span-4 px-6 py-4 text-white font-medium truncate group-hover:text-blue-400">
                                        {typeof cat.name === "object"
                                            ? cat.name.tr || cat.name.en
                                            : cat.name}
                                    </div>

                                    {/* Slug */}
                                    <div className="col-span-4 px-4 py-4 text-gray-400 truncate font-mono text-xs">
                                        {cat.slug || "-"}
                                    </div>

                                    {/* Durum */}
                                    <div className="col-span-2 text-center px-4 py-4">
                                        <span
                                            className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                                                cat.status === "active"
                                                    ? "bg-green-600/20 text-green-400 border border-green-600/30"
                                                    : "bg-red-600/20 text-red-400 border border-red-600/30"
                                            }`}
                                        >
                                            {translateStatus(cat.status)}
                                        </span>
                                    </div>

                                    {/* Aksiyon Menüsü */}
                                    <div
                                        className="col-span-1 flex justify-end px-6 py-4 relative"
                                        ref={
                                            openMenuId === cat.id
                                                ? menuRef
                                                : null
                                        }
                                    >
                                        <button
                                            onClick={(e) =>
                                                handleMenuToggle(e, cat.id)
                                            }
                                            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition"
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>

                                        {openMenuId === cat.id && (
                                            <div className="absolute right-10 top-6 z-50 w-36 rounded-xl bg-gray-950 shadow-2xl border border-gray-700 overflow-hidden animate-fadeIn">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditNavigation(
                                                            cat.id
                                                        );
                                                    }}
                                                    className="block w-full text-left px-4 py-2.5 text-xs text-gray-200 hover:bg-indigo-600 hover:text-white transition"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(cat.id);
                                                    }}
                                                    className="block w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-900 hover:text-white transition"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                Kayıtlı kategori bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProgramCategory;
