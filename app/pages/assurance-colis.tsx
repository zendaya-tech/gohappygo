import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import type { Route } from "../+types/root";

export default function AssuranceColis() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Assurance colis</h1>
                    <p className="text-gray-600 mb-8">Protégez vos envois grâce à notre couverture adaptée aux échanges entre particuliers.</p>

                    <div className="space-y-6">
                        <section className="rounded-2xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Ce qui est couvert</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                <li>Perte ou vol durant le transport</li>
                                <li>Dommages matériels avérés</li>
                                <li>Retards entraînant un préjudice (selon conditions)</li>
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Exclusions</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                <li>Objets interdits ou dangereux</li>
                                <li>Emballage insuffisant</li>
                                <li>Vices propres de l'objet</li>
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Comment déclarer un sinistre</h2>
                            <ol className="list-decimal pl-6 text-gray-700 space-y-1">
                                <li>Conservez les preuves (photos, messages, reçu)</li>
                                <li>Contactez le support via la plateforme sous 48h</li>
                                <li>Remplissez le formulaire dédié avec les pièces justificatives</li>
                            </ol>
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
        { title: 'Assurance colis - GoHappyGo' },
        { name: 'description', content: "Informations sur l'assurance et la couverture des colis." }
    ];
};


