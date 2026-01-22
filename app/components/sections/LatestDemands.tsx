import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import AnnounceCard from "~/components/cards/AnnounceCard";
import { getLatestDemands, type DemandTravelItem } from "~/services/announceService";

export default function LatestDemands() {
  const { t } = useTranslation();
  const [demands, setDemands] = useState<DemandTravelItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestDemands = async () => {
      try {
        const latestDemands = await getLatestDemands(6);
        setDemands(latestDemands);
      } catch (error) {
        console.error("Error fetching latest demands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDemands();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  // Fonction pour formater le nom (prénom + première lettre du nom)
  const formatName = (fullName: string) => {

    return fullName;
  };

  // Fonction pour déterminer la priorité basée sur les propriétés de la demande
  const getPriority = (demand: DemandTravelItem) => {
    if (demand.isInstant) return "Urgent";
    if (demand.packageKind?.toLowerCase().includes("fragile")) return "Fragile";
    if (demand.isAllowExtraWeight) return "Priorité";
    return "Standard";
  };

  if (loading) {
    return (
      <section className="py-12 px-10 rounded-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Dernières <span className="text-blue-600">demandes</span>
        </h2>
        <div className="text-center text-gray-500">
          Chargement des dernières demandes...
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-10 rounded-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Dernières <span className="text-blue-600">demandes</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demands.map((demand) => {
          const id = demand.id?.toString() || Math.random().toString(36).slice(2);
          const name = formatName(demand.user?.fullName || "Voyageur");
          const avatar = demand.user?.selfieImage || "/favicon.ico";
          const originName = demand.departureAirport?.name || "";
          const destName = demand.arrivalAirport?.name || "";
          const route = `${originName} → ${destName}`;
          const pricePerKg = demand.pricePerKg?.toString() || "0";
          const priority = demand.user.rating
          
          // Pour les demandes, utiliser la première image du tableau images
          const image = demand.images?.[0]?.fileUrl || avatar;
          const featured = Boolean(demand.user?.isVerified);
          const weight = demand.weight ? `${demand.weight}kg` : undefined;
          const departure = demand.deliveryDate ? formatDate(demand.deliveryDate) : undefined;
          const type = "traveler"; // Puisqu'on récupère que les demands

          return (
            <AnnounceCard
              key={id}
              id={id}
              avatar={avatar}
              fullName={name}
              location={route}
              price={pricePerKg}
              rating={priority}
              image={image}
              weight={weight}
              departure={departure}
              featured={featured}
              type={type}
              isBookmarked={demand.isBookmarked}
              currencySymbol={demand.currency?.symbol || "€"}
            />
          );
        })}
      </div>
      
      {demands.length === 0 && (
        <div className="text-center text-gray-500">
          Aucune demande disponible pour le moment
        </div>
      )}
    </section>
  );
}
