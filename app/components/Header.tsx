import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NotificationPopover from "./common/popover/NotificationPopover";
import AppDownloadPopover from "./common/popover/AppDownloadPopover";
import { useRef } from "react";
import AvatarMenu from "./common/popover/AvatarMenu";
import CreatePackageDialog from "./common/dialog/CreatePackageDialog";
import CreateAnnounceDialog from "./common/dialog/CreateAnnounceDialog";
import AnnounceTypeDropdown from "./common/popover/AnnounceTypeDropdown";
import LoginDialog from "./common/dialog/LoginDialog";
import RegisterDialog from "./common/dialog/RegisterDialog";
import { Link } from "react-router";
import { useAuthStore, type AuthState } from "../store/auth";
import LanguageDropdown from "./common/popover/LanguageDropdown";
import { notificationService } from "../services/notificationService";

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useAuthStore((s: AuthState) => {
    return s.isLoggedIn;
  });
  const uqer = useAuthStore((s: AuthState) => {
    return s.user;
  });
  const [showNotif, setShowNotif] = useState(false);
  const [showAvatarMenuDesktop, setShowAvatarMenuDesktop] = useState(false);
  const [showAvatarMenuMobile, setShowAvatarMenuMobile] = useState(false);
  const [showCreateAnnounce, setShowCreateAnnounce] = useState(false);
  const [hoverDownload, setHoverDownload] = useState(false);
  const [pinnedDownload, setPinnedDownload] = useState(false);
  const downloadBtnRef = useRef<HTMLElement>({} as HTMLElement);
  const [showCreatePackage, setShowCreatePackage] = useState(false);
  const [showAnnounceTypeDropdown, setShowAnnounceTypeDropdown] =
    useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showMobilePublishOptions, setShowMobilePublishOptions] =
    useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const handleAnnounceTypeSelect = (type: "travel" | "package") => {
    if (type === "travel") {
      setShowCreateAnnounce(true);
    } else if (type === "package") {
      setShowCreatePackage(true);
    }
  };

  // Zustand Store - Extraction des états et actions
  const { showRegister, openRegister, closeRegister } = useAuthStore();

  useEffect(() => {
    const onOpenCreateAnnounce = () => setShowCreateAnnounce(true);
    const onOpenLogin = () => setShowLogin(true);
    window.addEventListener(
      "open-create-announce",
      onOpenCreateAnnounce as EventListener
    );
    window.addEventListener("open-login-dialog", onOpenLogin as EventListener);
    return () => {
      window.removeEventListener(
        "open-create-announce",
        onOpenCreateAnnounce as EventListener
      );
      window.removeEventListener(
        "open-login-dialog",
        onOpenLogin as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const loadUnreadCount = async () => {
        try {
          console.log("Loading notification counts...");
          const counts = await notificationService.getNotificationCounts();
          console.log("Notification counts received:", counts);
          setUnreadCount(counts.unreadCount);
        } catch (error) {
          console.error("Failed to load notification counts:", error);
        }
      };
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    } else {
      console.log("User not logged in, skipping notification count load");
    }
  }, [isLoggedIn]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95/80 backdrop-blur-sm border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to={"/"}
              className="flex items-center space-x-3 flex-shrink-0"
            >
              <div className="h-10">
                <img src="/logo.png" alt="Logo" className="h-10" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center flex-1 justify-between px-6 space-x-8">
              <div className="relative">
                <button
                  onClick={() => setHoverDownload((v) => !v)}
                  className="text-gray-700 hover font-medium text-sm transition-colors duration-200"
                  ref={(el) => {
                    (downloadBtnRef as any).current = el;
                  }}
                >
                  Téléchargez l'appli +
                </button>
                <AppDownloadPopover
                  open={hoverDownload}
                  onClose={() => {
                    setHoverDownload(false);
                    setPinnedDownload(false);
                  }}
                  pinned={pinnedDownload}
                  onTogglePin={() => setPinnedDownload((v) => !v)}
                  triggerRef={downloadBtnRef}
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowAnnounceTypeDropdown((v) => !v)}
                  className="text-gray-700 hover font-medium text-sm transition-colors duration-200"
                >
                  {t("header.publishAd")}
                </button>
                <AnnounceTypeDropdown
                  open={showAnnounceTypeDropdown}
                  onClose={() => setShowAnnounceTypeDropdown(false)}
                  onSelectType={handleAnnounceTypeSelect}
                />
              </div>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4 relative">
              {/* Notifications - Only show if logged in */}
              {isLoggedIn && (
                <div className="relative">
                  <button
                    className="text-gray-700 hover p-2 rounded-full hover transition-colors duration-200 relative"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Notifications"
                    onMouseDown={(e) => e.preventDefault()}
                    onClickCapture={(e) => {
                      e.stopPropagation();
                      setShowNotif((v) => !v);
                    }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationPopover
                    open={showNotif}
                    onClose={() => setShowNotif(false)}
                    onCountChange={setUnreadCount}
                  />
                </div>
              )}
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="relative">
                <button
                  className="flex items-center gap-2 rounded-lg p-1.5 hover transition-colors duration-200"
                  onClick={() => setShowAvatarMenuDesktop((v) => !v)}
                  aria-label="Ouvrir le menu du compte"
                >
                  {isLoggedIn ? (
                    <img
                      src={uqer?.profilePictureUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                  <svg
                    className="h-4 w-4 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </button>
                <AvatarMenu
                  open={showAvatarMenuDesktop}
                  onClose={() => setShowAvatarMenuDesktop(false)}
                  onOpenSettings={() => {
                    setShowAvatarMenuDesktop(false);
                  }}
                  isLoggedIn={isLoggedIn}
                  onOpenLogin={() => {
                    setShowAvatarMenuDesktop(false);
                    setShowLogin(true);
                  }}
                  onOpenRegister={() => {
                    setShowAvatarMenuDesktop(false);
                    openRegister();
                  }}
                />
              </div>
              <LanguageDropdown />
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-1">
              {/* Notifications for mobile - Only show if logged in */}
              {isLoggedIn && (
                <div className="relative">
                  <button
                    className="text-gray-700 hover p-2 rounded-full hover transition-colors duration-200 relative"
                    onClick={() => setShowNotif((v) => !v)}
                    aria-label="Notifications"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationPopover
                    open={showNotif}
                    onClose={() => setShowNotif(false)}
                    onCountChange={setUnreadCount}
                  />
                </div>
              )}

              {/* Language selector for mobile */}
              <div className="relative">
                <LanguageDropdown />
              </div>

              {/* Avatar with dropdown for mobile */}
              <div className="relative">
                <button
                  className="flex items-center hover rounded-lg p-2 transition-colors duration-200"
                  onClick={() => setShowAvatarMenuMobile((v) => !v)}
                  aria-label="Ouvrir le menu du compte"
                >
                  {isLoggedIn ? (
                    <img
                      src={uqer?.profilePictureUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </button>
                <AvatarMenu
                  open={showAvatarMenuMobile}
                  onClose={() => setShowAvatarMenuMobile(false)}
                  onOpenSettings={() => {
                    setShowAvatarMenuMobile(false);
                  }}
                  isLoggedIn={isLoggedIn}
                  onOpenLogin={() => {
                    setShowAvatarMenuMobile(false);
                    setShowLogin(true);
                  }}
                  onOpenRegister={() => {
                    setShowAvatarMenuMobile(false);
                    openRegister();
                  }}
                />
              </div>

              {/* Modern Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative w-10 h-10 rounded-lg hover transition-all duration-300 flex items-center justify-center group"
                aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span
                    className={`block h-0.5 w-full bg-gray-600 rounded-full transition-all duration-300 origin-center ${
                      isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-full bg-gray-600 rounded-full transition-all duration-300 ${
                      isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-full bg-gray-600 rounded-full transition-all duration-300 origin-center ${
                      isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Modern Slide-in Menu */}
          <div
            className={`md:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ${
              isMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 bg-black/20/40 backdrop-blur-sm transition-opacity duration-300 ${
                isMenuOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Menu Panel */}
            <div
              className={`absolute top-0 left-0 right-0 bg-white shadow-xl transition-transform duration-300 ease-out ${
                isMenuOpen ? "translate-y-0" : "-translate-y-full"
              }`}
            >
              <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {/* Téléchargez l'appli */}
                <button
                  onClick={() => {
                    setPinnedDownload(true);
                    setHoverDownload((v) => !v);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover hover hover hover rounded-xl font-medium transition-all duration-200 group"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-gray-400 group-hover transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Téléchargez l'appli</span>
                </button>

                {/* Publier une annonce */}
                <div className="space-y-1">
                  <button
                    onClick={() => setShowMobilePublishOptions((v) => !v)}
                    className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover hover hover hover rounded-xl font-medium transition-all duration-200 group"
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-gray-400 group-hover transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>{t("header.publishAd")}</span>
                    </div>
                    <svg
                      className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                        showMobilePublishOptions ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Submenu with smooth animation */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      showMobilePublishOptions
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-12 pr-4 space-y-1 py-1">
                      <button
                        onClick={() => {
                          if (!isLoggedIn) {
                            setShowLogin(true);
                            setIsMenuOpen(false);
                            return;
                          }
                          setShowCreateAnnounce(true);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2.5 text-gray-600 hover hover/20 rounded-lg transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Publier un trajet
                      </button>
                      <button
                        onClick={() => {
                          if (!isLoggedIn) {
                            setShowLogin(true);
                            setIsMenuOpen(false);
                            return;
                          }
                          setShowCreatePackage(true);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2.5 text-gray-600 hover hover/20 rounded-lg transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        Publier un baggage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CreatePackageDialog
        open={showCreatePackage}
        onClose={() => setShowCreatePackage(false)}
      />
      <CreateAnnounceDialog
        open={showCreateAnnounce}
        onClose={() => setShowCreateAnnounce(false)}
      />
      <LoginDialog
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          openRegister();
        }}
      />
      <RegisterDialog
        open={showRegister}
        onClose={() => closeRegister()}
        onSwitchToLogin={() => {
          closeRegister();
          setShowLogin(true);
        }}
      />
    </>
  );
}
