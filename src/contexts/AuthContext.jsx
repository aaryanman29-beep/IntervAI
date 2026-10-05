import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to restore session:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    setUser(data.user);
    // Token is saved in client.js or we can do it here, but client.js does not save it.
    // Wait, let's check client.js or authApi.js
    // I didn't save token in authApi.js. Let's save it here:
    localStorage.setItem("token", data.token);
    return data;
  };

  const register = async (details) => {
    const data = await authApi.register(details);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
