import React, { useEffect, useState, useRef } from "react";
import generalServiceFonk from "../../services/generalService"; // generalServiceFonk'un doğru yolu

// --- SKELETON ROW COMPONENT ---
// Mobil için col-span düzeni korundu, tablo yapısı kaydırılabilir olacak
const SkeletonRow = () => (
    <div className="grid grid-cols-6 md:grid-cols-12 items-center text-sm border-b border-gray-700 animate-pulse min-w-[700px] md:min-w-full">
        {/* Kafe Adı / Görsel (col-span-4/3) */}
        <div className="col-span-4 md:col-span-4 flex items-center p-3">
            <div className="w-10 h-10 bg-gray-700 rounded-lg mr-3"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>

        {/* Konum (col-span-2) */}
        <div className="hidden md:block md:col-span-2 px-4 py-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>

        {/* Durum (col-span-1) */}
        <div className="col-span-1 md:col-span-1 text-center px-4 py-3">
            <div className="h-4 bg-gray-700 rounded-full w-full"></div>
        </div>

        {/* Adres (col-span-3) */}
        <div className="hidden md:block md:col-span-3 text-right px-4 py-3">
            <div className="h-4 bg-gray-700 rounded w-4/5 ml-auto"></div>
        </div>

        {/* Aksiyon (col-span-2) */}
        <div className="col-span-1 md:col-span-2 flex justify-end px-4 py-3">
            <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
        </div>
    </div>
);

// Durum değerini Türkçe'ye çevirir (Aynı kalır)
const translateStatus = (status) => {
    switch (status) {
        case 'active':
            return 'Aktif';
        case 'inactive':
            return 'Pasif';
        default:
            return '';
    }
};

