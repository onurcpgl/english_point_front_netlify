import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => { },
    setToken: () => { },
});

export const ContextProvider = ({ children }) => {

    const [user, _setUser] = useState(
        JSON.parse(localStorage.getItem("USER")) || null // Kullanıcı yoksa null olarak başlat
    );

    // Token'ı localStorage'dan okuyalım ki sayfa yenilenince çıkış yapılmasın
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));


    // 2. KULLANICI BİLGİLERİNİ AYARLAMA FONKSİYONU GÜNCELLENDİ
    // Veriyi state'e yazar ve localStorage'a kaydeder (veya siler)
    const setUser = (user) => {
        _setUser(user);
        if (user) {
            // Objeyi string'e çevirip kaydet
            localStorage.setItem("USER", JSON.stringify(user));
        } else {
            // Çıkış yaparken sil
            localStorage.removeItem("USER");
        }
    };

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    return (
        <StateContext.Provider value={{ user, token, setUser, setToken }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);