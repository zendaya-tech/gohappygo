import type { Route } from './+types/home';
import { Capacitor } from '@capacitor/core';
import { Navigate } from 'react-router';
import Header from '../components/layout/Header';
import HeroSection from '../components/features/home/HeroSection';
import FeaturesSection from '../components/features/home/FeaturesSection';
import PackageCategories from '../components/sections/PackageCategories';
import VerifiedTravelers from '../components/sections/VerifiedTravelers';
import VideoRecommendations from '../components/sections/VideoRecommendations';
import PopularRoutes from '../components/sections/PopularRoutes';
import BecomeTransporterSection from '../components/sections/BecomeTransporterSection';
import LatestDemands from '../components/sections/LatestDemands';
import Reviews from '../components/features/home/Reviews';
import SupportSection from '../components/sections/SupportSection';
import Footer from '../components/layout/Footer';

import i18n from '~/i18n';

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: i18n.t('home.meta.title'),
    },
    {
      name: 'description',
      content: i18n.t('home.meta.description'),
    },
  ];
}

export default function Home() {
  if (Capacitor.isNativePlatform()) {
    return <Navigate to="/annonces" replace />;
  }

  return (
    <>
      <Header />

      <div className="min-h-screen max-w-7xl mx-auto relative bg-white">
        <HeroSection />
        <FeaturesSection />
        {/* <PackageCategories /> */}
        <VerifiedTravelers />
        <VideoRecommendations />
        <PopularRoutes />
        <BecomeTransporterSection />
        <LatestDemands />
        <Reviews />
        <SupportSection />
      </div>

      <Footer />
    </>
  );
}