function Cafes() {
    const [cafes, setCafes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCafe, setEditingCafe] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [addingCafe, setAddingCafe] = useState(false);

    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    const [newCafeData, setNewCafeData] = useState({
        name: "", location: "", address: "", phone: "", status: "active", image: "", imageFile: null,
    });

    const [formData, setFormData] = useState({
        name: "", location: "", address: "", phone: "", status: "active", image: "", imageFile: null,
    });

    // --- HANDLER FONKSİYONLARI (Aynı kalır) ---
    // ... (handleMenuToggle, useEffect[handleClickOutside], handleNewCafeChange, handleNewCafeFileChange, handleChange, handleFileChange) ...

    const handleMenuToggle = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);


    const handleNewCafeChange = (e) => {
        const { name, value } = e.target;
        setNewCafeData(prev => ({ ...prev, [name]: value }));
    };

    const handleNewCafeFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewCafeData(prev => ({
                ...prev,
                image: URL.createObjectURL(e.target.files[0]),
                imageFile: e.target.files[0],
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                image: URL.createObjectURL(e.target.files[0]),
                imageFile: e.target.files[0],
            }));
        }
    };


    const handleAddCafe = async () => {
        try {
            const payload = new FormData();
            payload.append("name", newCafeData.name);
            payload.append("location", newCafeData.location);
            payload.append("address", newCafeData.address);
            payload.append("phone", newCafeData.phone);
            payload.append("status", newCafeData.status);
            if (newCafeData.imageFile) payload.append("image", newCafeData.imageFile);

            const response = await generalServiceFonk.postAdminCafeCreate(payload);

            if (response?.data) {
                setCafes(prev => [...prev, response.data]);
                setAddingCafe(false);
                setNewCafeData({
                    name: "", location: "", address: "", phone: "", status: "active", image: "", imageFile: null,
                });
            }
        } catch (error) {
            console.error("Error adding cafe:", error);
        }
    };

    const handleSave = async () => {
        if (!editingCafe) return;

        try {
            const payload = new FormData();

            // READ-ONLY alanlar (düzenleme modalında değiştirilemez)
            payload.append("name", editingCafe.name);
            payload.append("location", editingCafe.location);
            payload.append("address", editingCafe.address);
            payload.append("phone", editingCafe.phone);

            // DÜZENLENEBİLİR alanlar (formData'dan alınır)
            payload.append("status", formData.status);

            if (formData.imageFile) {
                payload.append("image", formData.imageFile);
            } else if (editingCafe.image && !formData.image.startsWith("blob:")) {
                // Eğer yeni dosya yüklenmediyse ve görsel silinmediyse, mevcut görsel yolunu koru
                payload.append("image", editingCafe.image);
            }


            const response = await generalServiceFonk.postAdminCafeUpdate(editingCafe.id, payload);

            if (response?.data) {
                setCafes(prev =>
                    prev.map(c =>
                        c.id === editingCafe.id
                            ? { ...c, ...response.data }
                            : c
                    )
                );
            } else {
                // API'den tam veri dönmezse, client side güncellemeyi yap
                setCafes(prev =>
                    prev.map(c =>
                        c.id === editingCafe.id
                            ? { ...c, ...formData, name: editingCafe.name, location: editingCafe.location, address: editingCafe.address, phone: editingCafe.phone }
                            : c
                    )
                );
            }

            setEditingCafe(null); // Modalı kapat
            setFormData({ // Formu sıfırla
                name: "", location: "", address: "", phone: "", status: "active", image: "", imageFile: null,
            });
        } catch (error) {
            console.error("Error updating cafe:", error);
        }
    };

    // Düzenleme modunu açma (Satır veya Menüden çağrılacak)
    const handleEdit = (selectedCafe) => {
        const currentCafe = cafes.find(c => c.id === selectedCafe.id);
        const cafeToEdit = currentCafe || selectedCafe;

        setEditingCafe(cafeToEdit);
        setAddingCafe(false); // Ekleme modundan çık
        setOpenMenuId(null); // Menüyü kapat

        setFormData({
            name: cafeToEdit.name || "",
            location: cafeToEdit.location || "",
            address: cafeToEdit.address || "",
            phone: cafeToEdit.phone || "",
            status: cafeToEdit.status || "active", // Veritabanındaki güncel durumu çeker
            image: cafeToEdit.image || "",
            imageFile: null,
        });
    };

    // Tablo satırına tıklama işlevi
    const handleRowClick = (cafe) => {
        handleEdit(cafe); // Tıklanan kafenin verisini yükle ve modalı aç
    };

    // --- USE EFFECT (VERİ ÇEKME) ---
    useEffect(() => {
        const fetchCafes = async () => {
            try {
                const response = await generalServiceFonk.getAdminCafesInfo();

                if (response?.data && Array.isArray(response.data)) {
                    setCafes(response.data);
                }
            } catch (error) {
                console.error("Error fetching cafes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCafes();
    }, []);


    // --- FİLTRELEME VE ARAMA ---
    const filteredCafes = Array.isArray(cafes)
        ? cafes.filter(cafe => {
            const matchesSearch = cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cafe.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === "all" || cafe.status === filterStatus;
            return matchesSearch && matchesFilter;
        })
        : [];

    // Hangi veriyi kullanacağımızı belirle (Ekleme mi Düzenleme mi)
    const currentModalData = editingCafe ? formData : newCafeData;

    // --- RENDER ---

    return (
        <div className="h-auto bg-gray-900 text-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <h1 className="text-2xl font-semibold text-white">Kafe Yönetim Paneli</h1>
                    <button
                        onClick={() => setAddingCafe(true)}
                        className="px-6 py-2 bg-[#FFD207] text-black rounded-lg font-semibold hover:bg-yellow-400 transition shadow-md"
                    >
                        + Yeni Kafe Ekle
                    </button>
                </div>

                {/* Arama/Filtreleme Kutusu */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Ara</label>
                            <input
                                type="text"
                                placeholder="Kafe adı veya lokasyon..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-900 text-white transition focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="w-full md:w-auto">
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Durum Filtresi</label>
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full md:w-auto px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-700 text-gray-300 transition appearance-none cursor-pointer"
                                >
                                    <option value="all">Tümü</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cafe Listesi (Tablo stili) */}
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-x-auto">
                    <div className="min-w-[700px]"> {/* Mobil cihazlarda kaydırma için minimum genişlik */}

                        {/* Başlıklar */}
                        <div className="grid grid-cols-12 text-sm font-semibold text-gray-400 border-b border-gray-700 py-3 px-4 uppercase">
                            <div className="col-span-4 pl-8">Kafe Adı</div>
                            <div className="col-span-2">Konum</div>
                            <div className="col-span-1 text-center">Durum</div>
                            <div className="col-span-3 text-right">Adres</div>
                            <div className="col-span-2 text-right pr-4">Aksiyon</div>
                        </div>

                        {/* YÜKLEME KONTROLÜ */}
                        {loading ? (
                            <>
                                {/* Mobil: col-span-12 yapısı içindeki min-w'den faydalanır */}
                                {[...Array(5)].map((_, i) => (<SkeletonRow key={i} />))}
                            </>
                        ) : (
                            // Gerçek Veri
                            filteredCafes.length > 0 ? (
                                filteredCafes.map(cafe => (
                                    <div
                                        key={cafe.id}
                                        onClick={() => handleRowClick(cafe)}
                                        className="grid grid-cols-12 items-center text-sm border-b border-gray-700 hover:bg-gray-700 transition cursor-pointer"
                                    >
                                        {/* Kafe Adı ve Görsel */}
                                        <div className="col-span-4 flex items-center p-3">
                                            <img
                                                src={cafe.image || "https://via.placeholder.com/50x50?text=K"}
                                                alt={cafe.name}
                                                className="w-10 h-10 object-cover rounded-lg mr-3 border border-gray-600"
                                            />
                                            <span className="text-white font-medium truncate">{cafe.name}</span>
                                        </div>

                                        {/* Konum */}
                                        <div className="col-span-2 text-gray-400 truncate hidden md:block">{cafe.location}</div>
                                        <div className="col-span-2 text-gray-400 truncate md:hidden">{cafe.location}</div> {/* Mobil için ayrı */}


                                        {/* Durum (Status) */}
                                        <div className="col-span-1 text-center">
                                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${cafe.status === "active" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                                                {translateStatus(cafe.status)}
                                            </span>
                                        </div>

                                        {/* Adres */}
                                        <div className="col-span-3 text-right text-gray-400 truncate hidden md:block">{cafe.address}</div>
                                        <div className="col-span-3 text-right text-gray-400 truncate md:hidden">{cafe.phone || '-'}</div> {/* Mobil için telefon/adresin birini göster */}


                                        {/* Aksiyon Butonu */}
                                        <div className="col-span-2 flex justify-end p-3 relative" ref={openMenuId === cafe.id ? menuRef : null}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMenuToggle(cafe.id);
                                                }}
                                                className="p-1.5 rounded-full text-gray-400 hover:text-blue-500 hover:bg-gray-700 transition"
                                                title="Aksiyonlar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </button>

                                            {openMenuId === cafe.id && (
                                                <div
                                                    className="absolute right-8 top-8 z-10 w-32 p-1 rounded-lg bg-gray-950 shadow-xl border border-gray-700 overflow-hidden"
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(cafe);
                                                        }}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition"
                                                    >
                                                        Düzenle
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* Veri Yok Mesajı */
                                <div className="text-center py-8 text-gray-400 min-w-full">
                                    Arama kriterlerinize uygun kafe bulunmuyor.
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Modallar (Ekleme ve Düzenleme) */}
                {(addingCafe || editingCafe) && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[100000] p-4 backdrop-blur-sm">
                        {/* 🚨 MODAL İÇİ RESPONSIVE DÜZEN */}
                        <div className={`bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#FFD207]`}>
                            <div className="sticky top-0 bg-gray-900 p-6 rounded-t-2xl border-b border-gray-700">
                                <h3 className="text-2xl font-bold text-white">{editingCafe ? 'Kafe Düzenle' : 'Yeni Kafe Ekle'}</h3>
                                <p className="text-gray-400 mt-1">Gerekli bilgileri girin ve kaydedin.</p>
                            </div>

                            <div className="p-6">
                                {/* FORM START */}
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {/* 1. Kafe Adı (Mobile/Desktop: Yanyana) */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Kafe Adı</label>
                                            <input
                                                type="text" name="name"
                                                value={currentModalData.name}
                                                onChange={editingCafe ? handleChange : handleNewCafeChange}
                                                readOnly={!!editingCafe} // !!editingCafe -> true/false
                                                className={`w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white transition ${editingCafe ? 'opacity-50 cursor-not-allowed' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
                                                required
                                            />
                                        </div>

                                        {/* 2. Lokasyon (Mobile/Desktop: Yanyana) */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Lokasyon</label>
                                            <input
                                                type="text" name="location"
                                                value={currentModalData.location}
                                                onChange={editingCafe ? handleChange : handleNewCafeChange}
                                                readOnly={!!editingCafe}
                                                className={`w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white transition ${editingCafe ? 'opacity-50 cursor-not-allowed' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
                                                required
                                            />
                                        </div>

                                        {/* 3. Adres (Mobile/Desktop: Tam satır) */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Adres</label>
                                            <input
                                                type="text" name="address"
                                                value={currentModalData.address}
                                                onChange={editingCafe ? handleChange : handleNewCafeChange}
                                                readOnly={!!editingCafe}
                                                className={`w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white transition ${editingCafe ? 'opacity-50 cursor-not-allowed' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
                                                required
                                            />
                                        </div>

                                        {/* 4. Telefon (Mobile/Desktop: Yanyana) */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Telefon</label>
                                            <input
                                                type="text" name="phone"
                                                value={currentModalData.phone}
                                                onChange={editingCafe ? handleChange : handleNewCafeChange}
                                                readOnly={!!editingCafe}
                                                className={`w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white transition ${editingCafe ? 'opacity-50 cursor-not-allowed' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
                                            />
                                        </div>

                                        {/* 5. Durum (Status) (Mobile/Desktop: Yanyana) */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Durum</label>
                                            <select
                                                name="status"
                                                value={currentModalData.status}
                                                onChange={editingCafe ? handleChange : handleNewCafeChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white transition appearance-none cursor-pointer"
                                            >
                                                <option value="active">Aktif</option>
                                                <option value="inactive">Pasif</option>
                                            </select>
                                        </div>

                                        {/* 6. Görsel Yükleme (Mobile/Desktop: Tam satır) */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">Görsel</label>
                                            {currentModalData.image && (
                                                <div className="mb-3">
                                                    <img
                                                        src={currentModalData.image}
                                                        alt="Preview"
                                                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-700"
                                                    />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={editingCafe ? handleFileChange : handleNewCafeFileChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                                            />
                                            {currentModalData.imageFile && <p className="text-sm text-green-400 mt-1">Yeni dosya seçildi: {currentModalData.imageFile.name}</p>}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row gap-3"> {/* Butonlar mobil/desktop uyumlu */}
                                        <button
                                            type="submit"
                                            onClick={editingCafe ? handleSave : handleAddCafe}
                                            className={`flex-1 w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition shadow-lg ${editingCafe
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-[#FFD207] text-black hover:bg-yellow-400'
                                                }`}
                                        >
                                            Kaydet
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAddingCafe(false);
                                                setEditingCafe(null);
                                                setFormData({ name: "", location: "", address: "", phone: "", status: "active", image: "", imageFile: null });
                                                setNewCafeData({ name: "", location: "", address: "", phone: "", status: "active", image: "", imageFile: null });
                                            }}
                                            className="flex-1 w-full sm:w-auto px-6 py-3 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition"
                                        >
                                            İptal
                                        </button>
                                    </div>
                                </form>
                                {/* FORM END */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cafes;