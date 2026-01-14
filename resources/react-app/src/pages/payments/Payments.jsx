import React, { useEffect, useState } from "react";
import generalServiceFonk from "../../services/generalService";
import spinner from "../../assets/instructor/spinner.png"
function Payments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await generalServiceFonk.getPayments();
                if (response?.data?.status && response?.data?.data?.data) {
                    setPayments(response.data.data.data);
                }
            } catch (error) {
                console.error("Ödemeler yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    // --- Durum Çeviri ve Renklendirme ---
    const getStatusDetails = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'paid':
            case 'success':
                return { label: 'Tamamlandı', class: 'bg-green-500/20 text-green-400 border-green-500/30' };
            case 'pending':
                return { label: 'Bekliyor', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
            case 'failed':
            case 'error':
                return { label: 'Hata', class: 'bg-red-500/20 text-red-400 border-red-500/30' };
            default:
                return { label: status || 'Bilinmiyor', class: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
        }
    };

    // --- Filtreleme Mantığı ---
    const filteredPayments = payments.filter(payment => {
        // Kullanıcı verisi null gelme ihtimaline karşı opsiyonel zincirleme (?.) ekledik
        const firstName = payment.user?.first_name || "";
        const lastName = payment.user?.last_name || "";
        const fullName = `${firstName} ${lastName}`.toLowerCase();

        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            (payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
        return matchesSearch && matchesStatus;
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
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Ödeme Yönetimi</h1>
                    <p className="text-gray-400 mt-2 font-medium">Finansal işlemlerin güncel takibini buradan yapabilirsiniz.</p>
                </div>

                {/* Filtreleme ve Arama Paneli */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Öğrenci adı veya İşlem ID ile ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/80 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
                            />
                            <svg className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full md:w-48 bg-gray-900/80 border border-gray-600 text-white px-6 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer transition-all"
                            >
                                <option value="all">Tüm Durumlar</option>
                                <option value="completed">Tamamlandı</option>
                                <option value="pending">Bekliyor</option>
                                <option value="failed">Hata</option>
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ödeme Tablosu */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-900/70 text-gray-400 text-xs uppercase tracking-widest">
                                    <th className="px-6 py-5 font-bold">Öğrenci / Kullanıcı</th>
                                    <th className="px-6 py-5 font-bold">İşlem Detayı</th>
                                    <th className="px-6 py-5 font-bold text-center">Tutar</th>
                                    <th className="px-6 py-5 font-bold text-center">Durum</th>
                                    <th className="px-6 py-5 font-bold text-right">İşlem Tarihi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((payment) => {
                                        const status = getStatusDetails(payment.status);
                                        return (
                                            <tr key={payment.id} className="hover:bg-indigo-500/5 transition-all duration-200 group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg group-hover:scale-110 transition-transform">
                                                            {(payment.user?.first_name?.[0] || '?')}{(payment.user?.last_name?.[0] || '')}
                                                        </div>
                                                        <div>
                                                            <div className="text-white font-semibold text-base group-hover:text-indigo-400 transition-colors">
                                                                {payment.user?.first_name} {payment.user?.last_name}
                                                            </div>
                                                            <div className="text-gray-500 text-xs font-medium">{payment.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <code className="text-[11px] bg-gray-900 px-2 py-1 rounded-md text-gray-400 border border-gray-700 w-fit font-mono">
                                                            ID: {payment.transaction_id || payment.id}
                                                        </code>
                                                        <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">İşlem Kayıt No</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="font-black text-white text-lg tracking-tight">
                                                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: payment.currency || 'TRY' }).format(payment.amount)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-black border uppercase tracking-widest ${status.class}`}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse"></span>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="text-gray-300 text-sm font-medium">
                                                        {new Date(payment.created_at).toLocaleDateString('tr-TR', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-gray-500 text-xs mt-1 font-mono">
                                                        {new Date(payment.created_at).toLocaleTimeString('tr-TR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                <p className="text-gray-500 text-lg font-medium italic">Kayıtlı ödeme verisi bulunamadı.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payments;