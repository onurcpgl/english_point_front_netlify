import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../sidebarcontext/SidebarContext";
import {
    LayoutGrid,
    BarChart2,
    Users,
    Calendar,
    User,
    List,
    ChevronRight,
    X,
    // Yeni eklenen ikonlar:
    GraduationCap, // Instructors için
    CalendarRange, // Sessions için
    Layers, // Categories için
    BookOpen, // Programs için
    FileQuestion, // Questions için
    CreditCard, // Payments için
    MapPin, // Google Cafe için (Alternatif: Coffee)
} from "lucide-react";

import logo from "../../src/assets/logo/logo.png";
const othersItems = [
    // { name: "Cafes", path: "/cafes", icon: <LayoutGrid size={20} /> },
    {
        name: "Instructors",
        path: "/instructor",
        icon: <GraduationCap size={20} />,
    },
    {
        name: "Course Sessions",
        path: "/course-sessions",
        icon: <CalendarRange size={20} />,
    },
    {
        name: "Users",
        path: "/users",
        icon: <Users size={20} />,
    },
    {
        name: "Programs Category",
        path: "/program-category",
        icon: <Layers size={20} />,
    },
    {
        name: "Programs",
        path: "/programs",
        icon: <BookOpen size={20} />,
    },
    {
        name: "Start Questions",
        path: "/start-questions",
        icon: <FileQuestion size={20} />,
    },
    {
        name: "Payments",
        path: "/payments",
        icon: <CreditCard size={20} />,
    },
    {
        name: "Google Cafe",
        path: "/google-cafes",
        icon: <MapPin size={20} />, // İsterseniz <Coffee /> ile değiştirebilirsiniz
    },
];

const AppSidebar = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered, setMobileOpen } =
        useSidebar();
    const location = useLocation();

    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [subMenuHeight, setSubMenuHeight] = useState({});
    const subMenuRefs = useRef({});

    const isActive = useCallback(
        (path) => location.pathname === path,
        [location.pathname]
    );

    // Mobilde sayfa değiştiğinde sidebar'ı otomatik kapat
    useEffect(() => {
        // setMobileOpen'ın varlığını kontrol et (Context'e eklediğimizden emin oluyoruz)
        if (isMobileOpen && typeof setMobileOpen === "function") {
            setMobileOpen(false);
        }
    }, [location.pathname]); // Sayfa değiştiğinde kapat

    const handleSubmenuToggle = (index) => {
        setOpenSubmenu((prev) =>
            prev && prev.index === index ? null : { index }
        );
    };

    const showFullMenu = isExpanded || isHovered || isMobileOpen;

    return (
        <>
            {/* MOBİL BACKDROP: Sadece mobilde ve sidebar açıkken görünür */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen bg-[#0f172a] border-r border-slate-800 text-slate-300
                    transition-all duration-300 ease-in-out shadow-2xl
                    
                    /* MOBİL AYARLARI (Genişliği her zaman 280px tut ama ekran dışına it) */
                    w-[280px] 
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                    
                    /* MASAÜSTÜ AYARLARI (lg: 1024px üstü) */
                    lg:translate-x-0 
                    ${showFullMenu ? "lg:w-[280px]" : "lg:w-[80px]"}
                `}
                onMouseEnter={() => !isExpanded && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* LOGO ALANI */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/50">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="English Point Logo"></img>
                    </Link>

                    {/* Mobilde Çıkan Kapatma Butonu */}
                    {isMobileOpen && (
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden p-1 text-slate-400"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* MENÜ LİSTESİ */}
                <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto py-6 scrollbar-hide">
                    <ul className="flex flex-col gap-1 px-3">
                        {othersItems.map((nav, index) => {
                            const isCurrentActive = isActive(nav.path);
                            return (
                                <li key={index} className="relative group">
                                    <Link
                                        to={nav.path}
                                        className={`
                                            flex items-center w-full p-3 rounded-xl transition-all duration-200
                                            ${
                                                isCurrentActive
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                            }
                                            ${
                                                !showFullMenu
                                                    ? "justify-center"
                                                    : ""
                                            }
                                        `}
                                    >
                                        <span
                                            className={
                                                !showFullMenu && isCurrentActive
                                                    ? "text-white"
                                                    : ""
                                            }
                                        >
                                            {nav.icon}
                                        </span>
                                        {showFullMenu && (
                                            <span className="ml-3 text-sm font-medium whitespace-nowrap">
                                                {nav.name}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default AppSidebar;
