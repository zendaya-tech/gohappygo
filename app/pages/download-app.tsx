import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import FooterMinimal from '~/components/layout/FooterMinimal';
import { useTranslation } from 'react-i18next';

export default function DownloadApp() {
  const { t } = useTranslation();
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop' | 'unknown'>(
    'unknown'
  );
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Détecter le type d'appareil
    const userAgent = navigator.userAgent.toLowerCase();
    let detectedDevice: 'ios' | 'android' | 'desktop' | 'unknown' = 'unknown';

    if (/iphone|ipad|ipod/.test(userAgent)) {
      detectedDevice = 'ios';
    } else if (/android/.test(userAgent)) {
      detectedDevice = 'android';
    } else {
      detectedDevice = 'desktop';
    }

    setDeviceType(detectedDevice);

    // Rediriger automatiquement après 3 secondes
    const redirectTimer = setTimeout(() => {
      setIsRedirecting(true);
      redirectToStore(detectedDevice);
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, []);

  const redirectToStore = (device: 'ios' | 'android' | 'desktop' | 'unknown') => {
    const storeUrls = {
      ios: 'https://apps.apple.com/app/gohappygo/id123456789',
      android: 'https://play.google.com/store/apps/details?id=com.gohappygo.app',
      desktop: 'https://chrome.google.com/webstore/detail/gohappygo/abcdefghijklmnop',
      unknown: 'https://gohappygo.com/app',
    };

    window.location.href = storeUrls[device];
  };

  const handleManualRedirect = () => {
    setIsRedirecting(true);
    redirectToStore(deviceType);
  };

  const getStoreInfo = () => {
    switch (deviceType) {
      case 'ios':
        return {
          title: t('pages.downloadApp.stores.ios.title'),
          subtitle: t('pages.downloadApp.stores.ios.subtitle'),
          icon: '🍎',
          color: 'bg-black text-white',
          storeName: t('pages.downloadApp.stores.ios.name'),
        };
      case 'android':
        return {
          title: t('pages.downloadApp.stores.android.title'),
          subtitle: t('pages.downloadApp.stores.android.subtitle'),
          icon: '🤖',
          color: 'bg-green-600 text-white',
          storeName: t('pages.downloadApp.stores.android.name'),
        };
      case 'desktop':
        return {
          title: t('pages.downloadApp.stores.desktop.title'),
          subtitle: t('pages.downloadApp.stores.desktop.subtitle'),
          icon: '🌐',
          color: 'bg-blue-600 text-white',
          storeName: t('pages.downloadApp.stores.desktop.name'),
        };
      default:
        return {
          title: t('pages.downloadApp.stores.unknown.title'),
          subtitle: t('pages.downloadApp.stores.unknown.subtitle'),
          icon: '📱',
          color: 'bg-gray-600 text-white',
          storeName: t('pages.downloadApp.stores.unknown.name'),
        };
    }
  };

  const storeInfo = getStoreInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo et titre */}
          <div className="mb-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center">
              <span className="text-4xl">✈️</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">
              {t('pages.downloadApp.title')}
            </h1>
            <p className="text-xl text-gray-600">{t('pages.downloadApp.subtitle')}</p>
          </div>

          {/* Détection d'appareil */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">{storeInfo.icon}</span>
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-gray-900">{storeInfo.title}</h2>
                <p className="text-gray-600">{storeInfo.subtitle}</p>
              </div>
            </div>

            {/* Bouton de téléchargement */}
            <button
              onClick={handleManualRedirect}
              disabled={isRedirecting}
              className={`w-full ${storeInfo.color} py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50`}
            >
              {isRedirecting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('pages.downloadApp.button.redirecting')}
                </div>
              ) : (
                t('pages.downloadApp.button.downloadOn', { storeName: storeInfo.storeName })
              )}
            </button>

            <p className="text-sm text-gray-500 mt-4">{t('pages.downloadApp.autoRedirect')}</p>
          </div>

          {/* Autres plateformes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🍎</div>
              <h3 className="font-semibold text-gray-900 mb-2">iOS</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('pages.downloadApp.stores.ios.subtitle')}
              </p>
              <button
                onClick={() => redirectToStore('ios')}
                className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover"
              >
                {t('pages.downloadApp.stores.ios.name')}
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-gray-900 mb-2">Android</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('pages.downloadApp.stores.android.subtitle')}
              </p>
              <button
                onClick={() => redirectToStore('android')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover"
              >
                {t('pages.downloadApp.stores.android.name')}
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="font-semibold text-gray-900 mb-2">Extension</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('pages.downloadApp.stores.desktop.subtitle')}
              </p>
              <button
                onClick={() => redirectToStore('desktop')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover"
              >
                {t('pages.downloadApp.stores.desktop.name')}
              </button>
            </div>
          </div>

          {/* Fonctionnalités */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-poppins">
              {t('pages.downloadApp.features.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600">✓</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {t('pages.downloadApp.features.secure.title')}
                  </h3>
                </div>
                <p className="text-gray-600 ml-11">{t('pages.downloadApp.features.secure.desc')}</p>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600">✓</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {t('pages.downloadApp.features.competitive.title')}
                  </h3>
                </div>
                <p className="text-gray-600 ml-11">
                  {t('pages.downloadApp.features.competitive.desc')}
                </p>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600">✓</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {t('pages.downloadApp.features.community.title')}
                  </h3>
                </div>
                <p className="text-gray-600 ml-11">
                  {t('pages.downloadApp.features.community.desc')}
                </p>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600">✓</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {t('pages.downloadApp.features.support.title')}
                  </h3>
                </div>
                <p className="text-gray-600 ml-11">
                  {t('pages.downloadApp.features.support.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterMinimal />
    </div>
  );
}
