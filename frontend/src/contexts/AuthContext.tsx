import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

interface User {
  user_id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// For local-first app, we use a simple local user
// No backend authentication needed
const LOCAL_USER: User = {
  user_id: 1,
  username: 'local_user',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For local-first app, always set user immediately
    // No authentication required
    setUser(LOCAL_USER);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // For local-first app, just set the local user
    // In the future, you could add optional password protection
    setUser(LOCAL_USER);
  };

  const logout = () => {
    // For local-first app, logout doesn't really do anything
    // but we keep it for UI consistency
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
