'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

interface AuthState {
  isAuthenticated: boolean;
  customerId: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    customerId: null,
    isLoading: true,
  });

  const fetchAuthState = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setState({
        isAuthenticated: data.authenticated,
        customerId: data.customerId ?? null,
        isLoading: false,
      });
    } catch {
      setState({ isAuthenticated: false, customerId: null, isLoading: false });
    }
  }, []);

  useEffect(() => {
    fetchAuthState();
  }, [fetchAuthState]);

  const login = useCallback(async () => {
    const res = await fetch('/api/auth/login');
    const { authUrl, error } = await res.json();
    if (error || !authUrl) {
      console.error('Failed to get auth URL');
      return;
    }
    
    const width = 500, height = 650;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(authUrl, 'shopify-auth-popup', `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`);
    if (!popup) return alert('Please allow popups for this site.');

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_APP_URL) return;
      if (event.data.type === 'AUTH_SUCCESS') {
        fetchAuthState(); // Refetch user state
        cleanup();
      } else if (event.data.type === 'AUTH_ERROR') {
        console.error('Auth error from popup:', event.data.error);
        cleanup();
      }
    };

    const cleanup = () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(pollClosed);
      if (popup && !popup.closed) {
        popup.close();
      }
    };

    window.addEventListener('message', handleMessage);

    const pollClosed = setInterval(() => {
      if (popup.closed) {
        cleanup();
      }
    }, 500);
  }, [fetchAuthState]);
  
  const logout = useCallback(() => {
    // 1. Instantly update the UI to show the user as logged out.
    setState({ isAuthenticated: false, customerId: null, isLoading: false });

    // 2. In the background, tell our server to destroy its session.
    fetch('/api/auth/logout', { method: 'POST' });

    // 3. Also in the background, get the Shopify logout URL and open it in a new tab.
    // This is "fire and forget" - the user can ignore or close the new tab.
    fetch('/api/auth/logout-url')
      .then((res) => res.json())
      .then((data) => {
        if (data.logoutUrl) {
          window.open(data.logoutUrl, '_blank');
        }
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refetch: fetchAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
