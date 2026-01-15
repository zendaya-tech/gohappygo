import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import Header from "../components/Header";
import FooterMinimal from "~/components/FooterMinimal";
import ProfileDialog from "../components/common/dialogs/ProfileDialog";
import CreateAnnounceDialog from "~/components/common/dialog/CreateAnnounceDialog";
import CreatePackageDialog from "~/components/common/dialog/CreatePackageDialog";
import EditAnnounceDialog from "~/components/common/dialog/EditAnnounceDialog";
import EditPackageDialog from "~/components/common/dialog/EditPackageDialog";
import ConfirmCancelDialog from "~/components/common/dialog/ConfirmCancelDialog";
import MessageDialog from "~/components/common/dialog/MessageDialog";
import ReviewDialog from "~/components/common/dialog/ReviewDialog";
import ConversationList from "~/components/ConversationList";
import Chat from "~/components/Chat";
import { useAuth } from "~/hooks/useAuth";
import TravelCard from "~/components/TravelCard";
import {
  StarIcon,
  QuestionMarkCircleIcon,
  PaperAirplaneIcon,
  HeartIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import ReservationCard, {
  type Reservation,
} from "~/components/common/ReservationCard";
import ProfileTravelCard, {
  type ProfileTravel,
} from "~/components/common/ProfileTravelCard";
import AnnounceCard from "~/components/AnnounceCard";
import {
  getBookmarks,
  type BookmarkItem,
  getDemandAndTravel,
  getUserDemandsAndTravels,
  deleteDemand as deleteOldDemand,
  type DemandTravelItem,
} from "~/services/announceService";
import {
  getUserTravels,
  deleteTravel,
  type TravelItem,
} from "~/services/travelService";
import { removeBookmark } from "~/services/bookmarkService";
import { getReviews, type Review } from "~/services/reviewService";
import {
  getRequests,
  acceptRequest,
  completeRequest,
  cancelRequest,
  type RequestResponse,
} from "~/services/requestService";
import { getMe, type GetMeResponse } from "~/services/authService";
import {
  getTransactions,
  releaseFunds,
  getBalance,
  type Transaction,
  type Balance,
} from "~/services/transactionService";
import { getOnboardingLink } from "~/services/stripeService";
import {
  getUserDemands,
  deleteDemand,
  type DemandItem,
} from "~/services/demandService";
import ActionCard from "~/components/ActionCard";
import { getUnreadCount } from "~/services/messageService";

interface ProfileSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
}

interface Conversation {
  id: number;
  requestId: number;
  otherUser: {
    id: number;
    name: string;
    avatar: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: number;
  };
  unreadCount: number;
  travel: {
    departureAirport?: { name: string };
    arrivalAirport?: { name: string };
    flightNumber?: string;
  };
}

