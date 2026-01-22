import type { Route } from "./+types/home";
import Header from '../components/layout/Header';
import HeroSection from "../components/features/home/HeroSection";
import FeaturesSection from "../components/features/home/FeaturesSection";
import PackageCategories from '../components/sections/PackageCategories';
import VerifiedTravelers from '../components/sections/VerifiedTravelers';
import VideoRecommendations from '../components/sections/VideoRecommendations';
import PopularRoutes from '../components/sections/PopularRoutes';
import BecomeTransporterSection from '../components/sections/BecomeTransporterSection';
import LatestDemands from '../components/sections/LatestDemands';
import Reviews from "../components/features/home/Reviews";
import SupportSection from '../components/sections/SupportSection';
import Footer from '../components/layout/Footer';

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "GoHappyGo -  Faites plus qu'un voyage, Faites des bagages Heureux",
    },
    {
      name: "description",
      content:
        "Deux besoins, une entraide : les voyageurs avec des kilos en moins aident ceux qui en ont en plus. Expédiez à petit prix pendant que les voyageurs monétisent leur espace libre, en toute sécurité et simplicité.",
    },
  ];
}

export default function Home() {
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
