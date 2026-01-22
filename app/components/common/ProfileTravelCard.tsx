export type ProfileTravel = {
  id: string;
  originCity: string;
  destinationCity: string;
  travelDate: string; // YYYY-MM-DD
  flightNumber?: string;
  availableWeightKg?: number;
  pricePerKg?: number;
  imageUrl?: string;
  verified?: boolean;
};

export default function ProfileTravelCard({
  travel,
  onEdit,
  onDelete,
}: {
  travel: ProfileTravel;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const route = `${travel.originCity} → ${travel.destinationCity}`;
  const date = new Date(travel.travelDate).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex">
        <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">
          {travel.imageUrl ? (
            <img
              src={travel.imageUrl}
              alt={route}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400">🧳</div>
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-900">
              {route}
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-500">{date}</div>
          {travel.flightNumber && (
            <div className="mt-1 text-xs text-gray-500">
              Numéro de vol {travel.flightNumber}
            </div>
          )}

          <div className="mt-3 flex items-center gap-3">
            {typeof travel.availableWeightKg === "number" && (
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm">
                {travel.availableWeightKg} Kg
              </span>
            )}
            {typeof travel.pricePerKg === "number" && (
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm">
                {travel.pricePerKg} €/Kg
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => onEdit?.(travel.id)}
              className="px-4 py-2 rounded-lg border text-sm hover"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(travel.id)}
              className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm hover"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
