import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_consent";

type ConsentValue = {
    status: "accepted" | "declined";
    timestamp: number;
};

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                setVisible(true);
            }
        } catch {
            setVisible(true);
        }
    }, []);

    if (!hydrated || !visible) return null;

    const save = (status: ConsentValue["status"]) => {
        try {
            const value: ConsentValue = { status, timestamp: Date.now() };
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        } catch { }
        setVisible(false);
    };

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4">
            <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-[1px] shadow-2xl">
                <div className="rounded-2xl bg-white p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-3 text-sm text-gray-700">
                            <div className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Nous utilisons des cookies</p>
                                <p className="mt-1 text-gray-600">
                                    Pour améliorer votre expérience, mesurer l'audience et personnaliser le contenu. En cliquant sur « Accepter »,
                                    vous consentez au stockage des cookies sur votre appareil.
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={() => save("declined")}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover"
                            >
                                Refuser
                            </button>
                            <button
                                type="button"
                                onClick={() => save("accepted")}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover"
                            >
                                Accepter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


