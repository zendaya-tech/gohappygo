import { useEffect, useRef, useState } from 'react';
import { useAuth } from '~/hooks/useAuth';

export default function EmailVerificationDialog({
  open,
  email,
  onClose,
}: {
  open: boolean;
  email?: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { verifyEmail, resendEmailVerification, authenticate } = useAuth();

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

  useEffect(() => {
    if (!open) return;
    setCode(['', '', '', '', '', '']);
    setError(null);
    setMessage(null);
  }, [open]);

  if (!open) return null;

  const emailValue = email?.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!emailValue) {
      setError('Adresse email introuvable. Veuillez vous reconnecter.');
      return;
    }

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Veuillez entrer le code complet a 6 chiffres.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await verifyEmail(emailValue, verificationCode);
      setMessage(res.message || 'Email verifie avec succes.');
      await authenticate();
      setTimeout(() => onClose(), 900);
    } catch (err: any) {
      setError(err?.message || "Code invalide. Merci d'essayer a nouveau.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setMessage(null);

    if (!emailValue) {
      setError('Adresse email introuvable. Veuillez vous reconnecter.');
      return;
    }

    setResending(true);
    try {
      const res = await resendEmailVerification(emailValue);
      setMessage(res.message || 'Code de verification renvoye.');
    } catch (err: any) {
      setError(err?.message || "Impossible de renvoyer le code pour l'instant.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div
        ref={ref}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
      >
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md font-bold text-gray-900 mb-2">Verification email</h1>
              <p className="text-sm md text-gray-600">
                Activez votre compte pour acceder a toutes les fonctionnalites.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="text-sm text-gray-600">
                Un code de verification a ete envoye a <span className="font-semibold">{emailValue}</span>
              </div>

              {message && <div className="text-sm text-green-600">{message}</div>}
              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="flex justify-between gap-2"
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                  if (!text) return;
                  const next = text.split('');
                  setCode((prev) => prev.map((_, i) => next[i] ?? ''));
                  const idx = Math.min(text.length - 1, 5);
                  inputsRef.current[idx]?.focus();
                  e.preventDefault();
                }}
              >
                {code.map((value, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputsRef.current[idx] = el;
                    }}
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
                    className="w-11 h-11 text-center text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm text-blue-600 hover disabled:opacity-50 cursor-pointer"
                >
                  {resending ? 'Renvoi...' : 'Renvoyer le code'}
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                  submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Verification…' : 'Verifier mon email'}
              </button>
            </form>
          </div>

          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 relative min-h-[300px]">
            <img src="/images/login.jpg" alt="Verification" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
