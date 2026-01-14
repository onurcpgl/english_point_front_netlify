import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import generalServiceFonk from "../../services/generalService";
import spinner from "../../assets/instructor/spinner.png"

const QuestionSkeletonRow = () => (
    <div className="grid grid-cols-12 items-center text-sm border-b border-gray-700 animate-pulse min-w-[900px] md:min-w-full">
        <div className="col-span-5 px-6 py-3">
            <div className="h-4 bg-gray-700 rounded w-4/5"></div>
        </div>
        <div className="col-span-2 px-4 py-3">
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
        <div className="col-span-2 px-4 py-3">
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
        <div className="col-span-2 text-center px-4 py-3">
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="col-span-1 flex justify-end px-4 py-3">
            <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
        </div>
    </div>
);

// Yardımcı Fonksiyonlar
const translateStatus = (status) => (status === 1 || status === 'active' ? 'Aktif' : 'Pasif');
const translateQuestionType = (type) => {
    switch (type) {
        case 'single': return 'Tek Seçim';
        case 'multiple': return 'Çoklu Seçim';
        default: return type;
    }
};

function StartQuestions() {
    const navigate = useNavigate();

    // --- STATE'LER ---
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateMessage, setUpdateMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [expandedQuestionId, setExpandedQuestionId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    // --- VERİ ÇEKME ---
    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await generalServiceFonk.getStartQuestions();
            const data = response?.data?.data || response?.data || [];
            if (Array.isArray(data)) {
                setQuestions(data.map(q => ({
                    ...q,
                    is_active: q.is_active !== undefined ? q.is_active : 1
                })));
            }
        } catch (error) {
            console.error("Error fetching start questions:", error);
            showFlashMessage("Hata: Veriler çekilemedi.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // Mesaj Gösterme
    const showFlashMessage = (msg) => {
        setUpdateMessage(msg);
        setTimeout(() => setUpdateMessage(""), 3000);
    };

    // --- HANDLERS ---
    const handleDelete = async (id) => {
        if (!window.confirm("Bu soruyu silmek istediğinizden emin misiniz?")) return;
        try {
            await generalServiceFonk.deleteStartQuestion(id);
            setQuestions(prev => prev.filter(q => q.id !== id));
            showFlashMessage("Soru başarıyla silindi.");
        } catch (error) {
            showFlashMessage("Hata: Soru silinemedi.");
        } finally {
            setOpenMenuId(null);
        }
    };

    const handleMenuToggle = (e, id) => {
        e.stopPropagation(); // Satır tıklamasını tetiklemesin
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // Filtreleme Mantığı
    const filteredQuestions = questions.filter(question => {
        const questionText = typeof question.question === 'object' ? question.question.tr : String(question.question || '');
        const matchesSearch = questionText.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "active" && question.is_active === 1) ||
            (filterStatus === "inactive" && question.is_active === 0);
        return matchesSearch && matchesStatus;
    });

    // Dışarı tıklayınca menüyü kapat
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
            <div className="max-w-full mx-auto">
                {/* Header Bölümü */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-6 border-b border-gray-800">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Başlangıç Soruları</h2>
                        <p className="text-gray-400 mt-1 text-sm">Sistem girişinde sorulan soruları buradan yönetebilirsiniz.</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/start-questions/create")}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Soru Ekle
                    </button>
                </div>

                {updateMessage && (
                    <div className={`mb-6 p-4 rounded-xl font-medium border ${updateMessage.startsWith('Hata') ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-emerald-900/20 border-emerald-800 text-emerald-400'}`}>
                        {updateMessage}
                    </div>
                )}

                {/* Filtreler */}
                <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-gray-700 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Soru başlığı ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                        <svg className="h-5 w-5 text-gray-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="all">Tüm Durumlar</option>
                        <option value="active">Sadece Aktifler</option>
                        <option value="inactive">Sadece Pasifler</option>
                    </select>
                </div>

                {/* Tablo */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <div className="min-w-[900px]">
                            {/* Table Head */}
                            <div className="grid grid-cols-12 bg-gray-900/50 py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700">
                                <div className="col-span-5">Soru (Türkçe)</div>
                                <div className="col-span-2">Soru Tipi</div>
                                <div className="col-span-2">Görsel</div>
                                <div className="col-span-2 text-center">Durum</div>
                                <div className="col-span-1 text-right">İşlem</div>
                            </div>

                            {/* Table Body */}
                            {filteredQuestions.length > 0 ? (
                                filteredQuestions.map((question) => (
                                    <React.Fragment key={question.id}>
                                        <div
                                            className="grid grid-cols-12 items-center py-4 px-6 border-b border-gray-700/50 hover:bg-gray-700/30 transition-all cursor-pointer group"
                                            onClick={() => navigate(`/start-questions/detail/${question.id}`)}
                                        >
                                            <div className="col-span-5 flex items-center">
                                                <div
                                                    className="p-1 mr-3 hover:bg-gray-600 rounded transition"
                                                    onClick={(e) => { e.stopPropagation(); setExpandedQuestionId(expandedQuestionId === question.id ? null : question.id); }}
                                                >
                                                    <svg className={`h-4 w-4 text-gray-500 transition-transform ${expandedQuestionId === question.id ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-white font-medium group-hover:text-indigo-400 transition truncate">
                                                    {question.question?.tr || "Başlıksız Soru"}
                                                </span>
                                            </div>
                                            <div className="col-span-2 text-gray-400 text-sm">
                                                {translateQuestionType(question.question_type)}
                                            </div>
                                            <div className="col-span-2">
                                                {question.banner ? (
                                                    <img src={question.banner} className="h-10 w-10 rounded-lg object-cover border border-gray-600 shadow-sm" alt="banner" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-500 text-[10px]">Yok</div>
                                                )}
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tighter ${question.is_active === 1 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                                    {translateStatus(question.is_active)}
                                                </span>
                                            </div>
                                            <div className="col-span-1 text-right relative">
                                                <button
                                                    onClick={(e) => handleMenuToggle(e, question.id)}
                                                    className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition"
                                                >
                                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </button>

                                                {openMenuId === question.id && (
                                                    <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 py-2 overflow-hidden">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/start-questions/detail/${question.id}`); }}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white transition"
                                                        >
                                                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                            Düzenle
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(question.id); }}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-rose-400 hover:bg-rose-600 hover:text-white transition"
                                                        >
                                                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            Sil
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Detay Seçenekleri (Accordion) */}
                                        {expandedQuestionId === question.id && (
                                            <div className="col-span-12 bg-gray-900/30 p-6 border-b border-gray-700 flex flex-col md:flex-row gap-8 animate-in slide-in-from-top duration-200">
                                                <div className="flex-1">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                                                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                                        Seçenekler (TR)
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {question.options?.tr?.map((opt, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">{opt}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                                        Seçenekler (EN)
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {question.options?.en?.map((opt, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">{opt}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-gray-800/20">
                                    <svg className="h-12 w-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-500 text-lg">Hiç soru bulunamadı.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StartQuestions;