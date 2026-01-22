import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import FooterMinimal from '~/components/layout/FooterMinimal';
import AnnounceCard from '~/components/cards/AnnounceCard';
import SearchFiltersBar, {
  type SearchFiltersBarRef,
} from '~/components/forms/SearchFiltersBar';
import { getRandomQuotes, type Quote } from "../services/quotesService";
import { getDemandAndTravel } from "~/services/announceService";
import AirlineComboBox from '~/components/forms/AirlineComboBox';
import type { Airline } from "~/services/airlineService";
import { useInfiniteScroll } from "~/hooks/useInfiniteScroll";
import CreateAlertDialog from '~/components/dialogs/CreateAlertDialog';
import { useAuthStore } from "~/store/auth";

export default function Annonces() {
  const location = useLocation();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const urlParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [meta, setMeta] = useState<any>(null);
  const [searchParams, setSearchParams] = useState({
    from: urlParams.get("from") || "",
    to: urlParams.get("to") || "",
    date: urlParams.get("date") || new Date().toISOString().slice(0, 10),
    flight: urlParams.get("flight") || "",
  });
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quotesError, setQuotesError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [weightRange, setWeightRange] = useState({ min: "", max: "" });
  const [selectedAirline, setSelectedAirline] = useState<string | null>(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const searchFiltersRef = useRef<SearchFiltersBarRef>(null);

  // Zustand Store - Extraction des états et actions
  const { showRegister, openRegister, closeRegister } = useAuthStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const filters = [
    { id: "verified", label: "Profil vérifié" },
    { id: "lowest-price", label: "Prix le plus bas" },
    { id: "airline", label: "Compagnie aérienne" },
    { id: "travel-date", label: "Plus ancien" },
    { id: "travel-ad", label: "Annonce de voyage" },
    { id: "transport-request", label: "Demande de Voyage" },
  ];
  // Build filters object
  const buildFilters = useCallback(() => {
    const filters: any = {
      originAirportId: urlParams.get("from") || undefined,
      destinationAirportId: urlParams.get("to") || undefined,
      travelDate: urlParams.get("date") || undefined,
      flightNumber: urlParams.get("flight") || undefined,
      limit: 4, // Items per page
    };

    // Apply selected filters
    if (selectedFilters.includes("verified")) {
      filters.isVerified = true;
    }
    if (selectedFilters.includes("travel-ad")) {
      filters.type = "travel";
    }
    if (selectedFilters.includes("transport-request")) {
      filters.type = "demand";
    }

    // Apply price range filters
    if (priceRange.min) {
      filters.minPricePerKg = parseFloat(priceRange.min);
    }
    if (priceRange.max) {
      filters.maxPricePerKg = parseFloat(priceRange.max);
    }

    // Apply weight range filters
    if (weightRange.min) {
      filters.minWeight = parseFloat(weightRange.min);
    }
    if (weightRange.max) {
      filters.maxWeight = parseFloat(weightRange.max);
    }

    // Apply airline filter
    if (selectedAirline) {
      filters.airlineId = parseInt(selectedAirline);
    }

    return filters;
  }, [urlParams, selectedFilters, priceRange, weightRange, selectedAirline]);

  // Fetch initial results when filters change
  useEffect(() => {
    const controller = new AbortController();
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      setCurrentPage(1);
      try {
        const filters = buildFilters();
        filters.page = 1;

        const apiRes = await getDemandAndTravel(filters);
        let items = Array.isArray(apiRes) ? apiRes : (apiRes?.items ?? []);
        const responseMeta = apiRes?.meta;

        // Apply client-side sorting for "lowest-price"
        if (selectedFilters.includes("lowest-price")) {
          items = [...items].sort(
            (a, b) => (a.pricePerKg || 0) - (b.pricePerKg || 0)
          );
        }

        // Apply client-side sorting for "travel-date"
        if (selectedFilters.includes("travel-date")) {
          items = [...items].sort(
            (a, b) =>
              new Date(a.deliveryDate).getTime() -
              new Date(b.deliveryDate).getTime()
          );
        }

        setResults(items);
        setMeta(responseMeta);
        setHasMore(responseMeta?.hasNextPage ?? false);
      } catch (e: any) {
        setError(e?.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
    return () => controller.abort();
  }, [
    location.search,
    urlParams,
    selectedFilters,
    priceRange,
    weightRange,
    selectedAirline,
    buildFilters,
  ]);

  // Load more results for infinite scroll
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const filters = buildFilters();
      filters.page = currentPage + 1;

      const apiRes = await getDemandAndTravel(filters);
      let items = Array.isArray(apiRes) ? apiRes : (apiRes?.items ?? []);
      const responseMeta = apiRes?.meta;

      // Apply client-side sorting for "lowest-price"
      if (selectedFilters.includes("lowest-price")) {
        items = [...items].sort(
          (a, b) => (a.pricePerKg || 0) - (b.pricePerKg || 0)
        );
      }

      // Apply client-side sorting for "travel-date"
      if (selectedFilters.includes("travel-date")) {
        items = [...items].sort(
          (a, b) =>
            new Date(a.deliveryDate).getTime() -
            new Date(b.deliveryDate).getTime()
        );
      }

      setResults((prev) => [...prev, ...items]);
      setMeta(responseMeta);
      setCurrentPage((prev) => prev + 1);
      setHasMore(responseMeta?.hasNextPage ?? false);
    } catch (e: any) {
      console.error("Failed to load more results:", e);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, currentPage, buildFilters, selectedFilters]);

  // Infinite scroll hook
  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: hasMore && !loading,
    loading: loadingMore,
    threshold: 200,
  });

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleAlertClick = () => {
    if (!isLoggedIn) {
      openRegister();
    } else {
      setAlertDialogOpen(true);
    }
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setPriceRange({ min: "", max: "" });
    setWeightRange({ min: "", max: "" });
    setSelectedAirline(null);
    // Reset the SearchFiltersBar component
    searchFiltersRef.current?.reset();
    navigate(`/annonces`);
  };

  return (
    <div className="min-h-screen relative">
      <Header />

      <main className="mx-auto relative max-w-7xl py-4 md:py-8 px-4">
        {/* Search Bar */}
        <div className="sticky bg-white z-10 top-16 md:top-20 pt-4 md:pt-10 left-0 w-full">
          <SearchFiltersBar
            ref={searchFiltersRef}
            initialFrom={searchParams.from}
            initialTo={searchParams.to}
            initialFlight={searchParams.flight}
            initialWeight={0}
            onChange={(f) =>
              setSearchParams({
                from: f.from,
                to: f.to,
                date: f.date,
                flight: f.flight,
              })
            }
          />
        </div>

        {/* Main Content with Filters and Results */}
        <div className="flex flex-col lg:flex-row relative gap-4 md:gap-8 mt-6 md:mt-10">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div
              className={`lg:sticky lg:top-24 bg-gray-100 rounded-2xl p-4 md:p-6 border border-gray-200 lg:max-h-[calc(100vh-7rem)] ${results.length === 0 && "h-full"} lg:overflow-y-auto`}
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                {results.length > 0 ? (
                  <button className="bg-blue-100/30 text-blue-700 px-3 md:px-4 py-2 rounded-lg text-xs md font-medium">
                    Filtrer par
                  </button>
                ) : (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs md text-gray-100"
                    disabled={true}
                  >
                    Tout effacer
                  </button>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs md text-gray-500 hover "
                >
                  Tout effacer
                </button>
              </div>

              {/* Filtrer non disponible button */}
              {results.length === 0 ? (
                <div className="mb-3 md:mb-4">
                  <button className="w-full text-left px-3 md:px-4 py-2 text-xs md text-blue-600 border border-blue-200 rounded-lg hover/20 transition-colors">
                    Filtre non disponible
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 md:space-y-3">
                    {filters.map((filter) => {
                      // Si c'est le filtre "airline", afficher le combobox au lieu du checkbox
                      if (filter.id === "airline") {
                        return (
                          <div key={filter.id} className="mt-3 md:mt-4">
                            <AirlineComboBox
                              label={filter.label}
                              value={selectedAirline || ""}
                              onChange={(airline: Airline | null) => {
                                setSelectedAirline(
                                  airline ? String(airline.id) : null
                                );
                              }}
                              placeholder="Rechercher une compagnie"
                            />
                          </div>
                        );
                      }

                      return (
                        <label
                          key={filter.id}
                          className="flex items-center space-x-2 md:space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(filter.id)}
                            onChange={() => handleFilterChange(filter.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500:ring-blue-600 focus:ring-2 rounded"
                          />
                          <span className="text-xs md text-gray-700">
                            {filter.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Price Range Filter */}
                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                    <h4 className="text-xs md font-medium text-gray-900 mb-2 md:mb-3">
                      Prix par kg (€)
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: e.target.value,
                          }))
                        }
                        className="w-full px-2 md:px-3 py-2 text-xs md border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: e.target.value,
                          }))
                        }
                        className="w-full px-2 md:px-3 py-2 text-xs md border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Weight Range Filter */}
                  <div className="mt-3 md:mt-4">
                    <h4 className="text-xs md font-medium text-gray-900 mb-2 md:mb-3">
                      Poids (kg)
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={weightRange.min}
                        onChange={(e) =>
                          setWeightRange((prev) => ({
                            ...prev,
                            min: e.target.value,
                          }))
                        }
                        className="w-full px-2 md:px-3 py-2 text-xs md border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={weightRange.max}
                        onChange={(e) =>
                          setWeightRange((prev) => ({
                            ...prev,
                            max: e.target.value,
                          }))
                        }
                        className="w-full px-2 md:px-3 py-2 text-xs md border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Section - Results Grid */}
          <div className="flex-1 w-full">
            {loading && (
              <div className="text-sm text-gray-500 text-center py-8">
                Chargement…
              </div>
            )}
            {error && (
              <div className="text-sm text-red-600 text-center py-8">
                {error}
              </div>
            )}
            {!loading && !error && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                {/* Empty state illustration */}
                <div className="mb-8">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    fill="none"
                    className="text-blue-500"
                  >
                    {/* Suitcase body */}
                    <rect
                      x="25"
                      y="45"
                      width="70"
                      height="50"
                      rx="8"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    {/* Suitcase handle */}
                    <path
                      d="M45 45V35C45 30 48 27 53 27H67C72 27 75 30 75 35V45"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    {/* Suitcase lock */}
                    <rect
                      x="57"
                      y="60"
                      width="6"
                      height="8"
                      rx="1"
                      fill="currentColor"
                    />
                    {/* Sad face */}
                    <circle cx="50" cy="75" r="2" fill="currentColor" />
                    <circle cx="70" cy="75" r="2" fill="currentColor" />
                    <path
                      d="M45 85C45 85 52 80 60 80C68 80 75 85 75 85"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Empty state text */}
                <div className="text-center max-w-md px-4">
                  <h3 className="text-lg md font-semibold text-gray-900 mb-2">
                    Nous n'avons trouvé aucun bagage disponible
                  </h3>
                  <p className="text-base md text-gray-600 mb-1">
                    pour ce vol... encore !
                  </p>
                  <p className="text-xs md text-gray-500 mb-6 md:mb-8">
                    Activez une alerte, nous vous préviendrons
                    <br />
                    dès qu'une offre correspond.
                  </p>

                  {/* Alert button */}
                  <button
                    onClick={handleAlertClick}
                    className="bg-blue-600 hover text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md font-medium transition-colors"
                  >
                    Activer une alerte
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {results.map((item: any) => {
                    const id =
                      item.id?.toString() ||
                      Math.random().toString(36).slice(2);
                    const name =
                      item.user?.fullName || item.title || "Voyageur";
                    const avatar =
                      item.user?.selfieImage ||
                      item.images?.[0]?.fileUrl ||
                      "/favicon.ico";
                    const originName = item.departureAirport?.name || "";
                    const destName = item.arrivalAirport?.name || "";
                    const route = `${originName} - ${destName}`;
                    const pricePerKg = item.pricePerKg ?? 0;
                    const rating = item.user.rating; // Default rating since it's not in the new structure

                    // Pour les transporteurs (travel), utiliser le logo de la compagnie
                    // Pour les voyageurs (demand), utiliser la première image de l'annonce
                    const image =
                      item.type === "travel"
                        ? item.airline?.logoUrl || avatar
                        : item.images?.[0]?.fileUrl || avatar;

                    const featured = Boolean(item.user?.isVerified);

                    // Use weightAvailable for travel type, weight for demand type
                    const availableWeight =
                      item.type === "travel"
                        ? (item.weightAvailable ?? 0)
                        : (item.weight ?? 0);

                    const departure = item.deliveryDate
                      ? formatDate(item.deliveryDate)
                      : undefined;

                    const airline = item.airline?.name;
                    const type =
                      item.type === "travel" ? "transporter" : "traveler";

                    return (
                      <AnnounceCard
                        key={id}
                        id={id}
                        fullName={name}
                        avatar={avatar}
                        location={route}
                        price={`${pricePerKg}`}
                        rating={rating}
                        image={image}
                        featured={featured}
                        weight={
                          availableWeight ? `${availableWeight}kg` : undefined
                        }
                        departure={departure}
                        airline={airline}
                        type={type as any}
                        isBookmarked={item.isBookmarked}
                        userId={item.user?.id}
                        currencySymbol={item.currency?.symbol || "€"}
                      />
                    );
                  })}
                </div>

                {/* Infinite scroll sentinel */}
                {hasMore && (
                  <div ref={sentinelRef} className="w-full py-8 min-h-[100px]">
                    {loadingMore && (
                      <div className="flex justify-center items-center gap-2">
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
                {!hasMore && results.length > 0 && (
                  <div className="w-full py-8">
                    <p className="text-center text-sm text-gray-500">
                      Vous avez vu toutes les annonces disponibles
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Create Alert Dialog */}
      <CreateAlertDialog
        open={alertDialogOpen}
        onClose={() => setAlertDialogOpen(false)}
        initialData={{
          from: searchParams.from,
          to: searchParams.to,
          date: searchParams.date,
          flight: searchParams.flight,
        }}
        onSuccess={() => {
          // Optionally refresh results or show a success message
          console.log("Alert created successfully");
        }}
      />

      {/* Quotes section (does not change the existing layout) */}
      {(quotes.length > 0 || quotesError) && (
        <section className="mx-auto max-w-7xl px-4 pb-10">
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quotesError && (
              <div className="col-span-full text-sm text-red-600">
                {quotesError}
              </div>
            )}
            {quotes.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-gray-200 bg-white p-4"
              >
                <p className="text-gray-800 text-sm">
                  {q.quote}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {q.author || "Anonyme"}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <FooterMinimal />
    </div>
  );
}
