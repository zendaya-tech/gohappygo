import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

export default function LoginDialog({
  open,
  onClose,
  onSwitchToRegister,
}: {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [open, onClose]);

  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      onClose();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={ref}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
      >
        <div className="flex flex-col md:flex-row">
          {/* Côté gauche - Formulaire */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md font-bold text-gray-900 mb-2">
                Connexion
              </h1>
              <p className="text-sm md text-gray-600">
                et profitez de toutes les possibilités
              </p>
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs md font-medium text-gray-700 mb-1 md:mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus transition-colors"
                  placeholder="Votre email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs md font-medium text-gray-700 mb-1 md:mb-2"
                >
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus transition-colors"
                  placeholder="Votre mot de passe"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Se souvenir de moi
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  submitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover"
                }`}
              >
                {submitting ? "Connexion…" : "Se connecter"}
              </button>
            </form>

            {/* Séparateur */}
            <div className="my-4 md:my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 md:px-4 text-xs md text-gray-500">
                Ou continuer avec
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Boutons sociaux */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button className="flex items-center justify-center px-3 md:px-4 py-2 text-xs md border border-gray-300 rounded-lg hover transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" viewBox="0 0 24 24">
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
              <button className="flex items-center justify-center px-3 md:px-4 py-2 text-xs md border border-gray-300 rounded-lg hover transition-colors">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Lien vers inscription */}
            <div className="mt-4 md:mt-6 text-center">
              <span className="text-xs md text-gray-600">
                Pas encore de compte ?{" "}
              </span>
              <button
                onClick={onSwitchToRegister}
                className="text-xs md text-blue-600 hover font-medium"
              >
                S'inscrire
              </button>
            </div>
          </div>

          {/* Côté droit - Image */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 relative min-h-[300px]">
            <img
              src="/images/login.jpg"
              alt="Login"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
