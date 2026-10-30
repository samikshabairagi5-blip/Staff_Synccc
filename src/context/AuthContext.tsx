import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/hrm';
import { DEMO_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchPersona: (role: UserRole) => void;
  register: (data: { name: string; email: string; role: UserRole; department: string; designation: string }) => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'nexushr_auth_user';
const TOKEN_STORAGE_KEY = 'nexushr_jwt_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // fallback
    }
    // Default initial user is Employee (Sarah Jenkins) for first-time onboarding feel, or HR
    return DEMO_USERS.employee;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || DEMO_USERS.employee.token || 'jwt_token_default';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      const tok = user.token || `jwt_token_${user.id}_${Date.now()}`;
      setToken(tok);
      localStorage.setItem(TOKEN_STORAGE_KEY, tok);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
    }
  }, [user]);

  const login = async (email: string): Promise<boolean> => {
    // Check demo users first
    const foundDemo = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (foundDemo) {
      setUser(foundDemo);
      return true;
    }

    // Generic fallback login
    const newUser: User = {
      id: `usr_${Date.now()}`,
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: email.trim(),
      role: 'employee',
      department: 'Engineering',
      designation: 'Software Engineer',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      token: `jwt_simulated_${Date.now()}`
    };
    setUser(newUser);
    return true;
  };

  const switchPersona = (newRole: UserRole) => {
    const demo = DEMO_USERS[newRole];
    if (demo) {
      setUser(demo);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    role: UserRole;
    department: string;
    designation: string;
  }) => {
    const newUser: User = {
      id: `usr_reg_${Date.now()}`,
      employeeId: `EMP-${Math.floor(2000 + Math.random() * 8000)}`,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      designation: data.designation,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      token: `jwt_reg_token_${Date.now()}`
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'employee',
        isAuthenticated: !!user,
        token,
        login,
        logout,
        switchPersona,
        register,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
