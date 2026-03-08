import { useAuthStore } from '@/store/authStore';
import type { LoginPayload } from '@/types';

export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    fetchCurrentUser,
    setUser,
    clearError,
  } = useAuthStore();

  const handleLogin = async (payload: LoginPayload) => {
    await login(payload);
  };

  const handleLogout = () => {
    logout();
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    fetchCurrentUser,
    setUser,
    clearError,
  };
}
