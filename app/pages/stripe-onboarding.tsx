import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, Luggage, Users, Euro } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function StripeOnboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // // Auto-redirect after 5 seconds if user doesn't click the button
    // const timer = setTimeout(() => {
    //   navigate("/profile");
    // }, 20000);
    // return () => clearTimeout(timer);
  }, [navigate]);

  const handleDashboardClick = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen">
      {/* Logo */}
      <div className="absolute top-8 left-8">
        <img src="/logo.png" alt="GoHappyGo" className="h-12" />
      </div>

      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl">
          {/* Top Success Header */}
          <div className="pt-8 pb-4 px-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 p-3 rounded-full">
                <CheckCircle className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
            </div>

            <h1 className="text-2xl md font-bold text-gray-800 mb-2">
              {t('pages.stripeOnboarding.title')}
            </h1>
            <p className="text-gray-600 text-base">{t('pages.stripeOnboarding.subtitle')}</p>
          </div>

          {/* Hero Illustration Area */}
          <div className="relative h-48 flex items-center justify-center overflow-hidden mb-6">
            <div className="relative z-10 w-full h-full flex justify-center">
              <img
                src="/illustrations/travel-success.jpeg"
                alt="Success"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 py-4 mb-6">
            <StatusBadge label={t('pages.stripeOnboarding.badges.verified')} />
            <StatusBadge label={t('pages.stripeOnboarding.badges.info')} />
            <StatusBadge label={t('pages.stripeOnboarding.badges.payments')} />
            <StatusBadge label={t('pages.stripeOnboarding.badges.happiness')} />
          </div>

          {/* Main Action */}
          <div className="py-4 flex justify-center mb-8">
            <button
              onClick={handleDashboardClick}
              className="bg-green-500 hover text-white px-10 py-3 rounded-lg font-semibold transition-colors text-base"
            >
              {t('pages.stripeOnboarding.dashboard')}
            </button>
          </div>

          {/* Footer: What happens next? */}
          <div className="">
            <h3 className="text-center font-bold text-gray-800 mb-8 text-lg">
              {t('pages.stripeOnboarding.next')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <NextStep
                icon={<Luggage className="text-blue-500" size={24} />}
                title={t('pages.stripeOnboarding.steps.publish.title')}
                desc={t('pages.stripeOnboarding.steps.publish.desc')}
              />
              <NextStep
                icon={<Users className="text-blue-500" size={24} />}
                title={t('pages.stripeOnboarding.steps.search.title')}
                desc={t('pages.stripeOnboarding.steps.search.desc')}
              />
              <NextStep
                icon={<Euro className="text-yellow-500" size={24} />}
                title={t('pages.stripeOnboarding.steps.earn.title')}
                desc={t('pages.stripeOnboarding.steps.earn.desc')}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium  border border-gray-200">
      <CheckCircle className="w-5 h-5 text-white fill-green-600" />
      {label}
    </div>
  );
}

function NextStep({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="text-center space-y-3">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
        {icon}
      </div>
      <h4 className="font-bold text-gray-800 leading-tight px-2 text-sm">{title}</h4>
      <p className="text-xs text-gray-600 leading-relaxed px-2">{desc}</p>
    </div>
  );
}
