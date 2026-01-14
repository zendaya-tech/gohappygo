import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReviewCard from "./ReviewCard";

export default function Reviews() {
  const { t } = useTranslation();
  const [selectedReview, setSelectedReview] = useState<number>(0);

  const reviews = [
    {
      review: t("home.reviews.france.review"),
      name: t("home.reviews.france.name"),
      avatar:
        "https://images.unsplash.com/photo-1699220274995-a37956b7e43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      location: "france",
    },
    {
      review: t("home.reviews.usa_west.review"),
      name: t("home.reviews.usa_west.name"),
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      location: "usa_west",
    },
    {
      review: t("home.reviews.usa_east.review"),
      name: t("home.reviews.usa_east.name"),
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      location: "usa_east",
    },
    {
      review: t("home.reviews.australia.review"),
      name: t("home.reviews.australia.name"),
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      location: "australia",
    },
    {
      review: t("home.reviews.south_africa.review"),
      name: t("home.reviews.south_africa.name"),
      avatar:
        "https://images.unsplash.com/photo-1531727991582-cfd25ce79613?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      location: "south_africa",
    },
    {
      review: t("home.reviews.brazil.review"),
      name: t("home.reviews.brazil.name"),
      avatar:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      location: "brazil",
    },
  ];

  // Helper pour positionner les visages sur la carte (en %)
  const getPosition = (location: string) => {
    const coords: Record<string, { top: string; left: string }> = {
      france: { top: "35%", left: "48%" },
      usa_west: { top: "38%", left: "15%" },
      usa_east: { top: "40%", left: "25%" },
      australia: { top: "75%", left: "85%" },
      south_africa: { top: "78%", left: "52%" },
      brazil: { top: "65%", left: "32%" },
    };
    return coords[location] || { top: "0%", left: "0%" };
  };

  return (
    <section className="px-4 py-12 mx-auto max-w-7xl">
      <div className="flex gap-8 flex-col lg:flex-row justify-center items-center">
        {/* World Map Container */}
        <div className="relative flex-1 w-full max-w-3xl">
          <img
            src="/images/map.svg"
            alt="world map"
            className="w-full h-auto opacity-80"
          />

          {reviews.map((review, index) => {
            const pos = getPosition(review.location);
            return (
              <div
                key={index}
                className={`size-10 sm:size-12 overflow-hidden border-2 rounded-full absolute cursor-pointer transition-all duration-300 hover:scale-125 z-10 ${
                  selectedReview === index
                    ? "border-blue-500 shadow-2xl scale-110 z-20"
                    : "border-white/50 shadow-md"
                }`}
                style={{
                  top: pos.top,
                  left: pos.left,
                  transform: "translate(-50%, -50%)", // Centre l'image sur le point exact
                }}
                onClick={() => setSelectedReview(index)}
              >
                <img
                  src={review.avatar}
                  className="size-full object-cover"
                  alt={review.name}
                />
              </div>
            );
          })}
        </div>

        {/* Review Card Display */}
        <div className="w-full lg:w-96 flex flex-col justify-center animate-in fade-in slide-in-from-right duration-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            {t("home.reviews.title", "Ce que disent nos voyageurs")}
          </h2>
          <ReviewCard {...reviews[selectedReview]} />
        </div>
      </div>
    </section>
  );
}
