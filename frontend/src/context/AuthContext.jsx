// src/context/AuthContext.jsx

import { useEffect, useState } from "react";

import { AuthContext } from "./auth-context.js";
import * as authApi from "../api/auth.api.js";

const TOKEN_KEY = "printtshirts_token";
const USER_KEY = "printtshirts_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAuthentication = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        if (!cancelled) {
          setLoading(false);
        }

        return;
      }

      try {
        const result = await authApi.getMe();

        if (cancelled) {
          return;
        }

        setUser(result.user);

        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      } catch {
        if (cancelled) {
          return;
        }

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setUser(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkAuthentication();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (data) => {
    const result = await authApi.login(data);

    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));

    setUser(result.user);

    return result;
  };

  const register = async (data) => {
    const result = await authApi.register(data);

    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));

    setUser(result.user);

    return result;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
