import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function TermsPrivacy() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <section className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900">Conditions d’utilisation</h1>
                    <p className="mt-3 text-gray-600">
                        En utilisant GoHappyGo, vous acceptez nos conditions générales. Merci de lire attentivement ces
                        informations pour comprendre vos droits et responsabilités.
                    </p>
                    <div className="mt-6 space-y-4 text-gray-700">
                        <p>
                            1. GoHappyGo met en relation des personnes disposant d’espace disponible dans leurs bagages et des
                            personnes souhaitant expédier des objets. Les utilisateurs sont responsables du contenu transporté.
                        </p>
                        <p>
                            2. Les HappyVoyageurs s’engagent à respecter les lois en vigueur et à refuser tout objet dangereux ou
                            interdit. Les expéditeurs doivent décrire précisément le contenu et le poids.
                        </p>
                        <p>
                            3. Les paiements et remboursements suivent les modalités indiquées au moment de la demande.
                        </p>
                    </div>
                </section>

                <section className="max-w-3xl mx-auto mt-12">
                    <h2 className="text-2xl font-bold text-gray-900">Politique de confidentialité</h2>
                    <p className="mt-3 text-gray-600">
                        Nous respectons votre vie privée. Cette politique explique quelles données nous collectons, comment nous les
                        utilisons et vos droits.
                    </p>
                    <div className="mt-6 space-y-4 text-gray-700">
                        <p>
                            1. Nous collectons des informations de compte (nom, email), des données de profil et des informations
                            techniques pour améliorer le service.
                        </p>
                        <p>
                            2. Vos données ne sont partagées qu’avec votre consentement ou lorsque la loi l’exige.
                        </p>
                        <p>
                            3. Vous pouvez demander l’accès, la rectification ou la suppression de vos données.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

