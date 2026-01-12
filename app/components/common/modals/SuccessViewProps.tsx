import React from "react";
import {
  CheckCircle,
  ArrowRight,
  Wallet,
  TrendingUp,
  Landmark,
  PlusCircle,
  Search,
  DollarSign,
} from "lucide-react";

interface SuccessViewProps {
  variant: "payments" | "onboarding";
  onPrimaryAction: () => void;
}

export default function SuccessView({
  variant,
  onPrimaryAction,
}: SuccessViewProps) {
  const isPayments = variant === "payments";

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
      {/* Top Success Header */}
      <div className="pt-12 pb-8 px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="w-10 h-10 fill-green-500 text-white rounded-full" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isPayments
            ? "Configuration Stripe Terminé !"
            : "Payments Setup Complete!"}
        </h1>
        <p className="text-gray-500">
          {isPayments
            ? "Vous êtes prêt(e) à donner et recevoir du Bonheur."
            : "You're all set up to receive payments."}
        </p>
      </div>

      {/* Hero Illustration Area */}
      <div className="relative h-64 bg-blue-50/50 flex items-center justify-center">
        {/* Placeholder for your specific illustrations */}
        <div className="relative z-10 w-full h-full flex justify-center">
          {isPayments ? (
            <img
              src="/illustrations/travel-success.jpeg"
              alt="Success"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/illustrations/payment-success.jpeg"
              alt="Payment Success"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap justify-center gap-4 py-8 border-b border-gray-100 bg-white">
        {isPayments ? (
          <>
            <StatusBadge label="Compte Vérifié" />
            <StatusBadge label="Informations Remplies" />
            <StatusBadge label="Paiements Activés" />
            <StatusBadge label="Le Bonheur est simple" />
          </>
        ) : (
          <>
            <StatusBadge label="Account Verified" />
            <StatusBadge label="Bank Account Linked" />
            <StatusBadge label="Payouts Enabled" />
            <StatusBadge label="Ready to Receive Funds" />
          </>
        )}
      </div>

      {/* Main Action */}
      <div className="py-8 flex justify-center bg-white">
        <button
          onClick={onPrimaryAction}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-100"
        >
          {isPayments ? "Accéder au Tableau de bord" : "Go to Dashboard"}
        </button>
      </div>

      {/* Footer: What happens next? */}
      <div className="bg-gray-50/50 p-10">
        <h3 className="text-center font-bold text-gray-900 mb-10 text-lg">
          {isPayments ? "Et maintenant ?" : "What happens next?"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isPayments ? (
            <>
              <NextStep
                icon={<PlusCircle className="text-blue-500" />}
                title="Publier une annonce"
                desc="Déposez une annonce ou une demande de voyage."
              />
              <NextStep
                icon={<Search className="text-blue-400" />}
                title="Trouver un HappyVoyageur"
                desc="Recherchez un voyage pour la même destination."
              />
              <NextStep
                icon={<DollarSign className="text-yellow-500" />}
                title="Gagner des revenus"
                desc="Commencez à gagner de l'argent grâce à vos voyages."
              />
            </>
          ) : (
            <>
              <NextStep
                icon={<Wallet className="text-blue-500" />}
                title="Receive Payments"
                desc="Start accepting payments from your customers."
              />
              <NextStep
                icon={<Landmark className="text-blue-600" />}
                title="Get Paid Out"
                desc="Payouts will be sent directly to your bank account."
              />
              <NextStep
                icon={<TrendingUp className="text-blue-500" />}
                title="Track Earnings"
                desc="Monitor your earnings and transaction history."
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100">
      <CheckCircle className="w-4 h-4 fill-green-500 text-white" />
      {label}
    </div>
  );
}

function NextStep({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="text-center space-y-3">
      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100 text-2xl">
        {icon}
      </div>
      <h4 className="font-bold text-gray-900 leading-tight px-4">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed px-2">{desc}</p>
    </div>
  );
}
