import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Remplace par ta clé publique Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_your_key_here"
);

export interface BookingCardData {
  paymentMethodId: string;
}

function CheckoutForm({
  amount,
  currencySymbol,
  onConfirm,
  onClose,
  isSubmitting,
  setIsSubmitting,
  onSuccess,
}: {
  amount: number;
  currencySymbol: string;
  onConfirm: (data: BookingCardData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onSuccess?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Erreur lors du chargement du formulaire de paiement");
      setIsSubmitting(false);
      return;
    }

    try {
      // Créer un PaymentMethod avec Stripe
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (stripeError) {
        setError(
          stripeError.message || "Erreur lors du traitement du paiement"
        );
        setIsSubmitting(false);
        return;
      }

      if (!paymentMethod) {
        setError("Impossible de créer la méthode de paiement");
        setIsSubmitting(false);
        return;
      }

      // Appeler la fonction de confirmation avec le paymentMethodId
      await onConfirm({ paymentMethodId: paymentMethod.id });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center px-6 pt-4 mt-6">
        <div className="w-[20%]">
          <img src="/images/paymentLogosCB.png" alt="CB" className=" w-full" />
        </div>
        <div className="w-[20%]">
          <img
            src="/images/paymentLogosVisa.png"
            alt="Visa"
            className="w-full"
          />
        </div>
        <div className="w-[20%]">
          <img
            src="/images/paymentLogosMasterCard.png"
            alt="MasterCard"
            className="w-full"
          />
        </div>
      </div>
      <div className="px-6 py-5">
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Informations de carte
          </label>
          <div className="rounded-lg border border-gray-300 px-3 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1f2937",
                    "::placeholder": {
                      color: "#9ca3af",
                    },
                  },
                  invalid: {
                    color: "#ef4444",
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Mention Stripe centrée */}
        <div className="flex items-center justify-center gap-2 mb-8 text-sm text-gray-500">
          <svg className="h-5 w-5" fill="black" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Paiement sécurisé par</span>
          <div className="border border-black border-2 px-0.5 py-1 rounded text-[10px] text-black font-bold tracking-tighter">
            stripe
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          type="submit"
          disabled={!stripe || isSubmitting}
          className={`w-full rounded-md py-3 text-base font-semibold text-white shadow ${
            !stripe || isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover"
          }`}
        >
          {isSubmitting
            ? "Traitement..."
            : `Payer ${amount.toFixed(2)} ${currencySymbol}`}
        </button>
      </div>
    </form>
  );
}

export default function BookingDialog({
  open,
  onClose,
  amount,
  currencySymbol = "€",
  email,
  onConfirm,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  amount: number;
  currencySymbol?: string;
  email?: string;
  onConfirm: (cardData: BookingCardData) => Promise<void>;
  onSuccess?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, isSubmitting]);

  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={isSubmitting ? undefined : onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
        {/* Logo badge */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="GoHappyGo" className="h-18" />
          </div>
        </div>

        {/* Close button */}
        {!isSubmitting && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover transition-colors"
          >
            <svg
              className="h-6 w-6"
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
        )}

        {/* Header */}
        <div className="pt-10 text-center px-6">
          <p className="mt-1 text-[8px] text-gray-500">
            Soyez un porteur du bonheur
          </p>
        </div>

        {/* Stripe Elements Provider */}
        <Elements stripe={stripePromise}>
          <CheckoutForm
            amount={amount}
            currencySymbol={currencySymbol}
            onConfirm={onConfirm}
            onClose={onClose}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSuccess={onSuccess}
          />
        </Elements>
      </div>
    </div>
  );
}
