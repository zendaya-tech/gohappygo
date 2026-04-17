import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useIsNativeApp } from '~/hooks/useIsNativeApp';

export default function FooterMinimal() {
  const { t } = useTranslation();
  const isNativeApp = useIsNativeApp();
  const year = new Date().getFullYear();

  if (isNativeApp) return null;

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt={t('common.accessibility.logo')} className="h-6" />
          <span className="font-semibold text-gray-900">GoHappyGo</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/annonces" className="hover">
            {t('footer.discover.announcements')}
          </Link>
          <Link to="/faq" className="hover">
            {t('footer.support.faq')}
          </Link>
        </nav>
        <p className="text-xs">© {year} GoHappyGo</p>
      </div>
    </footer>
  );
}
