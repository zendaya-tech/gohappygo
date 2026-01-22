import { useTranslation } from "react-i18next";
import { useAuthStore, type AuthState } from "../store/auth";

export default function BecomeTransporterSection() {
  const { t } = useTranslation();
  const isLoggedIn = useAuthStore((s: AuthState) => s.isLoggedIn);
  const handleCtaClick = () => {
    const eventName = isLoggedIn ? "open-create-announce" : "open-login-dialog";
    window.dispatchEvent(new Event(eventName));
  };
  return (
    <section className="py-12 px-4 mx-auto">
      <div className="bg-slate-950 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">
              Devenez <span className="text-blue-600">HappyVoyageur</span>, et
              donnez du bonheur à d'autres voyageurs
            </h2>
            <p className="text-blue-100 mb-8">
              {t("home.hostSection.description")}
            </p>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover"
              onClick={handleCtaClick}
            >
              {t("home.hostSection.cta")}
            </button>
          </div>
          <div className="h-64 lg:h-auto">
            <video
              src="/videos/host.mp4"
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
