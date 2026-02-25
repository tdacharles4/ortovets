'use client';

import { useAuth } from '@/contexts/AuthContext';

export function AuthButton() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <button disabled>Loading...</button>;

  if (isAuthenticated) {
    return (
      <button onClick={logout} className="btn-logout">
        Log out
      </button>
    );
  }

  return (
    <button onClick={login} className="btn-login">
      Log in / Register
    </button>
  );
}
