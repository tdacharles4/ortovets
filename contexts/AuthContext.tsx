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
      // Allow messages from our own origin to handle cases where NEXT_PUBLIC_APP_URL is mismatched
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'AUTH_SUCCESS') {
        console.log('Auth success received from popup');
        fetchAuthState(); // Refetch user state
        cleanup();
      } else if (event.data.type === 'AUTH_ERROR') {
        console.error('Auth error from popup:', event.data.error);
        cleanup();
      }
    };

    const cleanup = () => {
      window.removeEventListener('message', handleMessage);
      if (typeof pollClosed !== 'undefined') clearInterval(pollClosed);
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
  
  const logout = useCallback(async () => {
    try {
      // 1. Instantly update the UI to show the user as logged out.
      setState({ isAuthenticated: false, customerId: null, isLoading: false });

      // 2. Tell our server to destroy its session and wait for it.
      await fetch('/api/auth/logout', { method: 'POST' });

      // 3. Get the Shopify logout URL.
      const res = await fetch('/api/auth/logout-url');
      const data = await res.json();
      
      if (data.logoutUrl) {
        // 4. Redirect the main page to Shopify for logout.
        window.location.href = data.logoutUrl;
      } else {
        // Fallback: just refresh if we can't get the URL
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout error:', error);
      window.location.reload();
    }
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
