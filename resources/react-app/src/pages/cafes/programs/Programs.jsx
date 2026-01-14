import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import generalServiceFonk from "../../../services/generalService";
import spinner from "../../../assets/instructor/spinner.png";

const translateStatus = (status) => {
    return status === "active" || status === 1 ? "Aktif" : "Pasif";
};

// Kategori veya Slug Gösterim Yardımcısı
const getCategoryDisplay = (program) => {
    // 1. Kategori yoksa ve sadece Business Slug varsa (eski kayıtlar vs.)
    if (!program.category) {
        if (program.business_slug) {
            const formattedSlug = program.business_slug
                .replace(/_/g, " ")
                .toUpperCase();
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-orange-900/60 text-orange-200 border border-orange-700/50">
                    {formattedSlug}
                </span>
            );
        }
        return <span className="text-gray-500 text-xs">-</span>;
    }

    // 2. Kategori VARSA
    return (
        <div className="flex flex-col gap-1 items-start">
            {/* Her zaman Kategori Adını Bas */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-indigo-900/60 text-indigo-200 border border-indigo-700/50">
                {program.category.name}
            </span>

            {/* EKSTRA KONTROL: Eğer Kategori ID'si 2 ise Business Slug'ı da altına bas */}
            {program.program_category_id === 2 && program.business_slug && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-orange-900/60 text-orange-200 border border-orange-700/50">
                    {program.business_slug.replace(/_/g, " ").toUpperCase()}
                </span>
            )}
        </div>
    );
};

function Programs() {
    const navigate = useNavigate();

    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateMessage, setUpdateMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    const fetchPrograms = async () => {
        setLoading(true);
        try {
            const response = await generalServiceFonk.getPrograms();
            const data = response?.data?.data || response?.data || [];

            if (Array.isArray(data)) {
                setPrograms(
                    data.map((p) => ({
                        ...p,
                        status:
                            p.is_active === 1 || p.is_active === true
                                ? "active"
                                : "inactive",
                    }))
                );
            }
        } catch (error) {
            console.error("Error fetching programs:", error);
            setUpdateMessage(
                "Hata: Programlar listelenirken bir sorun oluştu."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleEditNavigation = (id) => {
        navigate(`/programs/detail/${id}`);
    };

    const handleCreateNavigation = () => {
        navigate(`/programs/create`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bu programı silmek istediğinizden emin misiniz?"))
            return;

        try {
            await generalServiceFonk.deleteProgram(id);
            setPrograms((prev) => prev.filter((p) => p.id !== id));
            setUpdateMessage("Program başarıyla silindi.");
        } catch (error) {
            console.error("Error deleting program:", error);
            setUpdateMessage("Hata: Program silinirken bir sorun oluştu.");
        } finally {
            setOpenMenuId(null);
            setTimeout(() => setUpdateMessage(""), 3000);
        }
    };

    const handleMenuToggle = (e, id) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

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

    const filteredPrograms = programs.filter((program) => {
        const titleText =
            typeof program.title === "object"
                ? program.title.tr
                : String(program.title || "");
        const descriptionText =
            typeof program.description === "object"
                ? program.description.tr
                : String(program.description || "");

        const matchesSearch =
            titleText.toLowerCase().includes(searchTerm.toLowerCase()) ||
            descriptionText.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || program.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    if (loading)
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center animate-pulse">
                    <img
                        src={spinner}
                        alt="Logo"
                        className="w-24 h-24 md:w-32 md:h-32 object-contain"
                    />
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                    <h2 className="text-2xl font-semibold text-white tracking-wide">
                        Program Yönetim Paneli
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
                        Yeni Program Ekle
                    </button>
                </div>

                {/* Mesaj */}
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

                {/* Filtreleme */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Başlık veya açıklama ile ara..."
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

                {/* Tablo */}
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-x-auto">
                    <div className="min-w-[1000px]">
                        {" "}
                        {/* Genişliği biraz artırdım */}
                        <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 border-b border-gray-700 py-4 px-6 uppercase tracking-wider">
                            <div className="col-span-3">Başlık</div>
                            <div className="col-span-2">
                                Kategori / Alan
                            </div>{" "}
                            {/* YENİ KOLON */}
                            <div className="col-span-3">Açıklama</div>
                            <div className="col-span-1">Süre</div>
                            <div className="col-span-2 text-center">Durum</div>
                            <div className="col-span-1 text-right">Aksiyon</div>
                        </div>
                        {filteredPrograms.length > 0 ? (
                            filteredPrograms.map((program) => (
                                <div
                                    key={program.id}
                                    onClick={() =>
                                        handleEditNavigation(program.id)
                                    }
                                    className="grid grid-cols-12 items-center text-sm border-b border-gray-700/50 hover:bg-gray-700/30 transition-all cursor-pointer group"
                                >
                                    {/* Başlık */}
                                    <div className="col-span-3 px-6 py-4 text-white font-medium truncate group-hover:text-blue-400">
                                        {program.title?.tr ||
                                            program.title ||
                                            "Başlık Yok"}
                                    </div>

                                    {/* Kategori (YENİ ALAN) */}
                                    <div className="col-span-2 px-4 py-4">
                                        {getCategoryDisplay(program)}
                                    </div>

                                    {/* Açıklama */}
                                    <div className="col-span-3 px-4 py-4 text-gray-400 truncate">
                                        {program.description?.tr ||
                                            program.description ||
                                            "-"}
                                    </div>

                                    {/* Süre */}
                                    <div className="col-span-1 px-4 py-4 text-gray-300">
                                        {program.duration_minutes
                                            ? `${program.duration_minutes} dk`
                                            : "-"}
                                    </div>

                                    {/* Durum */}
                                    <div className="col-span-2 text-center px-4 py-4">
                                        <span
                                            className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                                                program.status === "active"
                                                    ? "bg-green-600/20 text-green-400 border border-green-600/30"
                                                    : "bg-red-600/20 text-red-400 border border-red-600/30"
                                            }`}
                                        >
                                            {translateStatus(program.status)}
                                        </span>
                                    </div>

                                    {/* Aksiyon Menüsü */}
                                    <div
                                        className="col-span-1 flex justify-end px-6 py-4 relative"
                                        ref={
                                            openMenuId === program.id
                                                ? menuRef
                                                : null
                                        }
                                    >
                                        <button
                                            onClick={(e) =>
                                                handleMenuToggle(e, program.id)
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

                                        {openMenuId === program.id && (
                                            <div className="absolute right-10 top-10 z-50 w-36 rounded-xl bg-gray-950 shadow-2xl border border-gray-700 overflow-hidden">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditNavigation(
                                                            program.id
                                                        );
                                                    }}
                                                    className="block w-full text-left px-4 py-2.5 text-xs text-gray-200 hover:bg-indigo-600 hover:text-white transition"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(
                                                            program.id
                                                        );
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
                                Kayıtlı program bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Programs;
