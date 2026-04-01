import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router';
import React from 'react';

import type { Route } from './+types/root';
import './app.css';
import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import ChatWidget from './components/chat/ChatWidget';
import CookieConsent from './components/dialogs/CookieConsent';
import { useTranslation } from 'react-i18next';
import './i18n';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Sacramento&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();

  return (
    <html lang={i18n.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light" />

        {/* SEO Meta Tags */}
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
        <meta name="keywords" content={t('seo.keywords')} />
        <meta name="author" content="GoHappyGo" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content={i18n.language === 'fr' ? 'French' : 'English'} />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gohappygo.netlify.app/" />
        <meta property="og:title" content={t('seo.title')} />
        <meta property="og:description" content={t('seo.ogDescription')} />
        <meta property="og:image" content="https://gohappygo.netlify.app/images/og.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t('seo.ogImageAlt')} />
        <meta property="og:site_name" content="GoHappyGo" />
        <meta property="og:locale" content={i18n.language === 'fr' ? 'fr_FR' : 'en_US'} />
        <meta property="og:locale:alternate" content={i18n.language === 'fr' ? 'en_US' : 'fr_FR'} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://gohappygo.netlify.app/" />
        <meta property="twitter:title" content={t('seo.title')} />
        <meta property="twitter:description" content={t('seo.ogDescription')} />
        <meta property="twitter:image" content="https://gohappygo.netlify.app/og-image.jpg" />
        <meta property="twitter:image:alt" content={t('seo.ogImageAlt')} />
        <meta property="twitter:creator" content="@gohappygo" />
        <meta property="twitter:site" content="@gohappygo" />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="application-name" content="GoHappyGo" />
        <meta name="apple-mobile-web-app-title" content="GoHappyGo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Business/Contact Information */}
        <meta name="contact" content="contact@gohappygo.fr" />
        <meta name="copyright" content={t('common.copyright')} />

        {/* Geo Tags */}
        <meta name="geo.region" content="FR" />
        <meta name="geo.placename" content="France" />

        {/* Additional SEO */}
        <meta name="category" content="Transport, Voyage, Logistique" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://gohappygo.netlify.app/" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { authenticate } = useAuth();
  const location = useLocation();
  const [showAprilFishAlert, setShowAprilFishAlert] = useState(false);

  const isAprilFishEnabled = import.meta.env.VITE_APRIL_FISH !== 'false';

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.body.classList.toggle('april-fish-active', isAprilFishEnabled);

    return () => {
      document.body.classList.remove('april-fish-active');
    };
  }, [isAprilFishEnabled, location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!isAprilFishEnabled) {
      setShowAprilFishAlert(false);
      return;
    }

    setShowAprilFishAlert(true);
  }, [isAprilFishEnabled, location.pathname, location.search, location.hash]);

  return (
    <>
      <Outlet />
      {showAprilFishAlert && (
        <div className="april-fish-modal fixed inset-0 z-[999] flex items-start justify-center overflow-y-auto bg-black/55 p-4 pt-6 md:pt-10">
          <div className="relative w-full max-w-md rounded-3xl border border-red-300 bg-gradient-to-br from-red-700 via-red-600 to-red-900 p-6 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAprilFishAlert(false)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
              aria-label="Fermer l'alerte"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-100/80">
              Alerte critique
            </div>
            <h2 className="mb-3 text-2xl font-black text-white">Incident visuel detecte</h2>
            <p className="text-sm leading-6 text-red-50">
              votre site a été piraté l&apos;orientation de l&apos;interface.
             a été changé ,  envoyer 0.0002 bitcoin a l'adresse gtieoccbvddlgmdso  toute tentative de contacter les autoritées  judiciaires causera la divulgation de vos codes sources et de vos données .
            </p>
            <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs text-red-50/90">
              Etat du systeme: lisez bien 
            </div>
          </div>
        </div>
      )}
      {/* <ChatWidget /> */}
      <CookieConsent />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
