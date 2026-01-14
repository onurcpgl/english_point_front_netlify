import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AppRoute from "./Routes/AppRoute";
import "./index.css";
import { SidebarProvider } from "../components/sidebarcontext/SidebarContext";
import { ThemeProvider } from "../components/themecontext/ThemeContext";
import { ContextProvider } from "./context/ContextProvider";
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ContextProvider>
            <HelmetProvider>
                <BrowserRouter>
                    <ThemeProvider>
                        <SidebarProvider>
                            <AppRoute />
                        </SidebarProvider>
                    </ThemeProvider>
                </BrowserRouter>
            </HelmetProvider>
        </ContextProvider>
    </React.StrictMode>
);
