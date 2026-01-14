import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider"; // Yolunu kontrol et

export default function GuestLayout() {
    const { token } = useStateContext();

    // KURAL 1: Kullanıcının zaten token'ı varsa Login sayfasını gösterme, Dashboard'a at.
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }
    console.log("token", token);

    return (
        <div className="guest-layout">
            <Outlet />
        </div>
    );
}
