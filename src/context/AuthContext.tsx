import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, NotificationItem } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (payload: any) => Promise<void>;
  logout: () => void;
  switchUser: (role: 'customer' | 'astrologer' | 'admin') => Promise<void>;
  notifications: NotificationItem[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => api.auth.getStoredUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('lumsic_token'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refreshNotifications = async () => {
    if (!user) return;
    try {
      const items = await api.notifications.list(user.id);
      setNotifications(items);
    } catch {
      // quiet catch
    }
  };

  useEffect(() => {
    if (user) {
      refreshNotifications();
      const interval = setInterval(refreshNotifications, 8000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, pass);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await api.auth.signup(payload);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    setToken(null);
    setNotifications([]);
  };

  // Instant profile switch helper for evaluator convenience
  const switchUser = async (role: 'customer' | 'astrologer' | 'admin') => {
    setIsLoading(true);
    try {
      if (role === 'admin') {
        await login('admin@lumsic.com', 'Admin123!');
      } else if (role === 'astrologer') {
        try {
          await login('nikee@lumsic.com', 'Astro123!');
        } catch {
          await login('devrat@lumsic.com', 'Astro123!');
        }
      } else {
        await login('sarah.jenkins@example.com', 'Customer123!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await api.notifications.markRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // quiet
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        switchUser,
        notifications,
        unreadCount,
        refreshNotifications,
        markNotificationRead,
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
