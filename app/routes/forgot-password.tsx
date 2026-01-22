import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow">
                    <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Saisissez votre adresse email pour recevoir un lien de réinitialisation.
                    </p>

                    {sent ? (
                        <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
                            Si un compte existe pour {email}, un email de réinitialisation a été envoyé.
                        </div>
                    ) : (
                        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 placeholder-gray-400 focus focus:ring-2 focus:ring-indigo-500/40 outline-none"
                                    placeholder="vous@exemple.com"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover"
                            >
                                Envoyer le lien
                            </button>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

