import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import Header from '../components/layout/Header';
import FooterMinimal from '~/components/layout/FooterMinimal';
import ProfileDialog from '../components/dialogs/ProfileDialog';
import CreateAnnounceDialog from '~/components/dialogs/CreateAnnounceDialog';
import CreatePackageDialog from '~/components/dialogs/CreatePackageDialog';
import ConversationList from '~/components/chat/ConversationList';
import Chat from '~/components/chat/Chat';
import { useAuth } from '~/hooks/useAuth';
import {
  StarIcon,
  QuestionMarkCircleIcon,
  PaperAirplaneIcon,
  HeartIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import ReservationCard, { type Reservation } from '~/components/cards/ReservationCard';
import ProfileTravelCard, { type ProfileTravel } from '~/components/cards/ProfileTravelCard';
import AnnounceCard from '~/components/cards/AnnounceCard';
import {
  getDemandAndTravel,
  getUserDemandsAndTravels,
  deleteDemand as deleteOldDemand,
  type DemandTravelItem,
} from '~/services/announceService';
import { getMe, type GetMeResponse } from '~/services/authService';
import { getOnboardingLink } from '~/services/stripeService';
import { getUnreadCount } from '~/services/messageService';
import { ReviewsSection } from './ReviewsSection';
import { TravelRequestsSection } from './TravelRequestsSection';
import { TravelsSection } from './TravelsSection';
import { PaymentsSection } from './PaymentsSection';
import { FavoritesSection } from './FavoritesSection';
import { ReservationsSection } from './ReservationsSection';

interface ProfileSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number | string;
}

interface Conversation {
  id: number;
  requestId: number;
  otherUser: {
    id: number;
    name: string;
    avatar: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: number;
  };
  unreadCount: number;
  travel: {
    departureAirport?: { name: string };
    arrivalAirport?: { name: string };
    flightNumber?: string;
  };
}

