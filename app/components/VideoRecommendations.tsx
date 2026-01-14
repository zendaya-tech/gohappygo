import { useTranslation } from "react-i18next";
import VideoCard from "./VideoCard";

export default function VideoRecommendations() {
  const { t } = useTranslation();
  const recommendations = [
    {
      title: t("home.recommendations.howItWorks"),
      subtitle: t("home.recommendations.popularRoutes"),
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      videoId: "dQw4w9WgXcQ",
    },
    {
      title: t("home.recommendations.yourSecurityPriority"),
      subtitle: t("home.recommendations.fragilePackages"),
      image:
        "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&h=300&fit=crop",
      videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
      videoId: "9bZkp7q19f0",
    },
    {
      title: t("home.recommendations.whyHappy"),
      subtitle: t("home.recommendations.advantageousRates"),
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop",
      videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
      videoId: "jNQXAC9IVRw",
    },
    {
      title: t("home.recommendations.judiciaryProtection"),
      subtitle: t("home.recommendations.urgentPackages"),
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
      videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
      videoId: "kJQP7kiw5Fk",
    },
  ];

  return (
    <section className="py-12 px-4 mx-auto">
      <h2 className="text-3xl font-bold   dark:text-white mb-8">
        {t("home.recommendations.title")}{" "}
        <span className="text-blue-600">Recommandations</span>{" "}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((recommendation, index) => (
          <VideoCard key={index} {...recommendation} />
        ))}
      </div>
    </section>
  );
}
