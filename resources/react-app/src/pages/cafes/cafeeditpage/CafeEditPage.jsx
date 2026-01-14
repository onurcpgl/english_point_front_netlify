import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import generalServiceFonk from '../../../services/generalService';

const IMAGE_BASE_URL = "https://api.englishpoint.com.tr/public/storage/";

function CafeEditPage() {
    // 1. URL'den kafe ID'sini al
    const { cafeId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        address: "",
        phone: "",
        status: "active",
        image: "", // Mevcut görsel URL'si
        imageFile: null, // Yeni yüklenen görsel dosyası
    });
    useEffect(() => {
        const fetchCafeData = async () => {
            if (!cafeId) {
                setError("Kafe ID'si bulunamadı.");
                setLoading(false);
                return;
            }
            try {
                const response = await generalServiceFonk.getCafe(cafeId);

                if (response?.data) {
                    const cafeData = response.data;

                    // Form state'ini API verisiyle doldur
                    setFormData({
                        name: cafeData.name || "",
                        location: cafeData.location || "",
                        address: cafeData.address || "",
                        phone: cafeData.phone || "",
                        status: cafeData.status || "active",
                        image: cafeData.image || "",
                        imageFile: null,
                    });
                    setError(null);
                } else {
                    setError("Kafe verisi API'den çekilemedi.");
                }
            } catch (err) {
                console.error("Kafe verisi çekilirken hata:", err);
                setError("Veri yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchCafeData();
    }, [cafeId]); // ID değiştiğinde yeniden çek

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                // Ön izleme için lokal URL oluştur
                image: URL.createObjectURL(e.target.files[0]),
                imageFile: e.target.files[0],
            }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = new FormData();

            payload.append("status", formData.status);

            if (formData.imageFile) {
                payload.append("image", formData.imageFile);
            }

            payload.append('_method', 'POST');


            const response = await generalServiceFonk.getCafe(cafeId, payload);
            if (response?.data) {
                alert("Kafe başarıyla güncellendi!");
                navigate('/cafes');
            } else {
                alert("Güncelleme başarısız.");
            }
        } catch (err) {
            console.error("Kaydetme hatası:", err);
            setError("Kaydetme sırasında bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };


    // --- 5. RENDER YÜKLEME VE HATA DURUMLARI ---

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p>Kafe verileri yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-8">
                <h1 className="text-xl text-red-500">Hata: {error}</h1>
                <p className="text-gray-400 mt-4">Lütfen rotanın ve API'nin doğru çalıştığından emin olun. ID: {cafeId}</p>
                <button
                    onClick={() => navigate('/cafes')}
                    className="mt-4 px-4 py-2 bg-gray-700 rounded text-white"
                >
                    Listeye Geri Dön
                </button>
            </div>
        );
    }

    const currentImageUrl = formData.image.includes(IMAGE_BASE_URL)
        ? formData.image
        : IMAGE_BASE_URL + formData.image;



    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-white">Kafe Düzenle: {formData.name} (ID: {cafeId})</h1>
                    <p className="text-gray-400 mt-1">Sadece Durum ve Görsel güncellenebilir.</p>
                </div>

                <form onSubmit={handleSave} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Kafe Adı</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-gray-500 cursor-not-allowed opacity-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Lokasyon</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-gray-500 cursor-not-allowed opacity-50"
                            />
                        </div>
                        <div>
                            <div>
                                <label className='block text-sm font-semibold border-gray-600'></label>
                            </div>

                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Adres</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-gray-500 cursor-not-allowed opacity-50"
                            />
                        </div>

                        {/* 4. Telefon (READ-ONLY) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Telefon</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-gray-500 cursor-not-allowed opacity-50"
                            />
                        </div>

                        {/* 5. Durum (Status) (DÜZENLENEBİLİR) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Durum</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 transition appearance-none cursor-pointer"
                            >
                                <option value="active">Aktif</option>
                                <option value="inactive">Pasif</option>
                            </select>
                        </div>

                        {/* 6. Görsel Yükleme (DÜZENLENEBİLİR) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Görsel Güncelle</label>
                            {currentImageUrl && (
                                <div className="mb-3">
                                    <img
                                        src={currentImageUrl}
                                        alt="Mevcut Görsel"
                                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-600"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                            />
                            {formData.imageFile && <p className="text-sm text-green-400 mt-1">Yeni dosya seçildi: {formData.imageFile.name}</p>}
                        </div>

                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/cafes')}
                            className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                        >
                            İptal ve Geri Dön
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CafeEditPage;