export default function Profile() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user'); // Get user ID from query params
  const { user: currentUser, isAuthenticated } = useAuth();

  // Determine if this is the current user's profile or another user's profile
  const isOwnProfile = !userId || (currentUser && userId === currentUser.id?.toString());

  // Set default section based on profile type and URL parameters
  const sectionParam = searchParams.get('section');
  const [activeSection, setActiveSection] = useState<string>(
    sectionParam || (isOwnProfile ? 'reservations' : 'reviews')
  );

  // State to track which conversation should be auto-selected when navigating to messages
  const [autoSelectRequestId, setAutoSelectRequestId] = useState<number | null>(null);

  // Update active section when URL parameters change
  useEffect(() => {
    const sectionParam = searchParams.get('section');
    if (sectionParam) {
      setActiveSection(sectionParam);
    }
  }, [searchParams]);
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);
  const [createAnnounceDialogOpen, setCreateAnnounceDialogOpen] = useState<boolean>(false);
  const [createPackageDialogOpen, setCreatePackageDialogOpen] = useState<boolean>(false);
  const [profileUser, setProfileUser] = useState<GetMeResponse | null>(null);
  const [profileStats, setProfileStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [processingOnboarding, setProcessingOnboarding] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);

      // Get total unread messages count
      const unreadCount = await getUnreadCount();
      setTotalUnreadCount(unreadCount);

      try {
        // If userId is provided, fetch that user's data, otherwise fetch current user's data
        const userData = await getMe(userId || undefined);
        if (userData) {
          setProfileUser(userData);
          setProfileStats(userData.profileStats);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  // Use profileUser data instead of currentUser for display
  const displayUser = profileUser || currentUser;

  const profileSections: ProfileSection[] = [
    {
      id: 'reservations',
      label: t('profile.sections.reservations'),
      icon: <PaperAirplaneIcon className="h-5 w-5" />,
      count: profileStats?.requestsAcceptedCount || 0,
    },
    {
      id: 'messages',
      label: t('profile.sections.messages'),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      count: totalUnreadCount,
    },
    {
      id: 'reviews',
      label: t('profile.sections.reviews'),
      icon: <StarIcon className="h-5 w-5" />,
      count: profileStats?.reviewsReceivedCount || 0,
    },
    {
      id: 'travel-requests',
      label: t('profile.sections.travelRequests'),
      icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
      count: profileStats?.demandsCount || 0,
    },
    {
      id: 'travels',
      label: t('profile.sections.travels'),
      icon: <PaperAirplaneIcon className="h-5 w-5" />,
      count: profileStats?.travelsCount || 0,
    },
    {
      id: 'favorites',
      label: t('profile.sections.favorites'),
      icon: <HeartIcon className="h-5 w-5" />,
      count: (profileStats?.bookMarkTravelCount || 0) + (profileStats?.bookMarkDemandCount || 0),
    },
    {
      id: 'payments',
      label: t('profile.sections.payments'),
      icon: <CurrencyDollarIcon className="h-5 w-5" />,
      count: profileUser?.stripeAvailableBalance || 0,
    },
  ];

  // Filter sections based on whether it's own profile or not
  const visibleSections = isOwnProfile
    ? profileSections
    : profileSections.filter(
        (section) => !['reservations', 'messages', 'favorites', 'payments'].includes(section.id)
      );

  const handleStripeOnboarding = async () => {
    setProcessingOnboarding(true);
    try {
      const response = await getOnboardingLink();
      // Open the Stripe onboarding URL in a new tab
      window.open(response.url, '_blank');
    } catch (error) {
      console.error('Error getting onboarding link:', error);
      // You could show an error message here
    } finally {
      setProcessingOnboarding(false);
    }
  };

  const MessagesSection = ({ initialRequestId }: { initialRequestId?: number | null }) => {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

    // Clear the auto-select request ID after component mounts
    useEffect(() => {
      if (initialRequestId) {
        // Clear it after a short delay to ensure ConversationList has processed it
        const timer = setTimeout(() => {
          setAutoSelectRequestId(null);
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [initialRequestId]);

    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row h-auto md:h-[600px]">
          {/* Conversations List */}
          <div className="w-full md:w-1/3 border-b md md border-gray-200 max-h-[300px] md:max-h-none">
            <ConversationList
              onSelectConversation={setSelectedConversation}
              selectedConversationId={selectedConversation?.id}
              initialRequestId={initialRequestId}
            />
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <Chat
                requestId={selectedConversation.requestId}
                otherUser={selectedConversation.otherUser}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">
                    {t('profile.messages.selectConversation')}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {t('profile.messages.selectConversationDesc')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'messages':
        return <MessagesSection initialRequestId={autoSelectRequestId} />;
      case 'reservations':
        return (
          <div className="bg-white rounded-2xl">
            <ReservationsSection
              onNavigateToMessages={(requestId) => {
                setActiveSection('messages');
                setAutoSelectRequestId(requestId);
              }}
            />
          </div>
        );
      case 'reviews':
        return <ReviewsSection />;
      case 'travel-requests':
        return <TravelRequestsSection />;
      case 'travels':
        return <TravelsSection />;
      case 'favorites':
        return <FavoritesSection />;
      case 'payments':
        return (
          <PaymentsSection
            profileStats={profileStats}
            displayUser={displayUser}
            processingOnboarding={processingOnboarding}
            handleStripeOnboarding={handleStripeOnboarding}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">{t('profile.messages.loadingProfile')}</p>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t('profile.messages.userNotFound')}</p>
          <button onClick={() => window.history.back()} className="text-blue-600 font-semibold">
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Header />

      <main className="min-h-screen max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-3 md:gap-5">
          {/* Sidebar */}
          <aside className="space-y-4 md:space-y-6 lg:sticky lg:top-24 self-start">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 text-center">
              {/* Profile Picture */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-3 md:mb-4 overflow-hidden">
                {profileUser.profilePictureUrl ? (
                  <img
                    src={profileUser.profilePictureUrl}
                    alt={profileUser.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* User Name */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {profileUser.firstName} {profileUser.lastName?.charAt(0)}.
                  {isOwnProfile && ` (${t('common.user')})`}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t('profile.stats.rating')}: {profileStats?.averageRating?.toFixed(1) || '0.0'} ★
                </p>
              </div>

              {/* Bio snippet */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Bio
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 italic">
                  {profileUser.bio ||
                    (isOwnProfile ? t('profile.messages.addBio') : t('profile.messages.noBio'))}
                </p>
              </div>

              {/* Edit Profile Button - Only show for own profile */}
              {isOwnProfile && (
                <button
                  onClick={() => setProfileDialogOpen(true)}
                  className="w-full mt-6 bg-white border border-blue-500 text-blue-500 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  {t('profile.editProfile')}
                </button>
              )}
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-2xl border border-gray-200 p-2">
              <nav className="space-y-1 md:space-y-2">
                {visibleSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between p-2 md:p-3 rounded-lg text-left transition-colors cursor-pointer ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="flex-shrink-0">{section.icon}</span>
                      <span className="text-xs md:text-sm font-medium truncate">
                        {section.label}
                      </span>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {section.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Action Buttons - Only show for own profile */}
            {isOwnProfile && (
              <div className="space-y-3">
                <button
                  onClick={() => setCreateAnnounceDialogOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors shadow-lg hover:shadow-xl cursor-pointer"
                >
                  {t('profile.actions.proposeSpace')}
                </button>
                <button
                  onClick={() => setCreatePackageDialogOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors shadow-lg hover:shadow-xl cursor-pointer"
                >
                  {t('profile.actions.findSpace')}
                </button>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <section className="w-full">
            {/* Section Title */}
            <div className="mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                | {visibleSections.find((s) => s.id === activeSection)?.label}
              </h1>
            </div>

            {/* Content */}
            {renderContent()}
          </section>
        </div>
      </main>

      {/* Profile Dialog - Only show for own profile */}
      {isOwnProfile && (
        <ProfileDialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} />
      )}

      {/* Create Announce Dialog - Only show for own profile */}
      {isOwnProfile && (
        <CreateAnnounceDialog
          open={createAnnounceDialogOpen}
          onClose={() => setCreateAnnounceDialogOpen(false)}
        />
      )}

      {/* Create Package Dialog - Only show for own profile */}
      {isOwnProfile && (
        <CreatePackageDialog
          open={createPackageDialogOpen}
          onClose={() => setCreatePackageDialogOpen(false)}
        />
      )}

      <FooterMinimal />
    </div>
  );
}
