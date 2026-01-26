import React, { useEffect } from 'react';
import { CheckCircle, PlusCircle, Search, DollarSign, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrimaryAction: () => void;
}

export default function SuccessModal({ isOpen, onClose, onPrimaryAction }: SuccessModalProps) {
  // Close modal when "Escape" key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* 1. Backdrop Overlay: Clicking here calls onClose */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 2. Modal Container: stopPropagation prevents closing when clicking inside the modal */}
      <div
        className="relative z-10 w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3. Close Button ('X') */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover text-gray-400 hover transition-colors cursor-pointer z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Top Success Header */}
        <div className="pt-12 pb-8 px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-10 h-10 fill-green-500 text-white rounded-full" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuration Stripe Terminé !</h1>
          <p className="text-gray-500">Vous êtes prêt(e) à donner et recevoir du Bonheur.</p>
        </div>

        {/* Hero Illustration Area */}
        <div className="relative h-64 bg-blue-50/50 flex items-center justify-center overflow-hidden">
          <div className="relative z-10 w-full h-full flex justify-center">
            <img
              src="/illustrations/travel-success.jpeg"
              alt="Success"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap justify-center gap-4 py-8 border-b border-gray-100 bg-white">
          <StatusBadge label="Compte Vérifié" />
          <StatusBadge label="Informations Remplies" />
          <StatusBadge label="Paiements Activés" />
          <StatusBadge label="Le Bonheur est simple" />
        </div>

        {/* Main Action */}
        <div className="py-8 flex justify-center bg-white">
          <button
            onClick={() => {
              onPrimaryAction();
              onClose(); // Usually good to close after action
            }}
            className="bg-indigo-600 hover text-white px-10 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-100 cursor-pointer"
          >
            Accéder au Tableau de bord
          </button>
        </div>

        {/* Footer: What happens next? */}
        <div className="bg-gray-50/50 p-10">
          <h3 className="text-center font-bold text-gray-900 mb-10 text-lg">Et maintenant ?</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components kept as per your original code
function StatusBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100">
      <CheckCircle className="w-4 h-4 fill-green-500 text-white" />
      {label}
    </div>
  );
}

function NextStep({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
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
