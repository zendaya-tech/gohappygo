import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const steps = [
    {
        title: "Publiez ou trouvez une annonce",
        desc: "Voyageurs: publiez vos kilos disponibles. Expéditeurs: trouvez un trajet correspondant.",
        icon: (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4-9 4-9-4z" />
            </svg>
        ),
    },
    {
        title: "Faites une demande de voyage",
        desc: "Indiquez le poids à expédier, les détails et vos préférences. Le HappyVoyageur valide ou vous contacte.",
        icon: (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
            </svg>
        ),
    },
    {
        title: "Rencontrez et expédiez en sécurité",
        desc: "Remise du colis à l’aéroport selon les règles. Paiement sécurisé et suivi des échanges.",
        icon: (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5v14" />
            </svg>
        ),
    },
];

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-3xl font-bold text-gray-900">Comment ça marche</h1>
                    <p className="mt-2 text-gray-600">
                        Plateforme Go & Go: une personne poste ses kilos disponibles, d’autres en font la demande pour expédier.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {steps.map((s) => (
                            <div key={s.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white grid place-items-center">
                                    {s.icon}
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
                                <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

