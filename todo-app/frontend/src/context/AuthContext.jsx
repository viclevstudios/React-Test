import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.js";
import api from "../api/api.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {

    try {

      const response = await api.get("/auth/me");

      setUser(response.data);

    } catch {

      setUser(null);

    } finally {

      setLoading(false);

    }
  }

  // Prüfen, ob beim Start bereits eine gültige Session existiert
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");

        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Registrierung
  const register = async (username, password) => {
    const response = await api.post("/register", { username, password });

    setUser(response.data.user);

    await checkAuth();

    return response.data;
  }

  // Login
  const login = async (username, password) => {
    const response = await api.post("/login", { username, password });

    setUser(response.data.user);

    await checkAuth();

    return response.data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}