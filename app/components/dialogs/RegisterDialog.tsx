import { useEffect, useRef, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useAuth } from '~/hooks/useAuth';
import CountryComboBox, {
  type Country,
  STRIPE_COUNTRIES,
} from '~/components/forms/CountryComboBox';

export default function RegisterDialog({
  open,
  onClose,
  onSwitchToLogin,
}: {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    STRIPE_COUNTRIES.find((c) => c.code === 'FR') || null // France par défaut
  );
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const makeRefHandler =
    (index: number) =>
    (el: HTMLInputElement | null): void => {
      inputsRef.current[index] = el;
    };
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleCountryChange = (country: Country | null) => {
    setSelectedCountry(country);
    // Reset phone number when country changes
    setForm((p) => ({ ...p, phoneNumber: '' }));
  };

  const { register, verifyEmail, resendEmailVerification } = useAuth();

  // Update phone input when country changes
  useEffect(() => {
    if (selectedCountry) {
      // Force re-render of PhoneInput with new country
      setForm((p) => ({ ...p, phoneNumber: '' }));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (form.password !== form.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      if (!selectedCountry) {
        setError('Veuillez sélectionner votre pays de résidence');
        return;
      }
      setSubmitting(true);
      setError(null);
      setMessage(null);

      try {
        const res = await register(
          form.email,
          form.password,
          form.firstName,
          form.lastName,
          form.phoneNumber,
          selectedCountry?.code
        );
        setMessage(res.message);
        setStep(2);
      } catch (err: any) {
        setError(err.message || "Échec de l'inscription. Réessayez.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (step === 2) {
      const verification = code.join('');
      if (verification.length !== 6) {
        setError('Veuillez saisir le code de vérification complet');
        return;
      }
      setSubmitting(true);
      setError(null);

      try {
        const verifyRes = await verifyEmail(form.email, verification);
        setMessage(verifyRes.message);

        // Si l'utilisateur est maintenant connecté, fermer immédiatement
        if (verifyRes.isLoggedIn) {
          onClose();
        } else {
          // Sinon, fermer après un délai pour montrer le message
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } catch (err: any) {
        setError(err.message || 'Code de vérification invalide. Réessayez.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const onResendEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setMessage(null);

    try {
      const res = await resendEmailVerification(form.email);
      setMessage(res.message);
    } catch (err: any) {
      setError(err.message || 'Échec de renvoi du code de vérification. Réessayez.');
    }
    return;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={ref}
        className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Côté gauche - Formulaire */}
          <div className="w-full md:w-2/3 p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[90vh]">
            <div className="mb-4">
              <h1 className="text-xl sm font-bold text-gray-900 mb-2">
                {step === 1 ? 'Inscription' : 'Vérification'}
              </h1>
              <p className="text-sm sm text-gray-600">
                {step === 1
                  ? 'et profitez de toutes les possibilités'
                  : 'Saisissez le code de vérification'}
              </p>
            </div>

            <form className="space-y-4 sm:space-y-6 text-gray-500" onSubmit={onSubmit}>
              {message && <div className="text-xs sm text-green-600">{message}</div>}
              {error && <div className="text-xs sm text-red-600">{error}</div>}

              {step === 1 ? (
                <>
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-gray-900"
                    >
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus transition-colors"
                      placeholder="Saisissez votre prénom tel que sur la pièce d'identité"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      (Uniquement votre prénom apparaît sur la plateforme)
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-gray-900"
                    >
                      Nom de famille
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus transition-colors"
                      placeholder="Saisissez votre nom tel que sur la pièce d'identité"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>

                  <div>
                    <CountryComboBox
                      label="Pays de résidence"
                      selectedCountry={selectedCountry}
                      onChange={handleCountryChange}
                      placeholder="Sélectionnez votre pays"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      Numéro de téléphone
                    </label>
                    <PhoneInput
                      key={selectedCountry?.code || 'default'} // Force re-render when country changes
                      defaultCountry={(selectedCountry?.code.toLowerCase() as any) || 'fr'}
                      value={form.phoneNumber}
                      onChange={(phone) => setForm((p) => ({ ...p, phoneNumber: phone }))}
                      inputClassName="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus transition-colors"
                      countrySelectorStyleProps={{
                        className:
                          'border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus pointer-events-none opacity-75',
                      }}
                      inputProps={{
                        placeholder: 'Numéro de téléphone',
                        required: true,
                      }}
                      disableCountryGuess
                      forceDialCode
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Le code pays est automatiquement défini selon votre pays de résidence
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-gray-900"
                    >
                      Adresse email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus transition-colors"
                      placeholder="Votre email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-gray-900"
                    >
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus transition-colors"
                      placeholder="Votre mot de passe"
                      required
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-semibold text-gray-900"
                    >
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus transition-colors"
                      placeholder="Confirmez votre mot de passe"
                      required
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-0.5 sm:mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 text-xs sm text-gray-600">
                      En vous inscrivant, vous acceptez la{' '}
                      <a href="/privacy" className="text-green-600 hover underline">
                        Politique de confidentialité
                      </a>{' '}
                      et les{' '}
                      <a href="/terms" className="text-green-600 hover underline">
                        Conditions d'utilisation
                      </a>
                      .
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs sm text-gray-600">
                    Un code de vérification à 6 chiffres a été envoyé à{' '}
                    <span className="font-medium break-all">{form.email}</span>.
                  </p>
                  <div
                    className="flex justify-between gap-1.5 sm:gap-2"
                    onPaste={(e) => {
                      const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                      if (!text) return;
                      const next = text.split('');
                      setCode((prev) => prev.map((_, i) => next[i] ?? ''));
                      // focus last filled
                      const idx = Math.min(text.length - 1, 5);
                      inputsRef.current[idx]?.focus();
                      e.preventDefault();
                    }}
                  >
                    {code.map((value, idx) => (
                      <input
                        key={idx}
                        ref={makeRefHandler(idx)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={value}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 1);
                          setCode((prev) => prev.map((p, i) => (i === idx ? v : p)));
                          if (v && idx < 5) inputsRef.current[idx + 1]?.focus();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !code[idx] && idx > 0) {
                            inputsRef.current[idx - 1]?.focus();
                          }
                        }}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="text-xs sm text-green-600 hover"
                    onClick={onResendEmailVerification}
                  >
                    Renvoyer le code
                  </button>
                </>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`w-full text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm font-medium transition-colors duration-200 ${
                  submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover'
                }`}
              >
                {submitting ? 'En cours…' : step === 1 ? 'Suivant' : 'Valider'}
              </button>

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 sm:py-2.5 text-xs sm font-medium text-gray-700 hover"
                >
                  Retour
                </button>
              )}
            </form>

            {step === 1 && (
              <>
                {/* Séparateur */}
                <div className="my-4 sm:my-6 flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-2 sm:px-4 text-xs sm text-gray-500">Ou continuer avec</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Boutons sociaux */}
                <div className="flex justify-center gap-2 sm:gap-4">
                  <button className="flex text-xs sm w-28 sm:w-32 items-center justify-center px-2 sm:px-4 py-2 border border-gray-300 rounded-lg hover transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>
                  <button className="text-xs sm w-28 sm:w-32 flex items-center justify-center px-2 sm:px-4 py-2 border border-gray-300 rounded-lg hover transition-colors">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                      fill="#1877F2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>

                {/* Lien vers connexion */}
                <div className="mt-4 sm:mt-6 text-center">
                  <span className="text-xs sm text-gray-600">Vous avez déjà un compte ? </span>
                  <button
                    onClick={onSwitchToLogin}
                    className="text-xs sm text-green-600 hover font-medium"
                  >
                    Se connecter
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Côté droit - Image (caché sur mobile) */}
          <div className="hidden md:block md:w-2/3 bg-gradient-to-br from-green-500 to-blue-600 relative">
            <img src="/images/login.jpg" alt="Register" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
