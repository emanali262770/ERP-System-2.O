import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/AxiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ ADD THIS
  const [selectedCompany, setSelectedCompany] = useState(() => {
    const saved = localStorage.getItem("selectedCompany");
    return saved ? JSON.parse(saved) : null;
  });

  // ================= TOKEN VERIFY =================
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;

      try {
        const res = await api.get("/token/check", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data.success) throw new Error("Invalid token");
      } catch (error) {
        console.warn("Token expired — logging out");
        logout();
        window.location.href = "/login";
      }
    };

    verifyToken();
  }, []);

  // ================= LOGIN =================
  const login = (userData, tokenValue) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(tokenValue);
  };

  // ================= SELECT COMPANY =================
  const selectCompany = (company) => {
    localStorage.setItem("selectedCompany", JSON.stringify(company));
    setSelectedCompany(company);
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedCompany");
    setUser(null);
    setToken("");
    setSelectedCompany(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        selectedCompany,
        login,
        logout,
        selectCompany, // ✅ exposed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
