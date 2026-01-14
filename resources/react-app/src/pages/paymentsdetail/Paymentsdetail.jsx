import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import generalServiceFonk from "../../services/generalService";
import spinner from "../../assets/instructor/spinner.png"
function Paymentsdetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await generalServiceFonk.getPaymentDetail(id);
                if (response?.data?.status) {
                    setPayment(response.data.data);
                }
            } catch (error) {
                console.error("Ödeme detayı çekilemedi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    // --- Durum Güncelleme (Update) ---
    const handleStatusUpdate = async (newStatus) => {
        setIsUpdating(true);
        try {
            const response = await generalServiceFonk.updatePayment(id, { status: newStatus });
            if (response?.data?.status) {
                setPayment({ ...payment, status: newStatus });
                alert("Ödeme durumu başarıyla güncellendi.");
            }
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            alert("Güncelleme sırasında bir hata oluştu.");
        } finally {
            setIsUpdating(false);
        }
    };

    // --- Durum Renkleri ---
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': case 'paid': case 'success':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'failed': case 'error':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

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

    if (!payment) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div className="text-center">
                <p className="text-xl text-gray-400 mb-4">Ödeme kaydı bulunamadı.</p>
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-indigo-600 rounded-lg">Geri Dön</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Üst Başlık ve Geri Dönüş */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">İşlem Detayı</h1>
                            <p className="text-sm text-gray-500 font-mono">ID: #{payment.transaction_id || payment.id}</p>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border font-bold text-sm uppercase tracking-wider ${getStatusStyle(payment.status)}`}>
                        {payment.status}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sol Sütun: Ödeme Özeti */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                            </div>

                            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-2">Toplam Tutar</h3>
                            <div className="text-5xl font-black text-white mb-8 tracking-tighter">
                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: payment.currency || 'TRY' }).format(payment.amount)}
                            </div>

                            <div className="grid grid-cols-2 gap-8 border-t border-gray-700 pt-8">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">İşlem Tarihi</p>
                                    <p className="text-white font-medium">{new Date(payment.created_at).toLocaleString('tr-TR')}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Ödeme Yöntemi</p>
                                    <p className="text-white font-medium">{payment.payment_method || 'Kredi Kartı'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Durum Yönetimi Kartı */}
                        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl">
                            <h3 className="text-lg font-bold text-white mb-6">İşlem Durumunu Yönet</h3>
                            <div className="flex flex-wrap gap-4">
                                {['completed', 'pending', 'failed'].map((status) => (
                                    <button
                                        key={status}
                                        disabled={isUpdating || payment.status === status}
                                        onClick={() => handleStatusUpdate(status)}
                                        className={`flex-1 px-6 py-3 rounded-2xl font-bold text-sm transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                                            ${status === 'completed' ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20' :
                                                status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg shadow-yellow-900/20' :
                                                    'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20'}`}
                                    >
                                        {isUpdating && payment.status !== status ? '...' : status.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sağ Sütun: Müşteri Bilgileri */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-6">Müşteri Bilgileri</h3>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white mb-4 shadow-xl">
                                    {payment.user?.first_name?.[0]}{payment.user?.last_name?.[0]}
                                </div>
                                <h4 className="text-xl font-bold text-white">{payment.user?.first_name} {payment.user?.last_name}</h4>
                                <p className="text-gray-400 text-sm mb-6">{payment.user?.email}</p>

                                <div className="w-full space-y-4 text-left border-t border-gray-700 pt-6">
                                    <div>
                                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Kullanıcı ID</p>
                                        <p className="text-gray-200 text-sm font-mono">#{payment.user?.id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Telefon</p>
                                        <p className="text-gray-200 text-sm">{payment.user?.phone || 'Kayıtlı Değil'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Not Alanı (Opsiyonel) */}
                        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/20">
                            <h3 className="font-bold mb-2">Yönetici Notu</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed">
                                Bu işlem otomatik ödeme sistemi üzerinden gerçekleştirilmiştir. İade işlemleri için banka paneli üzerinden işlem yapınız.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Paymentsdetail;