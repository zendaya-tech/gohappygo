import { useTranslation } from "react-i18next";

export default function PopularRoutes() {
  const { t } = useTranslation();
  const routes = [
    { name: "PARIS → NEW YORK", price: "5€/kg", image: "./images/paris.jpg" },
    { name: "LYON → PEKIN", price: "3€/kg", image: "./images/pekin.jpg" },
    {
      name: "MARSEILLE → LONDRES",
      price: "4€/kg",
      image: "./images/londre.jpg",
    },
    {
      name: "NICE → BARCELONE",
      price: "6€/kg",
      image: "./images/barcelone.jpg",
    },
  ];

  return (
    <section className="py-12 px-4 mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        <span className="text-blue-600">Voyages</span> les plus populaires
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {routes.map((route, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden "
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={route.image}
                alt={route.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="mt-2">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">
                {route.name}
              </h3>
              <p className="text-blue-600 font-semibold text-xs">
                {t("home.popularRoutes.startingFrom")} {route.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