const ReservationsSection = () => {
  const [tab, setTab] = useState<
    "pending" | "accepted" | "completed" | "cancelled"
  >("pending");
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] =
    useState<RequestResponse | null>(null);
  const [selectedRequester, setSelectedRequester] = useState<{
    name: string;
    avatar: string;
    requestId: number;
  } | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [requestToReview, setRequestToReview] =
    useState<RequestResponse | null>(null);
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("user");
  const { user: currentUser } = useAuth();

  const [isOwnProfile] = useState(
    !userId || (currentUser && userId === currentUser.id?.toString())
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getRequests();
        setRequests(response.items || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await acceptRequest(requestId);
      // Refresh requests
      const response = await getRequests();
      setRequests(response.items || []);
    } catch (error) {
      console.error("Error accepting request:", error);
      setErrorMessage("Erreur lors de l'acceptation de la demande");
    }
  };

  const handleCompleteRequest = async (requestId: number) => {
    try {
      await completeRequest(requestId);
      // Refresh requests
      const response = await getRequests();
      setRequests(response.items || []);
    } catch (error) {
      console.error("Error completing request:", error);
      setErrorMessage("Erreur lors de la finalisation de la demande");
    }
  };

  const handleCancelRequest = async () => {
    if (!requestToCancel) return;

    try {
      await cancelRequest(requestToCancel.id);
      // Refresh requests
      const response = await getRequests();
      setRequests(response.items || []);
      setRequestToCancel(null);
      setCancelConfirmOpen(false);
    } catch (error) {
      console.error("Error canceling request:", error);
      setErrorMessage("Erreur lors de l'annulation de la réservation");
    }
  };

  const handleContactRequester = (
    requesterName: string,
    requesterAvatar: string,
    requestId: number
  ) => {
    setSelectedRequester({
      name: requesterName,
      avatar: requesterAvatar,
      requestId: requestId,
    });
    setMessageDialogOpen(true);
  };

  const handleSendMessage = (message: string) => {
    // TODO: Implement message sending logic
    console.log("Sending message:", message, "to:", selectedRequester?.name);
    // You can add API call here to send the message
  };

  const handleOpenReview = (request: RequestResponse) => {
    setRequestToReview(request);
    setReviewDialogOpen(true);
  };

  const handleReviewSuccess = () => {
    // Refresh requests
    const fetchRequests = async () => {
      try {
        const response = await getRequests();
        setRequests(response.items || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filtered = requests.filter((r) => {
    const status = r.currentStatus?.status?.toUpperCase();
    if (tab === "pending")
      return status === "NEGOTIATING" || status === "PENDING";
    if (tab === "accepted") return status === "ACCEPTED";
    if (tab === "completed") return status === "COMPLETED";
    if (tab === "cancelled") return status === "CANCELLED";
    return false;
  });

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">
        Chargement de vos réservations...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={() => setTab("pending")}
          className={`text-sm font-semibold ${
            tab === "pending"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500"
          }`}
        >
          | Waiting for proposal
        </button>
        <button
          onClick={() => setTab("accepted")}
          className={`text-sm font-semibold ${
            tab === "accepted"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500"
          }`}
        >
          | Waiting for payment
        </button>
        <button
          onClick={() => setTab("completed")}
          className={`text-sm font-semibold ${
            tab === "completed"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500"
          }`}
        >
          | Archived reservations
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-8 flex flex-col items-center">
          <img
            src="/images/noReservations.jpeg"
            alt="No reservations"
            className="w-[50%] h-[50%]"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {filtered.map((request) => {
            const travel = request.travel;
            const requester = request.requester;

            // Data Preparation
            const departureCity = travel?.departureAirport?.name || "Paris";
            const arrivalCity = travel?.arrivalAirport?.name || "New-York";
            const travelDate = travel?.departureDatetime
              ? formatDate(travel.departureDatetime)
              : "";
            const flightNumber = travel?.flightNumber || "N/A";
            const weight = request.weight || 0;

            const pricePerKg =
              typeof travel?.pricePerKg === "string"
                ? parseFloat(travel.pricePerKg)
                : travel?.pricePerKg || 0;

            const price = Number((pricePerKg * weight).toFixed(0));

            const requesterName = requester
              ? `${requester.firstName} ${requester.lastName.charAt(0)}.`
              : "Utilisateur";

            const requesterAvatar =
              (requester as any)?.profilePictureUrl || "/favicon.ico";

            return (
              <ActionCard
                key={request.id}
                id={request.id}
                user={{
                  name: requesterName,
                  avatar: requesterAvatar,
                }}
                image={request.travel?.airline?.logoUrl}
                title={`${departureCity} → ${arrivalCity}`}
                subtitle="Espace réservé"
                dateLabel={travelDate}
                flightNumber={flightNumber}
                weight={weight}
                price={price}
                type="transporter" // For the proper airline logo styling
                // Logic for Status Badges vs Buttons
                statusBadge={
                  request.currentStatus?.status === "COMPLETED"
                    ? "Terminé"
                    : request.currentStatus?.status === "CANCELLED"
                      ? "Annulé"
                      : undefined
                }
                primaryAction={
                  request.currentStatus?.status === "NEGOTIATING" &&
                  requester?.id.toString() != currentUser?.id
                    ? {
                        label: "Approve",
                        onClick: () => handleAcceptRequest(request.id),
                      }
                    : request.currentStatus?.status === "ACCEPTED"
                      ? {
                          label: "Terminer",
                          onClick: () => handleCompleteRequest(request.id),
                          color: "green",
                        }
                      : undefined
                }
                secondaryAction={
                  request.currentStatus?.status === "NEGOTIATING" &&
                  requester?.id.toString() != currentUser?.id
                    ? {
                        label: "Reject",
                        onClick: () => {
                          setRequestToCancel(request);
                          setCancelConfirmOpen(true);
                        },
                        color: "red",
                      }
                    : request.currentStatus?.status === "NEGOTIATING" &&
                        requester?.id.toString() === currentUser?.id
                      ? {
                          label: "Cancel",
                          onClick: () => {
                            setRequestToCancel(request);
                            setCancelConfirmOpen(true);
                          },
                          color: "red",
                        }
                      : request.currentStatus?.status === "ACCEPTED" &&
                          requester?.id.toString() === currentUser?.id
                        ? {
                            label: "Annuler",
                            onClick: () => {
                              setRequestToCancel(request);
                              setCancelConfirmOpen(true);
                            },
                            color: "red",
                          }
                        : undefined
                }
                tertiaryAction={
                  request.currentStatus?.status === "COMPLETED"
                    ? {
                        label: "Évaluer",
                        onClick: () => handleOpenReview(request),
                        color: "orange",
                      }
                    : undefined
                }
                messageAction={
                  request.currentStatus?.status === "NEGOTIATING"
                    ? {
                        label: "Message",
                        onClick: () =>
                          handleContactRequester(
                            requesterName,
                            requesterAvatar,
                            request.id
                          ),
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
      )}

      {/* Error Modal */}
      {errorMessage && (
        <ConfirmCancelDialog
          open={!!errorMessage}
          onClose={() => setErrorMessage(null)}
          onConfirm={() => setErrorMessage(null)}
          title="Erreur"
          message={errorMessage}
          confirmText="OK"
          cancelText=""
          type="danger"
        />
      )}

      {/* Message Dialog */}
      {selectedRequester && (
        <MessageDialog
          open={messageDialogOpen}
          onClose={() => {
            setMessageDialogOpen(false);
            setSelectedRequester(null);
          }}
          title={`Contacter ${selectedRequester.name}`}
          hostName={selectedRequester.name}
          hostAvatar={selectedRequester.avatar}
          requestId={selectedRequester.requestId}
          onSend={handleSendMessage}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmCancelDialog
        open={cancelConfirmOpen}
        onClose={() => {
          setCancelConfirmOpen(false);
          setRequestToCancel(null);
        }}
        onConfirm={handleCancelRequest}
        title="Annuler la réservation"
        message={`Êtes-vous sûr de vouloir annuler cette réservation ? Le montant du voyage vous sera remboursé, mais les frais de plateforme seront conservés.`}
        confirmText="Oui, annuler"
        cancelText="Non, garder"
        type="danger"
      />

      {/* Review Dialog */}
      {requestToReview && (
        <ReviewDialog
          open={reviewDialogOpen}
          onClose={() => {
            setReviewDialogOpen(false);
            setRequestToReview(null);
          }}
          requestId={requestToReview.id}
          requesterName={
            requestToReview.requester
              ? `${requestToReview.requester.firstName} ${requestToReview.requester.lastName.charAt(0)}.`
              : "Utilisateur"
          }
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

const ReviewsSection = () => {
  const [tab, setTab] = useState<"received" | "given">("received");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");
  const { user: currentUser } = useAuth();

  const isOwnProfile =
    !userId || (currentUser && userId === currentUser.id?.toString());

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // For both own profile and public profiles, allow switching between received and given
        const asReviewer = tab === "given";
        const response = await getReviews(
          asReviewer,
          userId ? Number(userId) : undefined
        );
        setReviews(response.items || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tab, userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce(
      (acc, review) => acc + parseFloat(review.rating || "0"),
      0
    );
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Tabs - Show for both own profile and public profiles */}
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={() => setTab("received")}
          className={`text-sm font-semibold ${
            tab === "received"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500"
          }`}
        >
          | {isOwnProfile ? "Mes avis reçus" : "Avis reçus"}
        </button>
        <button
          onClick={() => setTab("given")}
          className={`text-sm font-semibold ${
            tab === "given" ? "text-gray-900 dark:text-white" : "text-gray-500"
          }`}
        >
          | {isOwnProfile ? "Mes avis donnés" : "Avis donnés"}
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">
          Chargement des avis...
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          {/* <div className="text-center">
            <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {tab === "received" ? "Aucun avis reçu" : "Aucun avis donné"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {isOwnProfile
                ? tab === "received"
                  ? "Les avis de vos voyageurs apparaîtront ici"
                  : "Les avis que vous avez donnés apparaîtront ici"
                : tab === "received"
                  ? "Cet utilisateur n'a pas encore reçu d'avis"
                  : "Cet utilisateur n'a pas encore donné d'avis"}
            </p>
          </div> */}
          <div className="text-center text-gray-500 py-8 flex flex-col items-center">
            <div className={`flex items-center justify-center p-8`}>
              {/* Chat bubble icon */}
              <div className="mb-6 w-[30%]">
                <img
                  src="/images/noAvisIcon.jpeg"
                  alt="No reviews"
                  className="w-full h-full"
                />
              </div>

              <div>
                {/* Text content */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Aucun avis encore..
                </h2>
                <p className="text-gray-600 text-center mb-1">
                  Soyez le premier à
                </p>
                <p className="text-gray-600 text-center mb-2">
                  partager votre expérience
                </p>
                <p className="text-blue-600 font-semibold mb-6">GoHappyGo !</p>

                {/* Button */}
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                  Laisser un avis
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {tab === "received" ? "Avis reçus" : "Avis donnés"} (
              {reviews.length})
            </h3>
            {tab === "received" && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-4 w-4 ${
                        star <=
                        Math.round(parseFloat(calculateAverageRating() || "0"))
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-1">
                  {calculateAverageRating()} ({reviews.length} avis)
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {reviews.map((review) => {
              // For received reviews, show the reviewer (who gave the review)
              // For given reviews, show the reviewee (who received the review)
              const displayUser =
                tab === "given" ? review.reviewee : review.reviewer;
              const displayName = displayUser
                ? `${displayUser.firstName} ${displayUser.lastName.charAt(0)}.`
                : "Utilisateur";
              const displayAvatar =
                displayUser?.profilePictureUrl || "/favicon.ico";
              const rating = parseFloat(review.rating || "0");

              return (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={displayAvatar}
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {tab === "received"
                              ? `Avis de ${displayName}`
                              : `Avis pour ${displayName}`}
                          </h4>
                          {review.request?.travel && (
                            <p className="text-xs text-gray-500">
                              Vol {review.request.travel.flightNumber}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Rating stars */}
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Comment */}
                      {review.comment && (
                        <p className="text-sm text-gray-700 mb-3">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const TravelRequestsSection = () => {
  const [demands, setDemands] = useState<DemandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDemand, setEditingDemand] = useState<DemandItem | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [demandToCancel, setDemandToCancel] = useState<DemandItem | null>(null);
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");

  // Use the profile user ID or current user ID
  const targetUserId = userId || currentUser?.id;
  const isOwnProfile =
    !userId || (currentUser && userId === currentUser.id?.toString());

  const fetchDemands = async () => {
    if (!targetUserId) return;

    try {
      const response = await getUserDemands(Number(targetUserId));
      setDemands(response.items || []);
    } catch (error) {
      console.error("Error fetching demands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, [targetUserId]);

  const handleCancelDemand = async () => {
    if (!demandToCancel) return;

    try {
      await deleteDemand(demandToCancel.id);
      // Refresh the list
      await fetchDemands();
      setDemandToCancel(null);
    } catch (error) {
      console.error("Error canceling demand:", error);
    }
  };

  const handleEditSuccess = () => {
    setEditingDemand(null);
    fetchDemands(); // Refresh the list
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          Chargement des demandes...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {demands.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500 py-8 flex flex-col items-center">
              <img
                src="/images/noTravelDemandes.jpeg"
                alt="No demands"
                className="w-[50%] h-[50%]"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {demands.map((demand) => (
              <ActionCard
                key={demand.id}
                id={demand.id.toString()}
                image={
                  demand.images?.[0]?.fileUrl ||
                  demand.user?.profilePictureUrl ||
                  "/favicon.ico"
                }
                title={`${demand.departureAirport?.name || "N/A"} → ${demand.arrivalAirport?.name || "N/A"}`}
                subtitle="Poids requis"
                dateLabel={
                  demand.travelDate
                    ? formatDate(demand.travelDate)
                    : demand.deliveryDate
                      ? formatDate(demand.deliveryDate)
                      : "—"
                }
                flightNumber={demand.flightNumber}
                weight={demand.weight || 0}
                price={demand.pricePerKg}
                type="traveler"
                priceSubtext={`${demand.currency?.symbol || "€"}/Kg`}
                // Buttons for Demands
                primaryAction={
                  isOwnProfile
                    ? {
                        label: "Edit",
                        onClick: () => setEditingDemand(demand),
                      }
                    : undefined
                }
                secondaryAction={
                  isOwnProfile
                    ? {
                        label: "Cancel",
                        onClick: () => {
                          setDemandToCancel(demand);
                          setCancelConfirmOpen(true);
                        },
                        color: "red",
                      }
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Package Dialog - Only show for own profile */}
      {isOwnProfile && editingDemand && (
        <EditPackageDialog
          open={!!editingDemand}
          onClose={() => setEditingDemand(null)}
          demand={editingDemand as any} // Type conversion for compatibility
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Cancel Confirmation Dialog - Only show for own profile */}
      {isOwnProfile && (
        <ConfirmCancelDialog
          open={cancelConfirmOpen}
          onClose={() => {
            setCancelConfirmOpen(false);
            setDemandToCancel(null);
          }}
          onConfirm={handleCancelDemand}
          title="Annuler la demande de voyage"
          message={`Êtes-vous sûr de vouloir annuler cette demande de voyage ? Cette action ne peut pas être annulée.`}
          confirmText="Oui, annuler"
          cancelText="Non, garder"
          type="danger"
        />
      )}
    </>
  );
};

const TravelsSection = () => {
  const [travels, setTravels] = useState<TravelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTravel, setEditingTravel] = useState<TravelItem | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [travelToCancel, setTravelToCancel] = useState<TravelItem | null>(null);
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");
  const type = "transporter"; // Puisqu'on récupère que les voyages

  // Use the profile user ID or current user ID
  const targetUserId = userId || currentUser?.id;
  const isOwnProfile =
    !userId || (currentUser && userId === currentUser.id?.toString());

  const fetchTravels = async () => {
    if (!targetUserId) return;

    try {
      const response = await getUserTravels(Number(targetUserId));
      setTravels(response.items || []);
    } catch (error) {
      console.error("Error fetching travels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravels();
  }, [targetUserId]);

  const handleCancelTravel = async () => {
    if (!travelToCancel) return;

    try {
      await deleteTravel(travelToCancel.id);
      // Refresh the list
      await fetchTravels();
      setTravelToCancel(null);
    } catch (error) {
      console.error("Error canceling travel:", error);
      // You could show an error modal here instead of alert
    }
  };

  const handleEditSuccess = () => {
    setEditingTravel(null);
    fetchTravels(); // Refresh the list
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          Chargement des voyages...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {travels.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            {/* <div className="text-center">
              <PaperAirplaneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {isOwnProfile ? "Aucun voyage" : "Aucun voyage public"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {isOwnProfile
                  ? "Publiez une annonce de voyage pour transporter des baggage"
                  : "Cet utilisateur n'a pas encore publié de voyages"}
              </p>
            </div> */}

            <div className="text-center text-gray-500 py-8 flex flex-col items-center">
              <img
                src="/images/noTravelAnnounces.jpeg"
                alt="No reservations"
                className="w-[50%] h-[50%]"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {travels.map((travel) => (
              <ActionCard
                key={travel.id}
                id={travel.id}
                // Image Priority: Travel Upload -> Airline Logo -> User Avatar -> Default
                image={travel.airline?.logoUrl || "/favicon.ico"}
                title={`${travel?.departureAirport?.name || "N/A"} → ${travel?.arrivalAirport?.name || "N/A"}`}
                subtitle="Espace disponible"
                type={type}
                weight={travel.weightAvailable || 0}
                dateLabel={
                  travel.departureDatetime
                    ? formatDate(travel.departureDatetime)
                    : ""
                }
                flightNumber={travel.flightNumber || "N/A"}
                price={travel.pricePerKg}
                priceSubtext={`${travel.currency?.symbol || "€"}/Kg`}
                // Optional: Include user info if viewing someone else's profile
                user={
                  !isOwnProfile
                    ? {
                        name: travel.user?.fullName || "Utilisateur",
                        avatar:
                          travel.user?.profilePictureUrl || "/favicon.ico",
                      }
                    : undefined
                }
                // Actions for your own travels
                primaryAction={
                  isOwnProfile && travel.isEditable
                    ? {
                        label: "Edit",
                        onClick: () => setEditingTravel(travel),
                        color: "blue",
                      }
                    : undefined
                }
                secondaryAction={
                  isOwnProfile
                    ? {
                        label: "Cancel",
                        onClick: () => {
                          setTravelToCancel(travel);
                          setCancelConfirmOpen(true);
                        },
                        color: "red",
                      }
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Announce Dialog - Only show for own profile and editable travels */}
      {isOwnProfile && editingTravel && editingTravel.isEditable && (
        <EditAnnounceDialog
          open={!!editingTravel}
          onClose={() => setEditingTravel(null)}
          travel={editingTravel}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Cancel Confirmation Dialog - Only show for own profile */}
      {isOwnProfile && (
        <ConfirmCancelDialog
          open={cancelConfirmOpen}
          onClose={() => {
            setCancelConfirmOpen(false);
            setTravelToCancel(null);
          }}
          onConfirm={handleCancelTravel}
          title="Annuler l'annonce de voyage"
          message={`Êtes-vous sûr de vouloir annuler cette annonce de voyage ? Cette action ne peut pas être annulée.`}
          confirmText="Oui, annuler"
          cancelText="Non, garder"
          type="danger"
        />
      )}
    </>
  );
};

const PaymentsSection = ({ profileStats }: { profileStats: any }) => {
  const [tab, setTab] = useState<"balance" | "transactions" | "earnings">(
    "balance"
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [releasingFunds, setReleasingFunds] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch balance
        const balanceData = await getBalance();
        setBalance(balanceData);

        // Fetch transactions
        const transactionData = await getTransactions(1, 10);
        setTransactions(transactionData.items);
        setHasMore(transactionData.items.length === 10);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadMoreTransactions = async () => {
    try {
      const nextPage = page + 1;
      const transactionData = await getTransactions(nextPage, 10);
      setTransactions((prev) => [...prev, ...transactionData.items]);
      setPage(nextPage);
      setHasMore(transactionData.items.length === 10);
    } catch (error) {
      console.error("Error loading more transactions:", error);
    }
  };

  const handleReleaseFunds = async (transactionId: number) => {
    setReleasingFunds(transactionId);
    try {
      await releaseFunds(transactionId);
      // Refresh data
      const balanceData = await getBalance();
      setBalance(balanceData);
      const transactionData = await getTransactions(1, 10);
      setTransactions(transactionData.items);
      setSuccessMessage("Fonds libérés avec succès");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Error releasing funds:", error);
      const errorMsg =
        error?.message ||
        error?.error?.message ||
        "Erreur lors de la libération des fonds";
      setErrorMessage(errorMsg);
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setReleasingFunds(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Terminé";
      case "pending":
        return "En attente";
      case "failed":
        return "Échoué";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          Chargement des données de paiement...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={() => setTab("balance")}
          className={`text-sm font-semibold ${
            tab === "balance"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500"
          }`}
        >
          | Solde
        </button>
        <button
          onClick={() => setTab("transactions")}
          className={`text-sm font-semibold ${
            tab === "transactions"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500"
          }`}
        >
          | Transactions
        </button>
        <button
          onClick={() => setTab("earnings")}
          className={`text-sm font-semibold ${
            tab === "earnings"
              ? "text-gray-900 dark:text-white"
              : "text-gray-500"
          }`}
        >
          | Gains
        </button>
      </div>

      {/* Balance Tab */}
      {tab === "balance" && balance && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Available Balance */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">
                  Solde disponible
                </h3>
                <CurrencyDollarIcon className="h-6 w-6 opacity-75" />
              </div>
              <div className="text-2xl font-bold">
                {balance.available.toFixed(2)} {balance.currency.toUpperCase()}
              </div>
              <p className="text-xs opacity-75 mt-1">Prêt à être retiré</p>
            </div>

            {/* Pending Balance */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">
                  Solde en attente
                </h3>
                <svg
                  className="h-6 w-6 opacity-75"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="text-2xl font-bold">
                {balance.pending.toFixed(2)} {balance.currency.toUpperCase()}
              </div>
              <p className="text-xs opacity-75 mt-1">En cours de traitement</p>
            </div>

            {/* Total Balance */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Solde total</h3>
                <svg
                  className="h-6 w-6 opacity-75"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
              </div>
              <div className="text-2xl font-bold">
                {(balance.available + balance.pending).toFixed(2)}{" "}
                {balance.currency.toUpperCase()}
              </div>
              <p className="text-xs opacity-75 mt-1">Disponible + En attente</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Retirer des fonds
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Historique des retraits
            </button>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {tab === "transactions" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <p className="text-red-800 font-medium">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <p className="text-green-800 font-medium">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 hover:text-green-800"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Historique des transactions
            </h3>
            <div className="text-sm text-gray-500">
              {transactions.length} transaction
              {transactions.length > 1 ? "s" : ""}
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center text-gray-500 py-8 flex flex-col items-center">
              <img
                src="/images/noPaiements.jpeg"
                alt="No reservations"
                className="w-[50%] h-[50%]"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Transaction #{transaction.id}
                          </h4>
                          {transaction.request && (
                            <p className="text-sm text-gray-500">
                              Demande #{transaction.request.id} -{" "}
                              {transaction.request.weight}kg
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(transaction.createdAt)}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                        >
                          {getStatusText(transaction.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {transaction.amount.toFixed(2)}{" "}
                        {transaction.currencyCode.toUpperCase()}
                      </div>
                      {transaction.status.toLowerCase() === "paid" && (
                        <button
                          onClick={() => handleReleaseFunds(transaction.id)}
                          disabled={releasingFunds === transaction.id}
                          className="mt-2 text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {releasingFunds === transaction.id
                            ? "..."
                            : "Libérer"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={loadMoreTransactions}
                  className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Charger plus de transactions
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Earnings Tab */}
      {tab === "earnings" && balance && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Analyse des gains
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Chart Placeholder */}
            <div className="bg-gray-50 rounded-xl p-6 h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg
                  className="h-12 w-12 mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L3.5 15.9l.01 2.59z" />
                </svg>
                <p>Graphique des gains</p>
                <p className="text-sm">Bientôt disponible</p>
              </div>
            </div>

            {/* Earnings Summary */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Solde disponible
                </h4>
                <div className="text-2xl font-bold text-blue-600">
                  {balance.available.toFixed(2)}{" "}
                  {balance.currency.toUpperCase()}
                </div>
                <p className="text-sm text-blue-700">Prêt à être retiré</p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-medium text-green-900 mb-2">
                  Solde en attente
                </h4>
                <div className="text-2xl font-bold text-green-600">
                  {balance.pending.toFixed(2)} {balance.currency.toUpperCase()}
                </div>
                <p className="text-sm text-green-700">En cours de traitement</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-medium text-purple-900 mb-2">
                  Solde total
                </h4>
                <div className="text-2xl font-bold text-purple-600">
                  {(balance.available + balance.pending).toFixed(2)}{" "}
                  {balance.currency.toUpperCase()}
                </div>
                <p className="text-sm text-purple-700">
                  Disponible + En attente
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FavoritesSection = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await getBookmarks();
        setBookmarks(response.items || []);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const formatName = (fullName: string) => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1].charAt(0)}.`;
    }
    return fullName;
  };

  const handleRemoveBookmark = async (
    bookmarkType: "TRAVEL" | "DEMAND",
    itemId: number
  ) => {
    try {
      // Convert to lowercase for API endpoint
      const type = bookmarkType.toLowerCase();
      await removeBookmark(type, itemId);
      // Refresh bookmarks after removal
      const response = await getBookmarks();
      setBookmarks(response.items || []);
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2x p-6">
        <div className="text-center text-gray-500">
          Chargement de vos favoris...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl ">
      {bookmarks.length === 0 ? (
        <div className="text-center text-gray-500 py-8 flex flex-col items-center">
          <img
            src="/images/noFavorites.jpeg"
            alt="No favorites"
            className="w-[50%] h-[50%]"
          />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Mes Favoris ({bookmarks.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {bookmarks.map((bookmark) => {
              // Determine if it's a travel or demand
              const isTravel =
                bookmark.bookmarkType === "TRAVEL" && bookmark.travel;
              const isDemand =
                bookmark.bookmarkType === "DEMAND" && bookmark.demand;

              if (!isTravel && !isDemand) return null;

              // Get the actual item (travel or demand)
              const item: any = isTravel ? bookmark.travel : bookmark.demand;
              if (!item) return null;

              const id =
                (isTravel
                  ? bookmark.travelId
                  : bookmark.demandId
                )?.toString() || bookmark.id.toString();
              const name = item.user
                ? `${item.user.fullName}`.trim()
                : "Voyageur";

              const avatar =
                item.user?.profilePictureUrl ||
                item.images?.[0]?.fileUrl ||
                "/favicon.ico";
              const originName = item.departureAirport?.name || "";
              const destName = item.arrivalAirport?.name || "";
              const location = `${originName} → ${destName}`;
              // Parse pricePerKg as it's returned as string from API
              const pricePerKg =
                typeof item.pricePerKg === "string"
                  ? parseFloat(item.pricePerKg)
                  : (item.pricePerKg ?? 0);
              const rating = "4.7";

              // Pour les voyages (travel), utiliser le logo de la compagnie
              // Pour les demandes (demand), utiliser l'avatar de l'utilisateur
              const image = isTravel ? item.airline?.logoUrl || avatar : avatar;

              const featured = Boolean(item.user?.isVerified);

              // Use weightAvailable for travel type, weight for demand type
              const availableWeight = isTravel
                ? (item.weightAvailable ?? 0)
                : (item.weight ?? 0);

              // Get the date from the correct field
              const dateString =
                item.departureDatetime || item.deliveryDate || item.travelDate;
              const departure = dateString ? formatDate(dateString) : undefined;

              const airline = item.airline?.name;
              const type = isTravel ? "transporter" : "traveler";

              return (
                <>
                  <TravelCard
                    id={id}
                    fullName={name}
                    avatar={avatar}
                    location={location}
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
                    onRemove={() =>
                      handleRemoveBookmark(
                        bookmark.bookmarkType,
                        isTravel ? bookmark.travelId! : bookmark.demandId!
                      )
                    }
                  />
                  {/* Remove from favorites button */}
                  {/* <button 
                    onClick={() => handleRemoveBookmark(
                      bookmark.bookmarkType, 
                      isTravel ? bookmark.travelId! : bookmark.demandId!
                    )}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                  >
                    <svg
                      className="w-4 h-4"
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
                  </button> */}
                </>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Profile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user"); // Get user ID from query params
  const { user: currentUser, isAuthenticated } = useAuth();

  // Determine if this is the current user's profile or another user's profile
  const isOwnProfile =
    !userId || (currentUser && userId === currentUser.id?.toString());

  // Set default section based on profile type and URL parameters
  const sectionParam = searchParams.get("section");
  const [activeSection, setActiveSection] = useState<string>(
    sectionParam || (isOwnProfile ? "reservations" : "reviews")
  );

  // Update active section when URL parameters change
  useEffect(() => {
    const sectionParam = searchParams.get("section");
    if (sectionParam) {
      setActiveSection(sectionParam);
    }
  }, [searchParams]);
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);
  const [createAnnounceDialogOpen, setCreateAnnounceDialogOpen] =
    useState<boolean>(false);
  const [createPackageDialogOpen, setCreatePackageDialogOpen] =
    useState<boolean>(false);
  const [profileUser, setProfileUser] = useState<GetMeResponse | null>(null);
  const [profileStats, setProfileStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingOnboarding, setProcessingOnboarding] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);

      // Get total unread messages count
      const unreadCount = await getUnreadCount();
      setTotalUnreadCount(unreadCount);

      try {
        // If userId is provided, fetch that user's data, otherwise fetch current user's data
        const userData = await getMe(userId || undefined);
        if (userData) {
          setProfileUser(userData);
          setProfileStats(userData.profileStats);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  // Use profileUser data instead of currentUser for display
  const displayUser = profileUser || currentUser;

  const profileSections: ProfileSection[] = [
    {
      id: "reservations",
      label: "Mes Réservations",
      icon: <PaperAirplaneIcon className="h-5 w-5" />,
      count: profileStats?.requestsAcceptedCount || 0,
    },
    {
      id: "messages",
      label: "Mes Messages",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      count: totalUnreadCount, // Messages count not in profileStats
    },
    {
      id: "reviews",
      label: isOwnProfile ? "Mes Avis" : "Avis",
      icon: <StarIcon className="h-5 w-5" />,
      count: profileStats?.reviewsReceivedCount || 0,
    },
    {
      id: "travel-requests",
      label: isOwnProfile ? "Mes Demandes de Voyages" : "Demandes de Voyages",
      icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
      count: profileStats?.demandsCount || 0,
    },
    {
      id: "travels",
      label: isOwnProfile ? "Mes Voyages" : "Voyages",
      icon: <PaperAirplaneIcon className="h-5 w-5" />,
      count: profileStats?.travelsCount || 0,
    },
    {
      id: "favorites",
      label: isOwnProfile ? "Mes Favoris" : "Favoris",
      icon: <HeartIcon className="h-5 w-5" />,
      count:
        (profileStats?.bookMarkTravelCount || 0) +
        (profileStats?.bookMarkDemandCount || 0),
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CurrencyDollarIcon className="h-5 w-5" />,
      count: profileStats?.transactionsCompletedCount || 0,
    },
  ];

  // Filter sections based on whether it's own profile or not
  const visibleSections = isOwnProfile
    ? profileSections
    : profileSections.filter(
        (section) =>
          !["reservations", "messages", "favorites", "payments"].includes(
            section.id
          )
      );

  const handleStripeOnboarding = async () => {
    setProcessingOnboarding(true);
    try {
      const response = await getOnboardingLink();
      // Open the Stripe onboarding URL in a new tab
      window.open(response.url, "_blank");
    } catch (error) {
      console.error("Error getting onboarding link:", error);
      // You could show an error message here
    } finally {
      setProcessingOnboarding(false);
    }
  };

  const MessagesSection = () => {
    const [selectedConversation, setSelectedConversation] =
      useState<Conversation | null>(null);

    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row h-auto md:h-[600px]">
          {/* Conversations List */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 max-h-[300px] md:max-h-none">
            <ConversationList
              onSelectConversation={setSelectedConversation}
              selectedConversationId={selectedConversation?.id}
            />
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <Chat
                requestId={selectedConversation.requestId}
                otherUser={selectedConversation.otherUser}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">
                    Sélectionnez une conversation
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Choisissez une conversation dans la liste pour commencer à
                    discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "messages":
        return <MessagesSection />;
      case "reservations":
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-2">
            <div className="mb-4 text-lg font-semibold">Reservations</div>
            <ReservationsSection />
          </div>
        );
      case "reviews":
        return <ReviewsSection />;
      case "travel-requests":
        return <TravelRequestsSection />;
      case "travels":
        return <TravelsSection />;
      case "favorites":
        return <FavoritesSection />;
      case "payments":
        return <PaymentsSection profileStats={profileStats} />;
      default:
        return null;
    }
  };

  return (
    <div className=" bg-white">
      <Header />

      <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Chargement du profil...</p>
            </div>
          </div>
        ) : !displayUser ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-gray-500 text-lg">Utilisateur introuvable</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-4">
            {/* Sidebar */}
            <aside className="space-y-4 md:space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 text-center">
                {/* Profile Picture */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-3 md:mb-4 overflow-hidden">
                  {displayUser?.profilePictureUrl ? (
                    <img
                      src={displayUser.profilePictureUrl}
                      alt={displayUser?.fullName || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Name */}
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                  {displayUser?.fullName
                    ? `${displayUser.fullName}`
                    : displayUser?.email || "Utilisateur"}
                </h3>

                {/* User Bio */}
                {displayUser?.bio ? (
                  <p className="text-gray-600 text-sm mb-4 italic">
                    "{displayUser.bio}"
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm mb-4">
                    {isOwnProfile
                      ? "Ajoutez une bio pour vous présenter aux autres utilisateurs"
                      : "Aucune bio disponible"}
                  </p>
                )}

                {/* Edit Profile Button - Only show for own profile */}
                {isOwnProfile && (
                  <button
                    onClick={() => setProfileDialogOpen(true)}
                    className="w-full bg-white border border-blue-500 text-blue-500 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Stripe Account Alert - Show for users with pending Stripe account */}
              {(displayUser?.stripeAccountStatus === "pending" ||
                !displayUser?.stripeAccountId) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-yellow-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                        Stripe Account
                      </h3>
                      <p className="text-sm text-yellow-700 mb-4">
                        Registering a Stripe account is necessary to start
                        selling your services on the marketplace
                      </p>
                      <div className="bg-yellow-100 rounded-lg p-3 mb-4">
                        <p className="text-sm text-yellow-800">
                          You haven't registered for a Stripe account yet.
                          Please do so by clicking the button.
                        </p>
                      </div>
                      <button
                        onClick={handleStripeOnboarding}
                        disabled={processingOnboarding}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingOnboarding ? "Ouverture..." : "Register"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="bg-white rounded-2xl border border-gray-200 p-2">
                <nav className="space-y-1 md:space-y-2">
                  {visibleSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between p-2 md:p-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="flex-shrink-0">{section.icon}</span>
                        <span className="text-xs md:text-sm font-medium truncate">
                          {section.label}
                        </span>
                      </div>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {section.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Action Buttons - Only show for own profile */}
              {isOwnProfile && (
                <div className="space-y-3">
                  <button
                    onClick={() => setCreateAnnounceDialogOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl font-medium text-sm transition-colors shadow-lg hover:shadow-xl"
                  >
                    Publier une annonce de voyage
                  </button>
                  <button
                    onClick={() => setCreatePackageDialogOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl font-medium text-sm transition-colors shadow-lg hover:shadow-xl"
                  >
                    Publier une demande de voyage
                  </button>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <section className="mx-5">
              {/* Section Title */}
              <div className="mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  | {visibleSections.find((s) => s.id === activeSection)?.label}
                </h1>
              </div>

              {/* Content */}
              {renderContent()}
            </section>
          </div>
        )}
      </main>

      {/* Profile Dialog - Only show for own profile */}
      {isOwnProfile && (
        <ProfileDialog
          open={profileDialogOpen}
          onClose={() => setProfileDialogOpen(false)}
        />
      )}

      {/* Create Announce Dialog - Only show for own profile */}
      {isOwnProfile && (
        <CreateAnnounceDialog
          open={createAnnounceDialogOpen}
          onClose={() => setCreateAnnounceDialogOpen(false)}
        />
      )}

      {/* Create Package Dialog - Only show for own profile */}
      {isOwnProfile && (
        <CreatePackageDialog
          open={createPackageDialogOpen}
          onClose={() => setCreatePackageDialogOpen(false)}
        />
      )}

      <FooterMinimal />
    </div>
  );
}
