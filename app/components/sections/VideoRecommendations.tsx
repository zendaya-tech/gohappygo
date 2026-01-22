import { useTranslation } from "react-i18next";
import VideoCard from '~/components/cards/VideoCard';

export default function VideoRecommendations() {
  const { t } = useTranslation();
  
  const recommendations = [
    {
      title: t("home.recommendations.howItWorks"),
      videoId: "wyTfWvtGSSY",
    },
    {
      title: t("home.recommendations.yourSecurityPriority"),
      videoId: "wyTfWvtGSSY",
    },
    {
      title: t("home.recommendations.whyHappy"),
      videoId: "wyTfWvtGSSY",
    },
    {
      title: t("home.recommendations.judiciaryProtection"),
      videoId: "wyTfWvtGSSY",
    },
  ];

  return (
    <section className="py-12 px-4 mx-auto">
      <h2 className="text-3xl font-bold mb-8">
        {t("home.recommendations.title")}{" "}
        <span className="text-blue-600">Recommandations</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((recommendation, index) => (
          <VideoCard key={index} {...recommendation} />
        ))}
      </div>
    </section>
  );
}