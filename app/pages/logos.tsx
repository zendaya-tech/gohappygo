import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Logos() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Logos GoHappyGo</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 grid place-items-center text-white shadow">
                                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-xl font-bold">GoHappyGo</div>
                                <div className="text-sm text-gray-500">Logo principal</div>
                            </div>
                        </div>
                        <div className="mt-4 h-24 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600" />
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-gray-900 grid place-items-center text-white shadow">
                                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-xl font-bold">GoHappyGo</div>
                                <div className="text-sm text-gray-500">Monochrome</div>
                            </div>
                        </div>
                        <div className="mt-4 h-24 rounded-xl bg-gray-900" />
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-white grid place-items-center text-gray-900 shadow ring-1 ring-gray-200">
                                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-xl font-bold">GoHappyGo</div>
                                <div className="text-sm text-gray-500">Contour</div>
                            </div>
                        </div>
                        <div className="mt-4 h-24 rounded-xl bg-white ring-1 ring-gray-200" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

