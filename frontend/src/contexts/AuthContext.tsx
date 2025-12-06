import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import api from "../api/axios";

interface User {
  user_id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<User>("/auth/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        // Silently handle 401/403 errors (invalid/expired token)
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    try {
      const res = await api.get<User>("/auth/me");
      setUser(res.data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      throw new Error("Failed to authenticate");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
