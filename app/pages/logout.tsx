import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore, type AuthState } from '../store/auth';
import { useTranslation } from 'react-i18next';

export default function Logout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((s: AuthState) => s.logout);

  useEffect(() => {
    try {
      window.localStorage.removeItem('auth_token');
    } catch {}
    logout();
    const timeout = setTimeout(() => navigate('/', { replace: true }), 200);
    return () => clearTimeout(timeout);
  }, [navigate, logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="flex justify-center mx-auto mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
        </div>

        {/* Text with fade animation */}
        <div className="space-y-2 animate-pulse">
          <h2 className="text-2xl font-bold text-gray-900">{t('pages.logout.title')}</h2>
          <p className="text-gray-600">{t('pages.logout.message')}</p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
