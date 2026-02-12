import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import Header from '../components/layout/Header';
import FooterMinimal from '~/components/layout/FooterMinimal';
import { disputeCancellation } from '~/services/requestService';

type ActionState = 'loading' | 'success' | 'error';

export default function RequestDisputeCancellationPage() {
  const { id } = useParams();
  const [state, setState] = useState<ActionState>('loading');
  const [message, setMessage] = useState('Contestation de l\'annulation en cours...');

  useEffect(() => {
    const run = async () => {
      if (!id) {
        setState('error');
        setMessage('Identifiant de reservation invalide.');
        return;
      }

      try {
        await disputeCancellation(Number(id));
        setState('success');
        setMessage('Contestation envoyee avec succes.');
      } catch (error: any) {
        setState('error');
        setMessage(
          error?.message || error?.error?.message || 'Impossible de contester l\'annulation.'
        );
      }
    };

    run();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 text-center">
          {state === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <h1 className="text-xl font-semibold text-gray-900">Traitement en cours</h1>
            </div>
          )}

          {state === 'success' && <h1 className="text-xl font-semibold text-green-700">Succes</h1>}

          {state === 'error' && <h1 className="text-xl font-semibold text-red-700">Erreur</h1>}

          <p className="mt-3 text-gray-700">{message}</p>

          <div className="mt-6">
            <Link
              to="/profile?section=reservations"
              className="inline-flex items-center rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700"
            >
              Retour aux reservations
            </Link>
          </div>
        </div>
      </main>
      <FooterMinimal />
    </div>
  );
}
