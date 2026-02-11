import AnnounceCard from '~/components/cards/AnnounceCard';
import { useEffect, useState } from 'react';
import { getLatestTravels, type DemandTravelItem } from '~/services/announceService';
import { useTranslation, Trans } from 'react-i18next';

export default function VerifiedTravelers() {
  const { t } = useTranslation();
  const [travels, setTravels] = useState<DemandTravelItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestTravels = async () => {
      try {
        const latestTravels = await getLatestTravels(3);
        setTravels(latestTravels);
      } catch (error) {
        console.error('Error fetching latest travels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTravels();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Fonction pour formater le nom (prénom + première lettre du nom)
  const formatName = (fullName: string) => {
    return fullName;
  };

  if (loading) {
    return (
      <section className="pb-12 pt-4 px-4 mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          <Trans
            i18nKey="home.verifiedTravelers.title"
            components={{ span: <span className="text-blue-600" /> }}
          />
        </h2>
        <div className="text-center text-gray-500">{t('home.verifiedTravelers.loading')}</div>
      </section>
    );
  }

  return (
    <section className="pb-12 pt-4 px-4 mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        <Trans
          i18nKey="home.verifiedTravelers.title"
          components={{ span: <span className="text-blue-600" /> }}
        />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {travels.map((travel) => {
          const id = travel.id?.toString() || Math.random().toString(36).slice(2);
          const name = formatName(travel.user?.fullName || 'Voyageur');
          const avatar = travel.user?.selfieImage || '/favicon.ico';
          const originName = travel.departureAirport?.name || '';
          const destName = travel.arrivalAirport?.name || '';
          const route = `${originName} → ${destName}`;
          const pricePerKg = travel.pricePerKg?.toString() || '0';
          const rating = travel.user?.rating || '0';

          // Pour les voyageurs, utiliser le logo de la compagnie
          const image = travel.airline?.logoUrl || avatar;
          const featured = Boolean(travel.user?.isVerified);
          const availableWeight = travel.weightAvailable
            ? `${travel.weightAvailable}kg`
            : undefined;
          const departure = travel.deliveryDate ? formatDate(travel.deliveryDate) : undefined;
          const type = 'transporter'; // Type pour les voyages

          return (
            <AnnounceCard
              key={id}
              id={id}
              fullName={name}
              avatar={avatar}
              location={route}
              price={pricePerKg}
              rating={rating}
              image={image}
              weight={availableWeight}
              departure={departure}
              airline={travel.airline?.name}
              featured={featured}
              type={type}
              isBookmarked={travel.isBookmarked}
              currencySymbol={travel.currency?.symbol || '€'}
            />
          );
        })}
      </div>

      {travels.length === 0 && (
        <div className="text-center text-gray-500">{t('home.verifiedTravelers.noTravelers')}</div>
      )}
    </section>
  );
}
