import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore, type AuthState } from '~/store/auth';

interface AnnounceType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface AnnounceTypeDropdownProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: 'travel' | 'package') => void;
}

export default function AnnounceTypeDropdown({
  open,
  onClose,
  onSelectType,
}: AnnounceTypeDropdownProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  const isLoggedIn = useAuthStore((s: AuthState) => s.isLoggedIn);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  const announceTypes: AnnounceType[] = [
    {
      id: 'travel',
      title: 'Voyage',
      description: 'Publier un trajet pour faire voyager des colis',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: 'package',
      title: 'Colis',
      description: "Demander le voyage d'un baggage",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 z-50"
      role="dialog"
      aria-label="Types d'annonces"
    >
      <div className="py-2">
        {announceTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              if (!isLoggedIn) {
                window.dispatchEvent(new Event('open-login-dialog'));
                onClose();
                return;
              }
              onSelectType(type.id as 'travel' | 'package');
              onClose();
            }}
            className="w-full px-4 py-3 text-left hover transition-colors duration-200 text-sm font-medium text-gray-700 hover cursor-pointer"
          >
            {t('demande.' + type.title)}
          </button>
        ))}
      </div>
    </div>
  );
}
