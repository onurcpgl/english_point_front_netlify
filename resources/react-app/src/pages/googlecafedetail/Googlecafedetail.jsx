import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import generalServiceFonk from "../../services/generalService";
import spinner from "../../assets/instructor/spinner.png"
function Googlecafedetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cafe, setCafe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await generalServiceFonk.getGoogleCafeDetail(id);
                // API çıktısına göre data.data veya direkt data kontrolü
                if (response?.data?.status) {
                    setCafe(response.data.data);
                }
            } catch (error) {
                console.error("Cafe detayları yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

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

    if (!cafe) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-6">
            <div className="text-center">
                <p className="text-xl text-gray-400 mb-6">Mekan bulunamadı.</p>
                <button onClick={() => navigate(-1)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition">← Geri Dön</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Üst Navigasyon ve Geri Dönüş */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate(-1)} className="group flex items-center gap-3 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-semibold text-sm text-gray-300 group-hover:text-white">Geri Dön</span>
                    </button>
                </div>

                {/* Ana Kart Yapısı */}
                <div className="bg-gray-800 rounded-[2.5rem] border border-gray-700 shadow-2xl overflow-hidden">

                    {/* Hero Section: Mekan Resmi */}
                    <div className="relative h-80 md:h-[450px] w-full">
                        <img
                            src={cafe.image}
                            alt={cafe.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay: Resim üzerindeki karartma ve yazıların okunabilirliği için */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">{cafe.name}</h1>
                                    <p className="flex items-center gap-2 mt-4 text-gray-300 font-medium md:text-lg">
                                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {cafe.address}
                                    </p>
                                </div>

                                {/* İstatistik Kartı */}
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-center min-w-[150px]">
                                    <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-1">Toplam Oturum</p>
                                    <p className="text-4xl font-black text-indigo-400">{cafe.sessions_count || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detay Bilgileri Bölümü */}
                    <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Sol Taraf: Açıklama ve Konum */}
                        <div className="lg:col-span-2 space-y-10">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                                    Mekan Hakkında
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-lg italic">
                                    "{cafe.name} English Point öğrencileri için konforlu bir çalışma alanı sunmaktadır. Google Haritalar üzerinden doğrulanmış bu mekanımızda derslerinize odaklanabilir, eğitmenlerinizle buluşabilirsiniz."
                                </p>
                            </div>

                        </div>

                        {/* Sağ Taraf: Hızlı Aksiyonlar */}
                        <div className="lg:col-span-1">
                            <div className="bg-indigo-600 rounded-[2rem] p-8 shadow-2xl shadow-indigo-900/40 sticky top-8">
                                <h4 className="text-white font-black text-2xl mb-6 leading-tight">Navigasyonu Başlat</h4>
                                <p className="text-indigo-100 text-sm mb-8 opacity-90 leading-relaxed">
                                    Mekanın konumuna doğrudan gitmek için aşağıdaki butonu kullanarak Google Haritalar üzerinden yol tarifi alabilirsiniz.
                                </p>

                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}&query_place_id=${cafe.google_place_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-wider hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                    Haritada Aç
                                </a>

                                <div className="mt-8 pt-8 border-t border-indigo-500/50 flex items-center justify-between">
                                    <div className="text-indigo-100">
                                        <p className="text-[10px] font-bold uppercase opacity-60">Son Güncelleme</p>
                                        <p className="text-xs font-bold">{new Date(cafe.updated_at).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center border border-indigo-400">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Googlecafedetail;