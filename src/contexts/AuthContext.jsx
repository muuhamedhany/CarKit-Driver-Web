import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('carkit_driver_portal_session');
    const lastActive = localStorage.getItem('carkit_driver_portal_last_active');
    
    const maxInactivity = 2 * 60 * 60 * 1000; // 2 hours for drivers/emergency staff
    const now = Date.now();

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Bypass idle logout if they are on an active job or emergency employee is marked online
        const isOnActiveJob = window.location.pathname.includes('/active');
        const isOnlineEmergency = parsed?.role === 'emergency_employee' && parsed?.user?.is_online;
        
        if (lastActive && now - parseInt(lastActive, 10) > maxInactivity && !isOnActiveJob && !isOnlineEmergency) {
          localStorage.removeItem('carkit_driver_portal_session');
          localStorage.removeItem('carkit_driver_portal_last_active');
        } else {
          setSession(parsed);
          localStorage.setItem('carkit_driver_portal_last_active', now.toString());
        }
      } catch {
        localStorage.removeItem('carkit_driver_portal_session');
        localStorage.removeItem('carkit_driver_portal_last_active');
      }
    }
    setLoading(false);
  }, []);

  const persist = (nextSession) => {
    setSession(nextSession);
    if (nextSession) {
      localStorage.setItem('carkit_driver_portal_session', JSON.stringify(nextSession));
      localStorage.setItem('carkit_driver_portal_last_active', Date.now().toString());
    } else {
      localStorage.removeItem('carkit_driver_portal_session');
      localStorage.removeItem('carkit_driver_portal_last_active');
    }
  };

  const login = async (gateway, credentials) => {
    const endpoint = gateway === 'driver' ? '/drivers/login' : '/emergency/employees/login';
    const res = await axios.post(`${API_URL}${endpoint}`, credentials);
    const data = res.data?.data || {};
    const token = data.token;
    if (!token) {
      return { success: false, message: res.data?.message || 'Account is not ready yet.' };
    }
    const user = gateway === 'driver' ? data.driver : data.employee;
    persist({ token, role: gateway === 'driver' ? 'driver' : 'emergency_employee', user });
    return { success: true };
  };

  const registerDriver = async (payload) => {
    const res = await axios.post(`${API_URL}/drivers/register`, payload);
    return res.data;
  };

  const refreshProfile = async () => {
    if (!session?.token) return null;
    const endpoint = session.role === 'driver' ? '/drivers/me' : '/emergency/employees/me';
    const res = await axios.get(`${API_URL}${endpoint}`, { headers: authHeaders(session.token) });
    const next = { ...session, user: res.data?.data };
    persist(next);
    return next.user;
  };

  const logout = async () => {
    if (session?.role === 'emergency_employee' && session?.token) {
      axios.post(`${API_URL}/emergency/employees/go-offline`, {}, { headers: authHeaders(session.token) }).catch(() => {});
    }
    setSession(null);
    localStorage.removeItem('carkit_driver_portal_session');
    localStorage.removeItem('carkit_driver_portal_last_active');
  };

  // Activity tracking for Driver Web
  useEffect(() => {
    if (!session?.token) return;

    const maxInactivity = 2 * 60 * 60 * 1000; // 2 hours

    const updateActivity = () => {
      localStorage.setItem('carkit_driver_portal_last_active', Date.now().toString());
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    const interval = setInterval(() => {
      const lastActive = localStorage.getItem('carkit_driver_portal_last_active');
      const isOnActiveJob = window.location.pathname.includes('/active');
      const isOnlineEmergency = session?.role === 'emergency_employee' && session?.user?.is_online;

      if (lastActive && Date.now() - parseInt(lastActive, 10) > maxInactivity) {
        if (!isOnActiveJob && !isOnlineEmergency) {
          logout();
        } else {
          // Bypassed: update activity time so we don't trigger this continuously while active
          updateActivity();
        }
      }
    }, 10000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(interval);
    };
  }, [session?.token, session?.role, session?.user?.is_online]);

  const value = useMemo(() => ({
    session,
    token: session?.token,
    role: session?.role,
    user: session?.user,
    loading,
    isAuthenticated: Boolean(session?.token),
    headers: authHeaders(session?.token),
    login,
    registerDriver,
    refreshProfile,
    logout,
  }), [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
