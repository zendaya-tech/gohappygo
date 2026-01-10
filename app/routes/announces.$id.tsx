import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Route } from "../+types/root";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import FooterMinimal from "~/components/FooterMinimal";
import { ShareIcon } from "@heroicons/react/24/outline";
import BookingDialog from "~/components/common/dialog/BookingDialog";
import MessageDialog from "~/components/common/dialog/MessageDialog";
import ShareDialog from "~/components/common/dialog/ShareDialog";
import CreateAnnounceDialog from "~/components/common/dialog/CreateAnnounceDialog";
import AlertDialog from "~/components/common/dialog/AlertDialog";
import { getAnnounceByIdAndType, type DemandTravelItem } from "~/services/announceService";
import { getRandomQuotes, type Quote } from "~/services/quotesService";
import { useAuthStore, type AuthState } from "~/store/auth";
import { createRequestToTravel, type CreateRequestToTravelPayload } from "~/services/requestService";
import type { BookingCardData } from "~/components/common/dialog/BookingDialog";
import { calculatePricing, type PricingCalculationResponse } from "~/services/pricingService";
import { addBookmark, removeBookmark, checkIfBookmarked } from "~/services/bookmarkService";

// Reviews are now fetched from the API

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AnnounceDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id") ?? "";
  const type = (searchParams.get("type") as "demand" | "travel") ?? "travel";

  const [listing, setListing] = useState<DemandTravelItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [kilos, setKilos] = useState<number>(0);
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [bookOpen, setBookOpen] = useState<boolean>(false);
  const [sliderOpen, setSliderOpen] = useState<boolean>(false);
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(0);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quotesError, setQuotesError] = useState<string | null>(null);
  const [pricingData, setPricingData] = useState<PricingCalculationResponse | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState<{
    serviceFee: boolean;
    vat: boolean;
    insurance: boolean;
  }>({
    serviceFee: false,
    vat: false,
    insurance: false,
  });
  
  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  }>({
    open: false,
    title: "",
    message: "",
    type: "success",
  });
  
  // Import auth store to check if user owns this announce
  const currentUser = useAuthStore((s: AuthState) => s.user);
  const isLoggedIn = useAuthStore((s: AuthState) => s.isLoggedIn);
  const isOwnAnnounce = Boolean(currentUser && listing && listing.user?.id === Number(currentUser.id));
  
  // Helper function to show alert dialog
  const showAlert = (title: string, message: string, type: "success" | "error" | "warning") => {
    setAlertDialog({
      open: true,
      title,
      message,
      type,
    });
  };

  // Handle bookmark toggle
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior

    // If user is not logged in, show login prompt
    if (!isLoggedIn) {
      showAlert(
        "Connexion requise",
        "Vous devez être connecté pour ajouter aux favoris.",
        "warning"
      );
      return;
    }

    if (isBookmarkLoading || !listing) return;

    setIsBookmarkLoading(true);

    try {
      const bookmarkType = type === "travel" ? "TRAVEL" : "DEMAND";
      const itemId = Number(id);

      if (isFavorite) {
        // Remove bookmark
        await removeBookmark(bookmarkType, itemId);
        setIsFavorite(false);
      } else {
        // Add bookmark
        const bookmarkData: any = {
          bookmarkType: bookmarkType as "TRAVEL" | "DEMAND",
        };

        if (bookmarkType === "TRAVEL") {
          bookmarkData.travelId = itemId;
        } else {
          bookmarkData.demandId = itemId;
        }

        await addBookmark(bookmarkData);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };
  
  // Use real reviews from listing
  const reviews = useMemo(() => {
    if (!listing?.reviews) return [];
    return listing.reviews.map((review) => ({
      id: review.id,
      rating: parseFloat(review.rating) || 0,
      name: `${review.reviewer?.fullName}` || "Anonyme",
      avatar: review.reviewer?.profilePictureUrl || "/favicon.ico",
      comment: review.comment || "",
      createdAt: review.createdAt,
    }));
  }, [listing?.reviews]);
  
  // Format user name from firstName and lastName
  const userName = useMemo(() => {
    if (!listing?.user) return "Voyageur";
    const { firstName, lastName,fullName } = listing.user;
    if (fullName) {
      return fullName;
    }
    return firstName +" "+ lastName ;
  }, [listing?.user]);
  
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    : 0;
  const totalReviews = reviews.length;

  useEffect(() => {
    const fetchAnnounce = async () => {
      if (!id || !type) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const announce = await getAnnounceByIdAndType(id, type);
        setListing(announce);
      } catch (error) {
        console.error("Error fetching announce:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnounce();
  }, [id, type]);

  // Update meta tags dynamically when listing data is loaded
  useEffect(() => {
    if (listing && typeof document !== 'undefined') {
      const title = `${listing.departureAirport?.name || "Départ"} → ${listing.arrivalAirport?.name || "Arrivée"} - ${listing.pricePerKg} €/kg - GoHappyGo`;
      const description = `${type === "travel" ? "Voyage" : "Demande"} de ${userName} : ${listing.description || "Transport de bagages disponible"}`;
      const imageUrl = listing.images?.[0]?.fileUrl || listing.user?.profilePictureUrl || "https://gohappygo.com/og-image.jpg";
      const url = window.location.href;

      // Update document title
      document.title = title;

      // Update or create meta tags
      const updateMetaTag = (selector: string, content: string) => {
        let meta = document.querySelector(selector) as HTMLMetaElement;
        if (meta) {
          meta.content = content;
        } else {
          meta = document.createElement('meta');
          if (selector.includes('property=')) {
            meta.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
          } else {
            meta.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
          }
          meta.content = content;
          document.head.appendChild(meta);
        }
      };

      // Update meta tags
      updateMetaTag('meta[name="description"]', description);
      updateMetaTag('meta[property="og:title"]', title);
      updateMetaTag('meta[property="og:description"]', description);
      updateMetaTag('meta[property="og:image"]', imageUrl);
      updateMetaTag('meta[property="og:url"]', url);
      updateMetaTag('meta[name="twitter:title"]', title);
      updateMetaTag('meta[name="twitter:description"]', description);
      updateMetaTag('meta[name="twitter:image"]', imageUrl);
    }
  }, [listing, type, userName]);

  useEffect(() => {
    const loadQuotes = async () => {
      const res = await getRandomQuotes();
      if (!res) {
        setQuotesError("Impossible de charger les citations.");
        setQuotes([]);
        return;
      }
      setQuotes(res);
    };
    loadQuotes();
  }, []);

  // Calculate pricing when weight or listing changes
  useEffect(() => {
    const calculatePrice = async () => {
      if (!listing || type !== "travel") {
        setPricingData(null);
        return;
      }

      setPricingLoading(true);
      try {
        const pricing = await calculatePricing(kilos, Number(id));
        setPricingData(pricing);
      } catch (error) {
        console.error("Error calculating pricing:", error);
        // Fallback calculation if API fails
        const subtotal = kilos * (listing.pricePerKg || 0);
        const serviceFee = subtotal * 0.05; // 5% service fee
        const vatRate = 0.20; // 20% VAT
        const vat = subtotal * vatRate;
        const insurance = 0; // Insurance is free
        const platformTax = 0; // No platform tax
        const total = subtotal + serviceFee + vat + insurance + platformTax;
        
        setPricingData({
          travelerPayment: subtotal,
          fee: serviceFee,
          tvaAmount: vat,
          totalAmount: total
        });
      } finally {
        setPricingLoading(false);
      }
    };

    calculatePrice();
  }, [kilos, listing, type, id]);

  // Check bookmark status when listing loads
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!listing || !isLoggedIn) {
        setIsFavorite(false);
        return;
      }

      try {
        const bookmarkType = type === "travel" ? "TRAVEL" : "DEMAND";
        const bookmarkStatus = await checkIfBookmarked(bookmarkType, Number(id));
        setIsFavorite(bookmarkStatus);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
        setIsFavorite(false);
      }
    };

    checkBookmarkStatus();
  }, [listing, isLoggedIn, type, id]);

  // Simple gallery to mirror the design - Always 3 images
  const galleryImages = useMemo(() => {
    if (!listing) return ["/logo.png", "/logo.png", "/logo.png"];
    const images = listing.images?.map(img => img.fileUrl) || [];
    
    if (type === "travel") {
      // Pour les voyages: logo de la compagnie + images
      const travelImages = [];
      
      // Image principale (logo de la compagnie ou première image)
      travelImages.push(listing.airline?.logoUrl || images[0] || "/logo.png");
      
      // Deuxième image
      travelImages.push(images[0] || "/logo.png");
      
      // Troisième image
      travelImages.push(images[1] || "/logo.png");
      
      return travelImages;
    } else {
      // Pour les demandes: toujours 3 images avec placeholders si nécessaire
      const demandImages = [];
      
      demandImages.push(images[0] || "/logo.png");
      demandImages.push(images[1] || "/logo.png");
      demandImages.push(images[2] || "/logo.png");
      
      return demandImages;
    }
  }, [listing, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Skeleton loader */}
            <div className="animate-pulse">
              {/* Gallery skeleton */}
              <div className="flex h-[400px] gap-4 mb-6">
                <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div className="w-80 flex flex-col gap-3">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                  {/* User info skeleton */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                    </div>
                  </div>

                  {/* Route info skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                  </div>

                  {/* Description skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  </div>
                </div>

                {/* Sidebar skeleton */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-96"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <FooterMinimal />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Annonce introuvable
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Vérifiez l'identifiant ou retournez à la liste des annonces.
            </p>
            <Link
              to="/annonces"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Retour aux annonces
            </Link>
          </div>
        </main>
        <FooterMinimal />
      </div>
    );
  }

  // Pricing calculation using API data
  const pricePerKg = listing?.pricePerKg || 0;
  const total = pricingData?.totalAmount || 0;
  const currencySymbol = listing?.currency?.symbol || "€"; // Fallback to Euro if no currency

  const availableWeight = type === "travel" ? listing.weightAvailable : listing.weight;

  const handleBookingConfirm = async (cardData: BookingCardData) => {

    if (!currentUser) {
      setBookOpen(false);
      showAlert(
        "Connexion requise",
        "Vous devez être connecté pour réserver un voyage.",
        "warning"
      );
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (type !== "travel") {
      setBookOpen(false);
      showAlert(
        "Type d'annonce invalide",
        "Vous ne pouvez réserver que des voyages.",
        "error"
      );
      return;
    }

    if (kilos < 0) {
      setBookOpen(false);
      showAlert(
        "Poids invalide",
        "Veuillez entrer un poids valide supérieur ou égal à 0.",
        "warning"
      );
      return;
    }

    if (kilos > (availableWeight || 0)) {
      setBookOpen(false);
      showAlert(
        "Capacité insuffisante",
        `Le poids demandé (${kilos}kg) dépasse la capacité disponible (${availableWeight || 0}kg).`,
        "warning"
      );
      return;
    }

    try {
      const payload: CreateRequestToTravelPayload = {
        travelId: Number(id),
        requestType: 'GoAndGo',
        weight: kilos,
        paymentMethodId: cardData.paymentMethodId,
      };

      const response = await createRequestToTravel(payload);
      setBookOpen(false);
      
      // Show success message
      showAlert(
        "Réservation réussie!",
        `Votre demande #${response.id} a été créée avec succès.`,
        "success"
      );
      
      // Reset kilos
      setKilos(0);
      
      // Optionally refresh the listing to update available weight
      const updatedListing = await getAnnounceByIdAndType(id, type);
      if (updatedListing) {
        setListing(updatedListing);
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      const errorMessage = error?.message || "Une erreur est survenue lors de la réservation";
      setBookOpen(false);
      showAlert(
        "Erreur de réservation",
        errorMessage,
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">


        {/* Left: media + traveller + route + description */}
        <div>
          {/* top right small action */}
          <div className="flex items-center justify-end text-xs sm:text-sm text-gray-500 mb-3 gap-2 sm:gap-3">
            <button
              className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600"
              onClick={() => setShareOpen(true)}
            >
              <ShareIcon className="h-4 w-4" />
              Partager
            </button>
            {!isOwnAnnounce && (
              <button
                onClick={handleFavoriteClick}
                disabled={isBookmarkLoading}
                className={`inline-flex items-center gap-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFavorite
                    ? "text-red-500"
                    : "text-gray-500 hover:text-rose-600"
                }`}
              >
                {isBookmarkLoading ? (
                  <svg
                    className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 transition-colors duration-200"
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                    />
                  </svg>
                )}
                {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              </button>
            )}
            
            {isOwnAnnounce && (
              <div className="inline-flex items-center gap-2 text-gray-500">
                <span className="text-sm font-medium">Votre annonce</span>
              </div>
            )}
          </div>

          {/* Gallery with hover effects - Always 3 images */}
          <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            <div className="flex flex-col md:flex-row h-auto md:h-[400px] gap-3 md:gap-4">
              {/* Image principale */}
              <div className="flex-1 h-[300px] md:h-full">
                <div
                  className="relative w-full h-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 cursor-pointer group transition-all duration-300 hover:shadow-lg"
                  onClick={() => {
                    setCurrentImageIndex(0);
                    setSliderOpen(true);
                  }}
                >
                  <img
                    src={galleryImages[0]}
                    alt="Image principale"
                    className={`h-full w-full transition-transform duration-300 group-hover:scale-110 ${
                      type === "travel" && galleryImages[0] === listing.airline?.logoUrl 
                        ? "object-contain p-8" 
                        : "object-cover"
                    }`}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-all duration-300 rounded-xl"></div>
                </div>
              </div>
              
              {/* Images secondaires - toujours 2 images */}
              <div className="w-full md:w-80 flex flex-row md:flex-col gap-3 h-[120px] md:h-full">
                {/* Deuxième image */}
                <div
                  className="relative flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={() => {
                    setCurrentImageIndex(1);
                    setSliderOpen(true);
                  }}
                >
                  <img
                    src={galleryImages[1]}
                    alt="Image 2"
                    className="h-full w-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-all duration-300 rounded-xl"></div>
                </div>
                
                {/* Troisième image */}
                <div
                  className="relative flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={() => {
                    setCurrentImageIndex(2);
                    setSliderOpen(true);
                  }}
                >
                  <img
                    src={galleryImages[2]}
                    alt="Image 3"
                    className="h-full w-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-all duration-300 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mt-6">
            <div className="lg:col-span-2">
              {/* Traveller bar */}
              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={listing.user?.profilePictureUrl || "/favicon.ico"}
                    alt={userName}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-900 shadow"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {userName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {averageRating > 0 ? `Note ${averageRating.toFixed(1)}` : "Pas encore noté"} •{" "}
                      {listing.user?.isVerified ? "Vérifié" : "Non vérifié"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => navigate(`/profile?user=${listing.user?.id}`)}
                    disabled={isOwnAnnounce}
                    className={`rounded-lg px-4 sm:px-5 py-2 text-sm font-semibold shadow-sm transition-colors duration-200 flex-1 sm:flex-none ${
                      isOwnAnnounce
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setMessageOpen(true)}
                    disabled={isOwnAnnounce}
                    className={`rounded-lg border px-4 sm:px-5 py-2 text-sm font-medium transition-colors duration-200 flex-1 sm:flex-none ${
                      isOwnAnnounce
                        ? "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    Message
                  </button>
                </div>
              </div>

              {/* Route line */}
              <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs sm:text-sm">
                <div className="md:col-span-9">
                  <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-2 text-gray-700 dark:text-gray-300">
                    <span className="font-medium">
                      {listing.departureAirport?.name || "Départ"} → {listing.arrivalAirport?.name || "Arrivée"}
                    </span>
                    <span>Départ: {formatDate(listing.departureDatetime || listing.travelDate || listing.deliveryDate || new Date().toISOString())}</span>
                    {type === "travel" && (
                      <>
                        <span className="font-medium">
                          Vol N° {listing.flightNumber}
                        </span>
                        {listing.airline?.name && (
                          <span className="text-gray-600 dark:text-gray-400">
                            {listing.airline.name}
                          </span>
                        )}
                      </>
                    )}
                    <span className="text-blue-600">
                      {type === "travel"
                        ? "Espace disponible"
                        : "Espace demandé"}
                      : {availableWeight}kg
                    </span>
                  </div>
                </div>
                <div className="md:col-span-3 text-left md:text-right mt-2 md:mt-0">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {listing.pricePerKg} {currencySymbol}/Kilo
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 mb-12">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {listing.description || "Description non disponible"}
                </p>
              </div>

              {/* Badges - Grid 2x2 - Only show for travels */}
              {type === "travel" && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* Reservation type badge */}
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <img 
                      src="/images/badges/multiple.jpeg" 
                      alt="Type de réservation" 
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="flex-1">
                      {listing.isSharedWeight 
                        ? "peut prendre des kilos de plusieurs voyageurs" 
                        : "accepte qu'une personne pour tous les kilos"
                      }
                    </span>
                  </div>

                  {/* Punctuality badge */}
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <img 
                      src="/images/badges/ponctuel.jpeg" 
                      alt="Ponctualité" 
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="flex-1">
                      {listing.punctualityLevel ? "très ponctuel" : "ponctuel"}
                    </span>
                  </div>

                  {/* Extra weight badge */}
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <img 
                      src="/images/badges/kilos_trop.jpeg" 
                      alt="Poids supplémentaire" 
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="flex-1">
                      {listing.isAllowExtraWeight 
                        ? "accepte quelques grammes en trop" 
                        : "n'accepte pas de grammes en trop"
                      }
                    </span>
                  </div>

                  {/* Booking type badge */}
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <img 
                      src="/images/badges/reservation.jpeg" 
                      alt="Type de confirmation" 
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="flex-1">
                      la réservation sera confirmée {listing.isInstant ? "instantanément" : "par l'HappyVoyageur"}
                    </span>
                  </div>
                </div>
              )}

              {/* Capacity bar */}
              {/* <div className="mt-6 space-y-2">
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                    <div className={`h-full rounded-full ${availableRatio > 0.5 ? "bg-green-500" : availableRatio > 0.2 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${availablePercent}%` }} />
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Capacité restante: {listing.availableWeight}kg / {listing.maxWeight}kg ({availablePercent}%)</div>
                            </div> */}

              {/* Bottom reviews-like section */}
              <div className="mt-14   mb-14">
                {/* <div className="flex items-center justify-between mb-2"> */}
                {/* <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Add a review</h3> */}
                {/* Interactive stars */}
                {/* <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <button
                                                key={i}
                                                onClick={() => setNewRating(i)}
                                                className="p-0.5"
                                                aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
                                            >
                                                <svg className={`h-5 w-5 ${i <= newRating ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.176 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.293z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div> */}
                {/* <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">You will not be able to edit your review</p> */}
                {/* <div className="rounded-2xl   flex items-center justify-between gap-3">
                                    <input placeholder="Write your review..." className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    <button className="rounded-lg bg-blue-600 text-white px-5 py-3 font-semibold hover:bg-blue-700">Post a review</button>
                                </div> */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {reviews.length} Commentaire{reviews.length > 1 ? 's' : ''}
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i <= Math.round(averageRating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.176 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.293z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500">
                        ({totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col mt-10 gap-5">
                    {reviews.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Aucun commentaire pour le moment
                      </div>
                    ) : (
                      reviews.map((review: any) => {
                        const reviewDate = review.createdAt 
                          ? new Date(review.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "";
                        
                        return (
                          <div
                            key={review.id}
                            className="flex items-start gap-3"
                          >
                            <img
                              src={review.avatar}
                              alt="avatar"
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {review.name} • {reviewDate}
                              </div>
                              <p className="mt-1 text-gray-800 dark:text-gray-200">
                                {review.comment}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i <= review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.176 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.293z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: booking summary */}
            <aside className="lg:col-span-1 order-first lg:order-last">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sticky top-20">
                {type === "travel" ? (
                  <>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {listing.pricePerKg} {currencySymbol}/Kilo
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                      Prix par kilogramme
                    </div>

                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter n° Kilo
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={kilos === 0 ? "" : kilos}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || value === "0") {
                          setKilos(0);
                        } else {
                          // Remove leading zeros and convert to number
                          const cleanValue = value.replace(/^0+/, '') || '0';
                          const numValue = Number(cleanValue);
                          if (!isNaN(numValue) && numValue >= 0) {
                            setKilos(numValue);
                          }
                        }
                      }}
                      placeholder="0"
                      className="mb-6 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    {pricingLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : pricingData ? (
                      <>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                            <span>Frais de service</span>
                            <div className="flex items-center gap-2">
                              <span>{pricingData.fee.toFixed(2)} {currencySymbol}</span>
                              <div className="relative">
                                <button 
                                  className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-100"
                                  onMouseEnter={() => setTooltipVisible(prev => ({ ...prev, serviceFee: true }))}
                                  onMouseLeave={() => setTooltipVisible(prev => ({ ...prev, serviceFee: false }))}
                                >
                                  ?
                                </button>
                                {tooltipVisible.serviceFee && (
                                  <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                                    <div className="font-semibold mb-1">Frais de service GoHappyGo</div>
                                    <div>Ces frais couvrent le traitement sécurisé de votre paiement, le support client 24/7, et la garantie de transaction.</div>
                                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                            <span>TVA 20%</span>
                            <div className="flex items-center gap-2">
                              <span>{pricingData.tvaAmount.toFixed(2)} {currencySymbol}</span>
                              <div className="relative">
                                <button 
                                  className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-100"
                                  onMouseEnter={() => setTooltipVisible(prev => ({ ...prev, vat: true }))}
                                  onMouseLeave={() => setTooltipVisible(prev => ({ ...prev, vat: false }))}
                                >
                                  ?
                                </button>
                                {tooltipVisible.vat && (
                                  <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                                    <div className="font-semibold mb-1">Taxe sur la Valeur Ajoutée</div>
                                    <div>TVA française de 20% appliquée conformément à la réglementation fiscale en vigueur sur les services numériques.</div>
                                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <span>Assurance Protection</span>
                                <span>Juridique Internationale</span>
                              </div>
                              <img 
                                src="/images/axa-logo.svg" 
                                alt="AXA" 
                                className="h-6 w-6 rounded object-contain"
                                onError={(e) => {
                                  // Fallback if image doesn't exist
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 font-semibold">Offert !</span>
                              <div className="relative">
                                <button 
                                  className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-100"
                                  onMouseEnter={() => setTooltipVisible(prev => ({ ...prev, insurance: true }))}
                                  onMouseLeave={() => setTooltipVisible(prev => ({ ...prev, insurance: false }))}
                                >
                                  ?
                                </button>
                                {tooltipVisible.insurance && (
                                  <div className="absolute bottom-full right-0 mb-2 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                                    <div className="font-semibold mb-1">Assurance Protection Juridique AXA</div>
                                    <div>Protection juridique internationale offerte par AXA. Couvre les litiges liés au transport, assistance juridique 24/7, et remboursement des frais de justice jusqu'à 15 000€.</div>
                                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              Total with taxes
                            </span>
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                              {pricingData.totalAmount.toFixed(2)} {currencySymbol}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Chargement du calcul des prix...
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {quotesError && (
                      <div className="text-xs text-red-600 mb-2">
                        {quotesError}
                      </div>
                    )}
                    {quotes.map((q, index) => {
                      const fontClass = q.fontFamily
                        ? `font-${q.fontFamily.toLowerCase()}`
                        : "";
                      const isEven = index % 2 === 0;
                      const alignmentClass = isEven ? "ml-auto" : "mr-auto";

                      // Adjust text size based on font family
                      const textSizeClass =
                        q.fontFamily === "sacramento"
                          ? "text-base"
                          : q.fontFamily === "cinzel"
                          ? "text-xs font-medium"
                          : q.fontFamily === "playfair"
                          ? "text-sm"
                          : "text-xs";

                      return (
                        <div
                          key={q.id}
                          className={`text-gray-700 my-4 w-[80%] min-w-52 text-center dark:text-gray-300 max-w-60  ${alignmentClass}`}
                        >
                          <p
                            className={`text-gray-700 dark:text-gray-300 ${fontClass} ${textSizeClass} ${alignmentClass}`}
                          >
                            {"<< " + q.quote + " >>"}
                          </p>
                          <span
                            className={`text-gray-900 text-sm dark:text-gray-300 font-semibold block mt-2 ${alignmentClass}`}
                          >
                            {q.author || "Anonyme"}
                          </span>
                        </div>
                      );
                    })}
                  </>
                )}

                {type === "travel" ? (
                  <button
                    onClick={() => setBookOpen(true)}
                    disabled={isOwnAnnounce || !pricingData}
                    className={`mt-6 w-full rounded-lg px-4 py-4 text-sm font-semibold transition-colors duration-200 ${
                      isOwnAnnounce
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : !pricingData
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isOwnAnnounce ? "Votre voyage" : `Payer ${total.toFixed(2)} ${currencySymbol}`}
                  </button>
                ) : (
                  !isOwnAnnounce && (
                    <button
                      onClick={() => setCreateOpen(true)}
                      className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-4 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Créer ce voyage
                    </button>
                  )
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
      {/* Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        listing={{
          title: `Voyage ${listing.departureAirport?.name} → ${listing.arrivalAirport?.name}`,
          location: `${listing.departureAirport?.name}, ${listing.arrivalAirport?.name}`,
          rating: averageRating,
          bedrooms: 1,
          beds: 1,
          bathrooms: 1,
          image: listing.user?.profilePictureUrl || "/favicon.ico",
        }}
      />
      {/* Booking Dialog */}
      <BookingDialog
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        amount={total}
        currencySymbol={currencySymbol}
        email={currentUser?.email || ""}
        onConfirm={handleBookingConfirm}
      />

      {/* Message Dialog */}
      <MessageDialog
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        title={`${listing.departureAirport?.name} → ${listing.arrivalAirport?.name}`}
        hostName={userName}
        hostAvatar={listing.user?.profilePictureUrl || "/favicon.ico"}
        onSend={(msg) => {
          console.log("Message sent:", msg);
        }}
      />

      {/* Create Announce Dialog (prefilled) */}
      <CreateAnnounceDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        initialData={{
          departure: {
            id: listing.departureAirportId?.toString() || "",
            code: "",
            name: listing.departureAirport?.name || "",
            city: listing.departureAirport?.municipality || "",
            country: listing.departureAirport?.isoCountry || "",
          },
          arrival: {
            id: listing.arrivalAirportId?.toString() || "",
            code: "",
            name: listing.arrivalAirport?.name || "",
            city: listing.arrivalAirport?.municipality || "",
            country: listing.arrivalAirport?.isoCountry || "",
          },
          story: "", // Ne pas pré-remplir la description car c'est un autre utilisateur
          kilos: availableWeight,
          pricePerKg: listing.pricePerKg,
          travelDate: (() => {
            try {
              const dateStr = listing.departureDatetime || listing.travelDate || listing.deliveryDate;
              if (!dateStr) return "";
              const d = new Date(dateStr);
              if (Number.isNaN(d.getTime())) return "";
              return d.toISOString().slice(0, 10);
            } catch {
              return "";
            }
          })(),
          airline: listing.airline,
          flightNumber: listing.flightNumber,
          reservationType: listing.isSharedWeight ? "shared" : "single",
          bookingType: listing.isInstant ? "instant" : "non-instant",
          allowExtraGrams: Boolean(listing.isAllowExtraWeight),
        }}
      />

      {/* Image Slider Modal */}
      {sliderOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={() => setSliderOpen(false)}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous button */}
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? galleryImages.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === galleryImages.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Main image */}
            <div className="max-w-4xl overflow-hidden rounded-lg  w-[640px] h-full max-h-[500px] flex items-center justify-center bg-gray-900 dark:bg-gray-800 rounded-lg">
              <img
                src={galleryImages[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className={`max-w-full max-h-full w-full h-full ${
                  type === "travel" && 
                  currentImageIndex === 0 && 
                  galleryImages[0] === listing.airline?.logoUrl 
                    ? "object-contain p-8" 
                    : "object-cover"
                }`}
              />
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>

            {/* Thumbnail navigation */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? "bg-blue-600 dark:bg-white"
                      : "bg-white bg-opacity-50 hover:bg-opacity-75"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog */}
      <AlertDialog
        open={alertDialog.open}
        onClose={() => setAlertDialog(prev => ({ ...prev, open: false }))}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />

      <Footer />
    </div>
  );
}

export const meta: Route.MetaFunction = ({ location }) => {
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id") || "unknown";
  const type = searchParams.get("type") || "travel";
  
  // Create dynamic meta tags based on URL parameters
  const title = `${type === "travel" ? "Voyage" : "Demande"} #${id} - GoHappyGo`;
  const description = `Découvrez cette ${type === "travel" ? "annonce de voyage" : "demande de transport"} sur GoHappyGo. Transport de bagages entre voyageurs.`;
  const url = `https://gohappygo.com${location.pathname}${location.search}`;
  const imageUrl = "https://gohappygo.com/og-image.jpg";
  
  return [
    { title },
    { name: "description", content: description },
    
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "GoHappyGo" },
    { property: "og:locale", content: "fr_FR" },
    
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:creator", content: "@gohappygo" },
    
    // Additional meta
    { name: "keywords", content: `transport bagages, voyage, ${type === "travel" ? "transporteur" : "demande"}, GoHappyGo` },
    { name: "robots", content: "index, follow" },
    { name: "author", content: "GoHappyGo" },
  ];
};
