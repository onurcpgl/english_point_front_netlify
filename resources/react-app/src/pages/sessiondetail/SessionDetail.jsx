import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import generalServiceFonk from "../../services/generalService";
import { toast } from "react-hot-toast";
import spinner from "../../../src/assets/instructor/spinner.png";

function SessionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [googleCafes, setGoogleCafes] = useState([]); // Tüm kafeleri tutacak
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, [id]);

    const fetchInitialData = async () => {
        try {
            // Hem oturum detayını hem de kafe listesini paralel çekiyoruz
            const [sessionRes, cafesRes] = await Promise.all([
                generalServiceFonk.getCourseSessionDetail(id),
                generalServiceFonk.getGoogleCafes(),
            ]);

            setSession(sessionRes.data.data);

            // API yapınıza göre data.data.data veya data.data içinden diziyi alıyoruz
            const cafeList =
                cafesRes.data?.data?.data || cafesRes.data?.data || [];
            setGoogleCafes(cafeList);
        } catch (error) {
            console.error("Veri yükleme hatası:", error);
            toast.error("Bilgiler yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    // Oturumdaki google_cafe_id ile eşleşen kafeyi bul
    const selectedCafe = googleCafes.find(
        (c) => c.id === session?.google_cafe_id
    );

    const handleStatusChange = async (newStatus) => {
        setUpdating(true);
        try {
            await generalServiceFonk.updateCourseSession(id, {
                status: newStatus,
            });
            setSession((prev) => ({ ...prev, status: newStatus }));
            toast.success(`Oturum durumu "${newStatus}" yapıldı.`);
        } catch (error) {
            toast.error("Durum güncellenemedi.");
        } finally {
            setUpdating(false);
        }
    };

    const getLevelBadge = (level) => {
        const levels = {
            Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
            Elementary:
                "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            Intermediate:
                "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
        };
        return (
            levels[level] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
        );
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
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-xl transition shadow-lg"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white">
                                {session.session_title}
                            </h1>
                            <span
                                className={`inline-block mt-2 text-xs font-bold px-2 py-1 rounded border ${getLevelBadge(
                                    session.language_level
                                )}`}
                            >
                                {session.language_level}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-2xl border border-gray-700">
                        <select
                            disabled={updating}
                            value={session.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="bg-gray-700 text-sm font-bold px-4 py-2 rounded-xl outline-none"
                        >
                            <option value="active">Aktif</option>
                            <option value="awaiting">Bekliyor</option>
                            <option value="completed">Tamamlandı</option>
                            <option value="cancelled">İptal Edildi</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* SOL KOLON */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-gray-800/40 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                            <h2 className="text-xl font-bold mb-6 text-blue-400">
                                Oturum Hakkında
                            </h2>
                            <p className="text-gray-300 leading-relaxed italic border-l-4 border-blue-500 pl-6 mb-8">
                                {session.description}
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30">
                                    <p className="text-gray-500 text-xs font-bold uppercase mb-1">
                                        Tarih & Saat
                                    </p>
                                    <p>
                                        {new Date(
                                            session.session_date
                                        ).toLocaleString("tr-TR")}
                                    </p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30">
                                    <p className="text-gray-500 text-xs font-bold uppercase mb-1">
                                        Süre
                                    </p>
                                    <p>{session.duration_minutes} Dakika</p>
                                </div>
                            </div>
                        </div>

                        {/* Katılımcılar */}
                        <div className="bg-gray-800/40 rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl">
                            <div className="px-8 py-6 border-b border-gray-700/50 bg-gray-800/20 flex justify-between">
                                <h2 className="text-xl font-bold italic underline">
                                    Katılımcı Listesi
                                </h2>
                                <span className="text-blue-400 font-bold">
                                    {session.registered_count} / {session.quota}
                                </span>
                            </div>
                            <div className="p-6">
                                {session.users?.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex justify-between items-center py-3 border-b border-gray-700/30 last:border-0"
                                    >
                                        <div>
                                            <p className="font-bold text-gray-200">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                        <button className="text-red-500 text-xs font-bold hover:underline">
                                            Kaldır
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SAĞ KOLON */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* GELİŞTİRİLMİŞ MEKAN KARTI */}
                        <div className="bg-gradient-to-br from-orange-600/20 to-gray-800 rounded-3xl p-8 border border-orange-500/30 shadow-2xl backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-black text-orange-400 uppercase tracking-widest">
                                    BULUŞMA MEKANI
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {selectedCafe ? (
                                    <>
                                        <div>
                                            <div className="text-2xl font-black text-white leading-tight">
                                                {selectedCafe.name}
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 text-orange-300 text-xs font-bold">
                                                <span>{selectedCafe.city}</span>
                                                {selectedCafe.district && (
                                                    <span>
                                                        •{" "}
                                                        {selectedCafe.district}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-900/80 rounded-2xl border border-gray-700 text-sm text-gray-400 leading-relaxed italic">
                                            Bu mekan sistemde kayıtlı güvenli
                                            bir çalışma alanıdır.
                                        </div>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                selectedCafe.name
                                            )}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs font-black transition-all shadow-xl flex items-center justify-center gap-2"
                                        >
                                            YOL TARİFİ AL (GOOGLE MAPS)
                                        </a>
                                    </>
                                ) : (
                                    <div className="text-gray-500 italic text-sm">
                                        Mekan bilgisi yüklenemedi veya henüz
                                        atanmadı.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Eğitmen Kartı */}
                        <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 text-center">
                            <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                                {session.instructor?.first_name?.charAt(0)}
                            </div>
                            <h4 className="font-bold text-white">
                                {session.instructor?.first_name}{" "}
                                {session.instructor?.last_name}
                            </h4>
                            <p className="text-blue-400 text-xs uppercase font-bold mt-1">
                                Eğitmen
                            </p>
                        </div>

                        {/* Doluluk */}
                        <div className="bg-gray-800/40 rounded-3xl p-8 border border-gray-700/50">
                            <div className="flex justify-between text-xs font-black text-gray-500 mb-4 uppercase">
                                <span>Kapasite</span>
                                <span>
                                    {session.registered_count} / {session.quota}
                                </span>
                            </div>
                            <div className="w-full bg-gray-900 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-1000 ${
                                        session.is_full
                                            ? "bg-red-500"
                                            : "bg-blue-500"
                                    }`}
                                    style={{
                                        width: `${
                                            (session.registered_count /
                                                session.quota) *
                                            100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SessionDetail;
