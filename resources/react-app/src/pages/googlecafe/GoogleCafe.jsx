import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import generalServiceFonk from "../../services/generalService";
import spinner from "../../assets/instructor/spinner.png"
function GoogleCafe() {
    const navigate = useNavigate();
    const [cafes, setCafes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // --- Veri Çekme ---
    useEffect(() => {
        const fetchCafes = async () => {
            try {
                const response = await generalServiceFonk.getGoogleCafes();

                // API ÇIKTISINA GÖRE YOLLAR:
                // response.data -> Ana obje {status, message, data}
                // response.data.data -> Pagination objesi {current_page, data, ...}
                // response.data.data.data -> Asıl cafe listesi (Array)
                if (response?.data?.status && response?.data?.data?.data) {
                    setCafes(response.data.data.data);
                }
            } catch (error) {
                console.error("Cafe listesi yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCafes();
    }, []);

    // --- Yerel Filtreleme ---
    const filteredCafes = cafes.filter(cafe => {
        const name = cafe.name?.toLowerCase() || "";
        return name.includes(searchTerm.toLowerCase());
    });

    if (loading)
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center">
                    <img
                        src={spinner}
                        alt="Yükleniyor..."
                        className="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10"
                    />

                </div>


            </div>
        );


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
            <div className="container mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Google Cafe Yönetimi</h1>
                    <p className="text-gray-400 mt-2 font-medium">Sistemdeki kayıtlı tüm cafeleri buradan yönetebilirsiniz.</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700 mb-10 shadow-xl">
                    <div className="relative max-w-2xl">
                        <input
                            type="text"
                            placeholder="Mekan adı ile hızlı ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        <svg className="w-6 h-6 text-gray-500 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCafes.length > 0 ? (
                        filteredCafes.map((cafe) => (
                            <div
                                key={cafe.id}
                                onClick={() => navigate(`/google-cafes/${cafe.id}`)}
                                className="group relative bg-gray-800 rounded-3xl border border-gray-700 p-6 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>

                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                        {cafe.name}
                                    </h2>
                                    <div className="flex items-start gap-2 text-gray-400 text-sm leading-relaxed min-h-[40px]">
                                        <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                        <span className="line-clamp-2">{cafe.address || 'Adres bilgisi girilmemiş.'}</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Mekanı İncele</span>
                                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-700">
                            <p className="text-gray-500 text-lg">Aramanızla eşleşen bir cafe bulunamadı.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GoogleCafe;