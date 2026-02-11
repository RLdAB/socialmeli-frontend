import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const rawUser = localStorage.getItem("authUser");
        if (rawUser) setAuthUser(JSON.parse(rawUser));
    }, []);

    async function login({ name, password }) {
        const url = `${import.meta.env.VITE_API_URL}/auth/login`;
        console.log("LOGIN URL:", url);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, password }),
        });

        const text = await res.text(); // pega mesmo se nāo for json
            let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

        console.log("LOGIN STATUS:", res.status);
        console.log("LOGIN RESPONSE:", data);

        if (!res.ok) {
            throw new Error(data?.error || `Falha ao autenticar (status ${res.status})`);
        }
        setAuthUser(data.user);
        localStorage.setItem("authUser", JSON.stringify(data.user));
        return data.user;
    }

    function logout() {
        setAuthUser(null);
        localStorage.removeItem("authUser");
    }

    const value = useMemo(() => ({ authUser, login, logout }), [authUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}