import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import type { Route } from "../+types/root";

export default function SecurityRules() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Règles de sécurité</h1>
                    <p className="text-gray-600 mb-8">Nos bonnes pratiques pour des échanges sûrs entre voyageurs et expéditeurs.</p>

                    <div className="space-y-6">
                        <section className="rounded-2xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Objets autorisés et interdits</h2>
                            <p className="text-gray-700">Respectez la réglementation aérienne. Sont interdits: matières inflammables, armes, produits illégaux, et tout objet dangereux. En cas de doute, contactez notre support.</p>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Vérification d'identité</h2>
                            <p className="text-gray-700">Complétez votre profil avec des informations exactes. Nous recommandons une pièce d'identité vérifiée avant tout échange.</p>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Remise et scellage des colis</h2>
                            <p className="text-gray-700">Prenez des photos du contenu, scellez le colis en présence des deux parties et ajoutez une étiquette claire (nom, numéro, destination).</p>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Paiement sécurisé</h2>
                            <p className="text-gray-700">Effectuez les paiements uniquement via la plateforme. N'envoyez jamais d'argent en dehors du système.</p>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Communication sur la plateforme</h2>
                            <p className="text-gray-700">Privilégiez la messagerie intégrée pour garder une trace des échanges et signaler tout comportement suspect.</p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export const meta: Route.MetaFunction = () => {
    return [
        { title: 'Règles de sécurité - GoHappyGo' },
        { name: 'description', content: 'Consignes et bonnes pratiques de sécurité pour les échanges sur GoHappyGo.' }
    ];
};


