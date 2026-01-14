import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ EKLE
import AppRoute from "./Routes/AppRoute";

function App() {
    return (
        <BrowserRouter> {/* ✅ Tüm yönlendirmeyi Router içine al */}
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <AppRoute />
            </div>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
