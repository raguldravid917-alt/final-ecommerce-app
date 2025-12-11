import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const s = localStorage.getItem("final_ecom_auth");
      if (s) setUser(JSON.parse(s));
    } catch {}
    setLoading(false);
  }, []);

  async function login(email, password) {
    if (!email || !password) throw new Error("Enter email & password");
    // try ReqRes login, fallback to local token on fail
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch("https://reqres.in/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        const u = { email, token: data.token || "reqres-token" };
        setUser(u);
        localStorage.setItem("final_ecom_auth", JSON.stringify(u));
        return u;
      }
    } catch (err) {
      // fallback
    }
    const fakeToken = `local-${Math.random().toString(36).slice(2, 10)}`;
    const fallbackUser = { email, token: fakeToken };
    setUser(fallbackUser);
    localStorage.setItem("final_ecom_auth", JSON.stringify(fallbackUser));
    return fallbackUser;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("final_ecom_auth");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
