import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FooterMinimal from '~/components/layout/FooterMinimal';

type Transporter = {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
    routes: string[];
    availableWeight: number;
};

export default function Transporters() {
    const transporters: Transporter[] = [
        {
            id: "t1",
            name: "Alice Martin",
            avatar:
                "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face",
            rating: 4.9,
            verified: true,
            routes: ["CDG → JFK", "CDG → LHR"],
            availableWeight: 10,
        },
        {
            id: "t2",
            name: "Thomas Leroy",
            avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            rating: 4.7,
            verified: true,
            routes: ["LYS → HND"],
            availableWeight: 6,
        },
        {
            id: "t3",
            name: "Sophie Laurent",
            avatar:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            rating: 4.6,
            verified: false,
            routes: ["MRS → LHR", "NCE → BCN"],
            availableWeight: 12,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">HappyVoyageurs</h1>
                    <p className="mt-2 text-gray-600">Trouvez un voyageur pour expédier vos colis.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {transporters.map((t) => (
                        <div
                            key={t.id}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                        >
                            <div className="mb-5 flex items-center gap-3">
                                <div className="relative">
                                    <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                                    {t.verified && (
                                        <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                                            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="truncate text-base font-semibold text-gray-900">{t.name}</h3>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50/20 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                                            <svg className="h-3.5 w-3.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {t.rating}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">Disponible: {t.availableWeight}kg</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs font-medium text-gray-500">Trajets</p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {t.routes.map((r) => (
                                        <span key={r} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover transition">
                                    Demander un transport
                                </button>
                                <button className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover">
                                    Contacter
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <FooterMinimal />
        </div>
    );
}

