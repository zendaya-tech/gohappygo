import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router';
import { useAuthStore } from '~/store/auth';

const linkBaseClass =
  'flex min-w-0 flex-1 items-center justify-center rounded-2xl px-2 py-3 transition-colors';

export default function MobileTabBar() {
  const location = useLocation();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openRegister = useAuthStore((state) => state.openRegister);
  const user = useAuthStore((state) => state.user);

  const isActive = (matcher: (pathname: string, search: string) => boolean) => {
    return matcher(location.pathname, location.search);
  };

  const handleProtectedNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLoggedIn) return;
    event.preventDefault();
    openRegister();
  };

  const handlePublish = () => {
    if (!isLoggedIn) {
      openRegister();
      return;
    }

    window.dispatchEvent(new Event('open-create-announce'));
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[120] border-t border-gray-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-xl items-end gap-2">
        <Link
          to="/annonces"
          className={`${linkBaseClass} ${
            isActive((pathname) => pathname === '/annonces')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-500'
          }`}
          aria-label="Rechercher"
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </Link>

        <Link
          to="/profile?section=travels"
          onClick={handleProtectedNavigation}
          className={`${linkBaseClass} ${
            isActive((pathname, search) => pathname === '/profile' && search.includes('section=travels'))
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-500'
          }`}
          aria-label="Vos voyages"
        >
          <PaperAirplaneIcon className="h-6 w-6" />
        </Link>

        <button
          type="button"
          onClick={handlePublish}
          className="-mt-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg cursor-pointer"
          aria-label="Publier"
        >
          <PlusCircleIcon className="h-6 w-6" />
        </button>

        <Link
          to="/profile?section=messages"
          onClick={handleProtectedNavigation}
          className={`${linkBaseClass} ${
            isActive(
              (pathname, search) => pathname === '/profile' && search.includes('section=messages')
            )
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-500'
          }`}
          aria-label="Messages"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </Link>

        <Link
          to="/profile"
          onClick={handleProtectedNavigation}
          className={`${linkBaseClass} ${
            isActive((pathname, search) => pathname === '/profile' && !search.includes('section='))
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-500'
          }`}
          aria-label="Profil"
        >
          {isLoggedIn && user?.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={user.fullName || 'Profil'}
              className="h-7 w-7 rounded-full object-cover ring-2 ring-current/15"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
              {(user?.fullName || user?.name || 'P').trim().charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
      </div>
    </nav>
  );
}
