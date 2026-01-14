import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import generalServiceFonk from "../../services/generalService";
import spinner from "../../assets/instructor/spinner.png";

const translateStatus = (status) => {
    return status === 'active' || status === 1 ? 'Aktif' : 'Pasif';
};

const IMAGE_BASE_URL = "https://api.englishpoint.com.tr/public/storage/";

function Users() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateMessage, setUpdateMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    const getProfileImageUrl = (user) => {
        let imagePath = user.profile_image || user.avatar;
        if (!imagePath) return "https://ui-avatars.com/api/?name=" + user.name;
        if (imagePath.startsWith('http')) return imagePath;
        return IMAGE_BASE_URL + imagePath;
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await generalServiceFonk.getUsers();
                const data = response?.data?.data || response?.data || [];
                if (Array.isArray(data)) {
                    setUsers(data.map(u => ({ ...u, status: u.status || 'active' })));
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active' || u.status === 1).length,
        inactive: users.filter(u => u.status === 'inactive' || u.status === 0).length,
    };

    const handleRowClick = (id) => {
        navigate(`/users/detail/${id}`);
    };

    const handleMenuToggle = (e, id) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;
        try {
            await generalServiceFonk.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            setUpdateMessage("Kullanıcı başarıyla silindi.");
            setTimeout(() => setUpdateMessage(""), 3000);
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setOpenMenuId(null);
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || user.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

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
                        
                            <h1 className="text-4xl font-bold text-white mb-2">Kullanıcı Yönetim Paneli</h1>
                            <p className="text-slate-400">Tüm kullanıcıları yönetin ve takip edin</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-emerald-500/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-emerald-500/30 min-w-[120px]">
                                <p className="text-emerald-400 text-xs mb-1">Aktif</p>
                                <p className="text-3xl font-bold text-emerald-400">{stats.active}</p>
                            </div>
                            <div className="bg-slate-500/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-slate-500/30 min-w-[120px]">
                                <p className="text-slate-400 text-xs mb-1">Pasif</p>
                                <p className="text-3xl font-bold text-slate-400">{stats.inactive}</p>
                            </div>
                        </div>
                    </div>

                    {updateMessage && (
                        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-6 py-4 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-emerald-300 font-medium">{updateMessage}</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="İsim veya e-posta ile ara..."
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
                                    <option value="active">Aktif Kullanıcılar</option>
                                    <option value="inactive">Pasif Kullanıcılar</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900/50 border-b border-slate-700">
                        <div className="col-span-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Kullanıcı
                        </div>
                        <div className="col-span-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            E-posta
                        </div>
                        <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Telefon
                        </div>
                        <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                            Durum
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                            İşlem
                        </div>
                    </div>

                    <div className="divide-y divide-slate-700/50">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => handleRowClick(user.id)}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-700/30 transition-all cursor-pointer group"
                                >
                                    <div className="col-span-3 flex items-center gap-3">
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={getProfileImageUrl(user)}
                                                alt={user.name}
                                                className="w-11 h-11 rounded-full object-cover border-2 border-slate-700 group-hover:border-blue-500 transition-all shadow-lg"
                                            />
                                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${user.status === 'active' || user.status === 1 ? 'bg-emerald-400' : 'bg-slate-500'
                                                }`}></div>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                                                {user.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-span-4 flex items-center min-w-0">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-slate-300 text-sm truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex items-center">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-slate-300 text-sm">{user.phone || '-'}</span>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex items-center justify-center">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${user.status === 'active' || user.status === 1
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' || user.status === 1 ? 'bg-emerald-400' : 'bg-slate-400'
                                                }`}></span>
                                            {translateStatus(user.status)}
                                        </span>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-end relative" ref={openMenuId === user.id ? menuRef : null}>
                                        <button
                                            onClick={(e) => handleMenuToggle(e, user.id)}
                                            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>

                                        {openMenuId === user.id && (
                                            <div className="absolute right-0 top-12 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleRowClick(user.id); }}
                                                    className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
                                                >
                                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Görüntüle / Düzenle
                                                </button>
                                                <div className="h-px bg-slate-700"></div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                                                    className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-all"
                                                >
                                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Kullanıcıyı Sil
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center">
                                <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-slate-400 text-lg font-medium">Kullanıcı bulunamadı</p>
                                <p className="text-slate-500 text-sm mt-2">Arama kriterlerinizi değiştirmeyi deneyin</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Users;