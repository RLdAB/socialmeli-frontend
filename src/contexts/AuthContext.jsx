import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authLogin } from "../services/auth"; // <- novo import

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("authUser");
    if (rawUser) setAuthUser(JSON.parse(rawUser));
  }, []);

  async function login({ name, password }) {
    const data = await authLogin(name, password); // <- chamada o service
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