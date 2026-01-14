import { Outlet } from "react-router-dom";
import AppSidebar from "../../components/appsidebar/AppSidebar";
import AppHeader from "../../components/header/AppHeader";
import { useSidebar } from "../../components/sidebarcontext/SidebarContext";

function RootLayout() {
    const { isExpanded } = useSidebar();

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar sabit duracak */}
            <AppSidebar />

            {/* İçerik Alanı */}
            <div
                className={`flex flex-col flex-1 transition-all duration-300 min-w-0
          /* MASAÜSTÜ: Sidebar açıksa 280px, kapalıysa 80px boşluk bırak */
          ${isExpanded ? "lg:ml-[280px]" : "lg:ml-[80px]"}
          /* MOBİL: Hiç boşluk bırakma (Sidebar üstte açılacak) */
          ml-0
        `}
            >
                <AppHeader />
                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default RootLayout;