import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import generalServiceFonk from "../../services/generalService";
import spinner from "../../../src/assets/instructor/spinner.png"

// --- SKELETON ROW COMPONENT ---
const SessionSkeletonRow = () => (
    <div className="grid grid-cols-12 items-center text-sm border-b border-slate-700/50 animate-pulse">
        <div className="col-span-3 px-6 py-4">
            <div className="h-4 bg-slate-700 rounded w-4/5 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="col-span-3 px-4 py-4">
            <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-3/4"></div>
        </div>
        <div className="col-span-2 px-4 py-4">
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-1/3"></div>
        </div>
        <div className="col-span-1 text-center px-4 py-4">
            <div className="h-6 bg-slate-700 rounded-full w-20 mx-auto"></div>
        </div>
        <div className="col-span-2 text-center px-4 py-4">
            <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="col-span-1 flex justify-end px-6 py-4">
            <div className="h-5 w-5 bg-slate-700 rounded"></div>
        </div>
    </div>
);

function Coursesessions() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Verileri Getir
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await generalServiceFonk.getCourseSessions();
                const data = response?.data?.data || response?.data || [];
                if (Array.isArray(data)) {
                    setSessions(data);
                }
            } catch (error) {
                console.error("Oturumlar yüklenirken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    // Durum istatistiklerini hesapla
    const stats = {
        total: sessions.length,
        active: sessions.filter(s => s.status === 'active').length,
        awaiting: sessions.filter(s => s.status === 'awaiting').length,
        completed: sessions.filter(s => s.status === 'completed').length,
    };

    // Arama ve Filtreleme Mantığı
    const filteredSessions = sessions.filter(session => {
        const instructorFullName = `${session.instructor?.first_name || ''} ${session.instructor?.last_name || ''}`.toLowerCase();
        const sessionTitle = session.session_title?.toLowerCase() || '';

        const matchesSearch = instructorFullName.includes(searchTerm.toLowerCase()) ||
            sessionTitle.includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "all" || session.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Durum çeviri fonksiyonu
    const translateStatus = (status) => {
        const statusMap = {
            'active': 'Aktif',
            'awaiting': 'Bekliyor',
            'completed': 'Tamamlandı',
            'cancelled': 'İptal Edildi'
        };
        return statusMap[status] || status;
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="container mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Ders Oturumları Yönetim Paneli</h1>
                            <p className="text-slate-400">Tüm ders oturumlarını yönetin ve takip edin</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-emerald-500/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-emerald-500/30 min-w-[120px]">
                                <p className="text-emerald-400 text-xs mb-1">Aktif</p>
                                <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
                            </div>
                            <div className="bg-blue-500/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-blue-500/30 min-w-[120px]">
                                <p className="text-blue-400 text-xs mb-1">Bekleyen</p>
                                <p className="text-2xl font-bold text-blue-400">{stats.awaiting}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Eğitmen adı veya ders başlığı ile ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                />
                            </div>

                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-12 pr-8 py-3 bg-slate-900/50 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer appearance-none min-w-[200px]"
                                >
                                    <option value="all">Tüm Durumlar</option>
                                    <option value="active">Aktif</option>
                                    <option value="awaiting">Bekliyor</option>
                                    <option value="completed">Tamamlandı</option>
                                    <option value="cancelled">İptal Edildi</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tablo */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
                    {/* Tablo Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900/50 border-b border-slate-700">
                        <div className="col-span-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Eğitmen & Tarih
                        </div>
                        <div className="col-span-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Başlık & Açıklama
                        </div>
                        <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Süre & Seviye
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                            Durum
                        </div>
                        <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                            Kafe & Kontenjan
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">

                        </div>
                    </div>

                    {/* Tablo Body */}
                    <div className="divide-y divide-slate-700/50">
                        {loading ? (
                            <>
                                <SessionSkeletonRow />
                                <SessionSkeletonRow />
                                <SessionSkeletonRow />
                            </>
                        ) : filteredSessions.length > 0 ? (
                            filteredSessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => navigate(`/course-sessions/${session.id}`)}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-700/30 transition-all cursor-pointer group"
                                >
                                    {/* Eğitmen & Tarih */}
                                    <div className="col-span-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
                                            {session.instructor?.first_name?.[0]}{session.instructor?.last_name?.[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                                                {session.instructor?.first_name} {session.instructor?.last_name}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-xs text-slate-400">
                                                    {session.session_date ? new Date(session.session_date).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Başlık & Açıklama */}
                                    <div className="col-span-3 flex flex-col justify-center min-w-0">
                                        <p className="text-white font-medium truncate">{session.session_title}</p>
                                        <p className="text-sm text-slate-400 truncate mt-1">{session.description || 'Açıklama yok'}</p>
                                    </div>

                                    {/* Süre & Seviye */}
                                    <div className="col-span-2 flex flex-col justify-center">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-white font-medium">{session.duration_minutes} dk</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span className="text-sm text-slate-400">{session.language_level || 'Belirtilmemiş'}</span>
                                        </div>
                                    </div>

                                    {/* Durum */}
                                    <div className="col-span-1 flex items-center justify-center">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${session.status === 'active'
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                            : session.status === 'awaiting'
                                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                                : session.status === 'completed'
                                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${session.status === 'active' ? 'bg-emerald-400' :
                                                session.status === 'awaiting' ? 'bg-blue-400' :
                                                    session.status === 'completed' ? 'bg-purple-400' : 'bg-red-400'
                                                }`}></span>
                                            {translateStatus(session.status)}
                                        </span>
                                    </div>

                                    {/* Kafe & Kontenjan */}
                                    <div className="col-span-2 flex flex-col items-center justify-center">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span className="text-white font-medium">{session.cafe?.name || 'Belirtilmemiş'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="text-sm text-slate-400">Kontenjan: {session.quota || 0}</span>
                                        </div>
                                    </div>

                                    {/* Ok İkonu */}
                                    <div className="col-span-1 flex items-center justify-end">
                                        <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center">
                                <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-slate-400 text-lg font-medium">Oturum bulunamadı</p>
                                <p className="text-slate-500 text-sm mt-2">Arama kriterlerinizi değiştirmeyi deneyin</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Coursesessions;