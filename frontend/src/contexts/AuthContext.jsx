import { createContext, useState, useEffect, useCallback } from "react";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  getCurrentUserRequest,
  googleLoginRequest,
} from "../services/auth.service";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUserRequest();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials);
    if (response?.token) {
      localStorage.setItem("token", response.token);
    }
    const currentUser = await getCurrentUserRequest();
    setUser(currentUser);
    return currentUser;
  }, []);

  const googleLogin = useCallback(async (payload) => {
    const response = await googleLoginRequest(payload);
    if (response?.token) {
      localStorage.setItem("token", response.token);
    }
    const currentUser = await getCurrentUserRequest();
    setUser(currentUser);
    return currentUser;
  }, []);

  const register = useCallback(async (payload) => {
    await registerRequest(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    googleLogin,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}