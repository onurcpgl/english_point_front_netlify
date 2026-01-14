import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import generalServiceFonk from "../../services/generalService";
import spinner from "../../assets/instructor/spinner.png"
function Userdetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await generalServiceFonk.getUserDetail(id);
                const userData = response.data.user || response.data.data || response.data;
                if (userData && (userData.id || userData.name)) {
                    setUser(userData);
                } else {
                    console.error("Kullanıcı verisi beklenen formatta değil:", response.data);
                }
            } catch (error) {
                console.error("Kullanıcı detay hatası:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);
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
    if (!user) return <div className="text-white p-10">Kullanıcı bulunamadı.</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-indigo-500">Kullanıcı:</span> {user.name}
                    </h2>
                    <button onClick={() => navigate(-1)} className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">← Geri Dön</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl self-start">
                        <div className="flex flex-col items-center">
                            <img
                                src={user.profile_image || user.avatar || "https://ui-avatars.com/api/?name=" + user.name}
                                alt="avatar"
                                className="w-32 h-32 rounded-full border-4 border-indigo-600 object-cover mb-4" />
                            <h3 className="text-xl font-bold">{user.name}</h3>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                            <span className="mt-4 px-4 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-xs font-bold">Kullanıcı</span>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="border-t border-gray-700 pt-4">
                                <label className="text-gray-500 text-xs uppercase font-black">Telefon</label>
                                <p className="text-sm">{user.phone || "Belirtilmemiş"}</p>
                            </div>
                            <div className="border-t border-gray-700 pt-4">
                                <label className="text-gray-500 text-xs uppercase font-black">Kayıt Tarihi</label>
                                <p className="text-sm">{new Date(user.created_at).toLocaleDateString('tr-TR')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Katıldığı Son Oturumlar
                            </h3>
                            <div className="space-y-4">
                                {user.course_sessions && user.course_sessions.length > 0 ? (
                                    user.course_sessions.map((session, index) => (
                                        <div key={index} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-white">{session.program?.title?.tr || 'Program Bilgisi Yok'}</p>
                                                <p className="text-xs text-gray-500">{session.cafe?.name || 'Cafe Bilgisi Yok'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-mono text-indigo-400">{session.start_time}</p>
                                                <p className="text-[10px] text-gray-600">Oturum ID: #{session.id}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">Bu kullanıcı henüz bir oturuma katılmamış.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Userdetail;