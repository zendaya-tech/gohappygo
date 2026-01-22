import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Faq = { q: string; a: string };

const faqs: Faq[] = [
    {
        q: "Comment fonctionne GoHappyGo ?",
        a: "Des voyageurs proposent l’espace disponible dans leurs bagages. Vous pouvez leur demander de transporter vos colis (au kilo).",
    },
    {
        q: "Quels objets sont interdits ?",
        a: "Tout objet dangereux, illégal ou interdit par les compagnies aériennes et les douanes est strictement prohibé.",
    },
    {
        q: "Comment payer ?",
        a: "Le prix est généralement fixé au kilo. Le paiement est sécurisé via la plateforme.",
    },
    {
        q: "Comment contacter un HappyVoyageur ?",
        a: "Depuis une annonce, utilisez les boutons ‘Demander un transport’ ou ‘Contacter’ pour envoyer votre message.",
    },
    {
        q: "Comment définir le poids à expédier ?",
        a: "Indiquez le poids estimé en kilogrammes. Le HappyVoyageur confirmera la disponibilité restante.",
    },
];

function highlight(text: string, query: string) {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    const parts = text.split(regex);
    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="rounded bg-yellow-100 px-0.5 text-yellow-900">
                {part}
            </mark>
        ) : (
            <span key={i}>{part}</span>
        )
    );
}

export default function HelpCenter() {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return faqs;
        return faqs.filter(
            (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
        );
    }, [query]);

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Centre d’aide</h1>
                        <p className="mt-2 text-gray-600">
                            Recherchez une question ou parcourez les thèmes fréquents.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="sticky top-0 z-10 mb-6 rounded-2xl border border-gray-200 bg-white/80 p-2 backdrop-blur supports-[backdrop-filter]/60">
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/30">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                            </svg>
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Rechercher une question..."
                                aria-label="Rechercher une question dans le centre d’aide"
                                className="w-full bg-transparent text-sm outline-none placeholder"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery("")}
                                    className="rounded-full p-1 text-gray-500 hover"
                                    aria-label="Effacer la recherche"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    {filtered.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-600">
                            Aucune question ne correspond à « {query} ».
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((f, idx) => (
                                <details
                                    key={f.q}
                                    className="group rounded-xl border border-gray-200 bg-white p-4 open:shadow-sm"
                                    open={idx === 0 && !query}
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                                        <span className="text-base font-medium text-gray-900">{highlight(f.q, query)}</span>
                                        <span className="rounded-full bg-gray-100 p-2 text-gray-500 group-open:rotate-45 transition">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <div className="mt-3 text-gray-700 text-sm leading-6">{highlight(f.a, query)}</div>
                                </details>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

