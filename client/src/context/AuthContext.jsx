import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, fetchProfile } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, restore the session from localStorage + verify with the server.
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("edumentor_token");
      const savedUser = localStorage.getItem("edumentor_user");

      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        try {
          const res = await fetchProfile();
          setUser(res.data.user);
          localStorage.setItem("edumentor_user", JSON.stringify(res.data.user));
        } catch (err) {
          // Token invalid/expired — interceptor already clears storage & redirects.
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    localStorage.setItem("edumentor_token", res.data.token);
    localStorage.setItem("edumentor_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (formData) => {
    const res = await registerUser(formData);
    localStorage.setItem("edumentor_token", res.data.token);
    localStorage.setItem("edumentor_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("edumentor_token");
    localStorage.removeItem("edumentor_user");
    setUser(null);
  };

  const updateUserInSession = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("edumentor_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUserInSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
