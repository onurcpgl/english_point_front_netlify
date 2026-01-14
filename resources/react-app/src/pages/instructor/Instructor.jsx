import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import generalServiceFonk from "../../services/generalService";
import spinner from "../../../src/assets/instructor/spinner.png";

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

function Instructor() {
    const navigate = useNavigate();
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingInstructor, setEditingInstructor] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        status: "active",
    });
    const [updateMessage, setUpdateMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);
    const [addingInstructor, setAddingInstructor] = useState(false);
    const [newInstructorData, setNewInstructorData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        status: "active",
    });
    const [newCertificates, setNewCertificates] = useState([
        { certification: '', issuer: '', years_of_study: '' }
    ]);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const [certificateRes, educationRes, languageRes] = await Promise.all([
                    generalServiceFonk.getAdminInstructorCertificate(),
                    generalServiceFonk.getAdminEducationInfo(),
                    generalServiceFonk.getAdminLanguageInfo(),
                ]);

                if (certificateRes?.data?.instructors && educationRes?.data?.instructors && languageRes?.data?.data) {
                    const instructorsWithAll = certificateRes.data.instructors.map((inst) => {
                        const eduInfo = educationRes.data.instructors.find((e) => e.id === inst.id);
                        const langInfo = languageRes.data.data.find((l) => l.instructor_id === inst.id);

                        return {
                            ...inst,
                            educations: eduInfo?.educations || [],
                            certificates: inst.certificates || [],
                            languages: langInfo?.languages || [],
                        };
                    });

                    setInstructors(instructorsWithAll);
                }
            } catch (error) {
                console.error("Error fetching instructors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    const handleMenuToggle = (e, id) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const handleNewChange = (e) => {
        const { name, value } = e.target;
        setNewInstructorData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNewCertificateChange = (index, e) => {
        const { name, value } = e.target;
        const list = [...newCertificates];
        list[index][name] = value;
        setNewCertificates(list);
    };

    const handleAddCertificate = () => {
        setNewCertificates([...newCertificates, { certification: '', issuer: '', years_of_study: '' }]);
    };

    const handleRemoveCertificate = (index) => {
        const list = [...newCertificates];
        list.splice(index, 1);
        setNewCertificates(list);
    };

    const handleSave = async () => {
        if (!editingInstructor) return;

        try {
            await generalServiceFonk.postAdminProfile({
                id: editingInstructor.id,
                status: formData.status
            });

            setInstructors((prev) =>
                prev.map((inst) =>
                    inst.id === editingInstructor.id ? { ...inst, status: formData.status } : inst
                )
            );

            setEditingInstructor(null);
            setUpdateMessage("Bilgiler güncellendi!");
            setTimeout(() => setUpdateMessage(""), 3000);
        } catch (error) {
            setUpdateMessage("Güncelleme hatası!");
            setTimeout(() => setUpdateMessage(""), 3000);
        }
    };

    const handleCreate = async () => {
        try {
            const payload = {
                ...newInstructorData,
                certificates: newCertificates.filter(cert => cert.certification && cert.issuer)
            };

            const response = await generalServiceFonk.postAdminProfile(payload);

            if (response?.data) {
                setInstructors(prev => [...prev, response.data]);
                setAddingInstructor(false);
                setNewInstructorData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: "",
                    status: "active"
                });
                setNewCertificates([{ certification: '', issuer: '', years_of_study: '' }]);
                setUpdateMessage("Eğitmen başarıyla eklendi!");
                setTimeout(() => setUpdateMessage(""), 3000);
            }
        } catch (error) {
            setUpdateMessage("Ekleme hatası!");
            setTimeout(() => setUpdateMessage(""), 3000);
        }
    };

    const handleEditModalOpen = (e, inst) => {
        e.stopPropagation();
        setEditingInstructor(inst);
        setFormData({
            first_name: inst.first_name,
            last_name: inst.last_name,
            email: inst.email || "",
            phone: inst.phone || "",
            status: inst.status || "active",
        });
        setOpenMenuId(null);
    };

    const filteredInstructors = instructors.filter(inst => {
        const fullName = `${inst.first_name} ${inst.last_name}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            inst.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || inst.status === filterStatus;
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
                            <h1 className="text-4xl font-bold text-white mb-2">Eğitmen Yönetim Paneli</h1>
                            <p className="text-slate-400">Eğitmenleri yönetin ve takip edin</p>
                        </div>
                    </div>

                    {/* Alert Message */}
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

                    {/* Filters */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="İsim, soyisim veya e-posta ile ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                />
                            </div>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-slate-900/50 text-white px-6 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer"
                            >
                                <option value="all">Tüm Durumlar</option>
                                <option value="active">Aktif</option>
                                <option value="inactive">Pasif</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900/50 border-b border-slate-700">
                        <div className="col-span-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Eğitmen
                        </div>
                        <div className="col-span-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            E-posta
                        </div>
                        <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Telefon
                        </div>
                        <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Durum
                        </div>
                        <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                            Sertifikalar
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-slate-700/50">
                        {filteredInstructors.map((inst) => (
                            <div
                                key={inst.id}
                                onClick={() => navigate(`/instructors/${inst.id}`)}
                                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-700/30 transition-all cursor-pointer group"
                            >
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                        {inst.first_name[0]}{inst.last_name[0]}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                            {inst.first_name} {inst.last_name}
                                        </p>
                                    </div>
                                </div>

                                <div className="col-span-3 flex items-center">
                                    <p className="text-slate-300 text-sm">{inst.email}</p>
                                </div>

                                <div className="col-span-2 flex items-center">
                                    <p className="text-slate-300 text-sm">{inst.phone || '-'}</p>
                                </div>

                                <div className="col-span-2 flex items-center">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${inst.status === 'active'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${inst.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'
                                            }`}></span>
                                        {translateStatus(inst.status)}
                                    </span>
                                </div>

                                <div className="col-span-2 flex items-center justify-center">
                                    <div className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-lg font-semibold border border-blue-500/30">
                                        {inst.certificates?.length || 0}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredInstructors.length === 0 && (
                        <div className="py-16 text-center">
                            <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-slate-400 text-lg font-medium">Eğitmen bulunamadı</p>
                            <p className="text-slate-500 text-sm mt-2">Arama kriterlerinizi değiştirmeyi deneyin</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editingInstructor && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md animate-in">
                        <div className="border-b border-slate-700 px-6 py-4">
                            <h3 className="text-xl font-bold text-white">Durum Güncelle</h3>
                            <p className="text-slate-400 text-sm mt-1">Eğitmen durumunu güncelleyin</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                <p className="text-slate-400 text-sm mb-1">Eğitmen</p>
                                <p className="text-white font-semibold text-lg">
                                    {editingInstructor.first_name} {editingInstructor.last_name}
                                </p>
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Yeni Durum
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t border-slate-700 px-6 py-4 flex gap-3">
                            <button
                                onClick={() => setEditingInstructor(null)}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-all"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/20"
                            >
                                Güncelle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Instructor;