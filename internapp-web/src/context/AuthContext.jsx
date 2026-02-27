import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

export const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    if (!token) return null;
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setUser(decodeJwt(storedToken));
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/Users/login", { email, password });

    const receivedToken = res.data.token;

    localStorage.setItem("token", receivedToken);
    setToken(receivedToken);
    setUser(decodeJwt(receivedToken));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAuth = !!token;

  // 🔥 NET ROLE OKUMA
  const roleValue =
    user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  const userId =
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuth,
        roleValue,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
