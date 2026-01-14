import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import generalServiceFonk from "../../services/generalService";
import spinner from "../../assets/instructor/spinner.png"
function InstructorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");

    // Pop-up (Modal) Kontrolü
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [targetStatus, setTargetStatus] = useState("");

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await generalServiceFonk.getAdminInstructorDetail(id);
                setInstructor(response.data.data || response.data);
            } catch (error) {
                console.error("Detay getirme hatası:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    // Pop-up'ı Açan Fonksiyon
    const openConfirmModal = (status) => {
        setTargetStatus(status);
        setShowConfirmModal(true);
    };

    // Onay Verildiğinde Çalışan Fonksiyon
    const handleConfirmUpdate = async () => {
        setShowConfirmModal(false);
        setIsUpdating(true);
        try {
            await generalServiceFonk.postAdminProfile({
                id: instructor.id,
                status: targetStatus,
            });
            setInstructor({ ...instructor, status: targetStatus });

            console.log(`${targetStatus} durumu için mail gönderim tetiklendi...`);

            setUpdateMessage("Durum güncellendi ve bildirim hazırlandı!");
            setTimeout(() => setUpdateMessage(""), 3000);
        } catch (error) {
            setUpdateMessage("Hata oluştu!");
            setTimeout(() => setUpdateMessage(""), 3000);
        } finally {
            setIsUpdating(false);
        }
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

                {showConfirmModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl transform animate-in fade-in zoom-in duration-200">
                            <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Emin misiniz?</h3>
                            <p className="text-gray-400 text-center text-sm mb-8">
                                Eğitmen durumunu <b>{targetStatus === 'active' ? 'Aktif' : 'Pasif'}</b> olarak değiştirmek üzeresiniz. Bu işlemden sonra ilgili kişiye bilgilendirme maili gönderilecektir.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 py-3 rounded-xl bg-gray-700 text-white font-bold hover:bg-gray-600 transition"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleConfirmUpdate}
                                    className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
                                >
                                    Evet, Değiştir
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Başarı Mesajı */}
                {updateMessage && (
                    <div className="fixed top-5 right-5 z-[100] px-6 py-3 bg-green-600 text-white rounded-xl shadow-2xl font-bold border border-green-400 animate-in slide-in-from-right">
                        {updateMessage}
                    </div>
                )}

                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
                        ← Geri Dön
                    </button>
                    {isUpdating && <div className="text-xs text-indigo-400 animate-pulse font-black uppercase">İşlem Yapılıyor...</div>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sol Sütun */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-xl text-center">
                            <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white">
                                {instructor.first_name[0]}{instructor.last_name[0]}
                            </div>
                            <h1 className="text-2xl font-bold text-white">{instructor.first_name} {instructor.last_name}</h1>

                            {/* DURUM BUTONU (Select yerine Buton + Pop-up) */}
                            <div className="mt-8">
                                {instructor.status === 'active' ? (
                                    <button
                                        onClick={() => openConfirmModal('inactive')}
                                        disabled={isUpdating}
                                        className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider"
                                    >
                                        Pasife Al
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => openConfirmModal('active')}
                                        disabled={isUpdating}
                                        className="w-full py-3 bg-green-500/10 border border-green-500/30 text-green-500 rounded-xl font-bold text-sm hover:bg-green-500 hover:text-white transition-all uppercase tracking-wider"
                                    >
                                        Aktif Et
                                    </button>
                                )}
                                <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold">Şu anki Durum: {instructor.status}</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-700 space-y-4 text-left text-sm">
                                <div><p className="text-gray-500 text-[10px] uppercase font-bold">E-posta</p><p className="text-white truncate">{instructor.email}</p></div>
                                <div><p className="text-gray-500 text-[10px] uppercase font-bold">Telefon</p><p className="text-white">{instructor.phone || 'N/A'}</p></div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-4">Eğitim</h3>
                            {instructor.educations?.map((edu, i) => (
                                <div key={i} className="mb-4 last:mb-0 pb-4 border-b last:border-0 border-gray-700">
                                    <p className="text-indigo-400 font-bold text-sm">{edu.degree}</p>
                                    <p className="text-gray-300 text-xs">{edu.university}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sağ Sütun */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6">Sertifikalar ({instructor.certificates?.length || 0})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {instructor.certificates?.map((cert, i) => (
                                    <div key={i} className="bg-gray-900/50 border border-gray-700 p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500 transition-all">
                                        <div>
                                            <h4 className="text-white font-bold">{cert.certification}</h4>
                                            <p className="text-gray-400 text-xs mt-1">{cert.issuer}</p>
                                        </div>
                                        {cert.certificate_file_url && (
                                            <a href={cert.certificate_file_url} target="_blank" rel="noreferrer" className="mt-4 py-2 bg-gray-800 hover:bg-indigo-600 text-white text-[10px] font-black rounded-lg text-center transition-all">
                                                GÖRÜNTÜLE
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-4">Diller</h3>
                            <div className="flex flex-wrap gap-2">
                                {instructor.languages?.map((lang, i) => (
                                    <span key={i} className="px-4 py-2 bg-gray-900 rounded-xl border border-gray-700 text-white text-sm font-medium">
                                        {lang.language} <span className="text-indigo-400 text-xs font-black ml-1">[{lang.level}]</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstructorDetail;