import { useEffect, useMemo, useState } from "react";

type Conversation = {
    id: string;
    contactName: string;
    lastMessageSnippet: string;
    lastMessageAt: string; // ISO string
};

type Message = {
    id: string;
    sender: "me" | "them";
    text: string;
    sentAt: string; // ISO string
};

function useAuthStatus(): { isLoggedIn: boolean; hydrated: boolean } {
    const [hydrated, setHydrated] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setHydrated(true);
        const check = () => {
            try {
                const token = window.localStorage.getItem("auth_token");
                setIsLoggedIn(Boolean(token));
            } catch {
                setIsLoggedIn(false);
            }
        };
        check();
        const onStorage = (e: StorageEvent) => {
            if (e.key === "auth_token") check();
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    return { isLoggedIn, hydrated };
}

function useRecentConversations(): Conversation[] {
    // In a real app, fetch from your API here.
    // For now, return a memoized sample list.
    return useMemo(
        () => [
            {
                id: "1",
                contactName: "Alice Martin",
                lastMessageSnippet: "On se retrouve à 18h devant la gare ?",
                lastMessageAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            },
            {
                id: "2",
                contactName: "Equipe Support",
                lastMessageSnippet: "Votre demande a été prise en compte.",
                lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            },
            {
                id: "3",
                contactName: "Jean Dupont",
                lastMessageSnippet: "Parfait, merci beaucoup !",
                lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            },
        ],
        []
    );
}

function formatDate(iso: string): string {
    try {
        const d = new Date(iso);
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "short",
            timeStyle: "short",
        }).format(d);
    } catch {
        return iso;
    }
}

export default function ChatWidget() {
    const { isLoggedIn, hydrated } = useAuthStatus();
    const conversations = useRecentConversations();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [minimized, setMinimized] = useState(true);

    const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>(() => {
        const now = Date.now();
        const build = (name: string, offsetMin: number): Message[] => [
            { id: "m1", sender: "them", text: `Salut, c'est ${name}.`, sentAt: new Date(now - offsetMin * 60_000 - 120000).toISOString() },
            { id: "m2", sender: "me", text: "Hello! Dis-moi en plus.", sentAt: new Date(now - offsetMin * 60_000 - 60000).toISOString() },
            { id: "m3", sender: "them", text: "Parfait, on s'organise ici.", sentAt: new Date(now - offsetMin * 60_000).toISOString() }
        ];
        const map: Record<string, Message[]> = {};
        conversations.forEach((c, idx) => {
            map[c.id] = build(c.contactName, (idx + 1) * 15);
        });
        return map;
    });

    useEffect(() => {
        if (selectedId == null && conversations.length > 0) setSelectedId(conversations[0].id);
    }, [conversations, selectedId]);

    // if (!hydrated || !isLoggedIn) return null;

    if (minimized) {
        return (
            <button
                type="button"
                aria-label="Ouvrir le chat"
                onClick={() => setMinimized(false)}
                className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-white/10 hover hover active:translate-y-px transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <svg className="mx-auto h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5" />
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 3.866-3.582 7-8 7-1.07 0-2.086-.17-3.01-.48L4 20l1.49-3.735C5.177 15.34 5 14.69 5 14c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-5 right-5 z-40 w-[min(100vw-20px,1000px)] h-[70vh] rounded-2xl border border-gray-200 bg-white shadow-2xl grid grid-cols-1 md:grid-cols-[320px_1fr] overflow-hidden ">
            {/* Close button */}
            <button
                type="button"
                aria-label="Fermer le chat"
                onClick={() => setMinimized(true)}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover hover"
            >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" /></svg>
            </button>
            {/* Sidebar */}
            <aside className="flex h-full flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Chats</h3>
                    <span className="text-xs text-gray-500">{conversations.length}</span>
                </div>
                <div className="p-2 border-b border-gray-200">
                    <input placeholder="Rechercher..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-2">
                    <ul className="space-y-1">
                        {conversations.map((c) => (
                            <li key={c.id}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(c.id)}
                                    className={`w-full rounded-xl px-3 py-2 text-left transition flex items-start gap-3 ${selectedId === c.id ? "bg-indigo-50" : "hover"}`}
                                >
                                    <div className="mt-0.5 h-9 w-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                                        <span className="text-sm font-semibold">
                                            {c.contactName.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="truncate text-sm font-medium text-gray-900">{c.contactName}</p>
                                            <time className="shrink-0 text-[11px] text-gray-500">{formatDate(c.lastMessageAt)}</time>
                                        </div>
                                        <p className="mt-0.5 truncate text-xs text-gray-600">{c.lastMessageSnippet}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border-t border-gray-200 p-3">
                    <button type="button" className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover">Nouvelle conversation</button>
                </div>
            </aside>

            {/* Conversation pane */}
            <section className="flex h-full flex-col">
                {selectedId ? (
                    <ConversationView
                        key={selectedId}
                        messages={messagesByConversation[selectedId] ?? []}
                        contactName={conversations.find((c) => c.id === selectedId)?.contactName ?? "Contact"}
                        onSend={(text) => {
                            if (!text.trim()) return;
                            setMessagesByConversation((prev) => {
                                const next = { ...prev };
                                const list = next[selectedId] ? [...next[selectedId]] : [];
                                list.push({ id: String(Date.now()), sender: "me", text, sentAt: new Date().toISOString() });
                                next[selectedId] = list;
                                return next;
                            });
                        }}
                    />
                ) : (
                    <div className="m-auto text-center text-gray-500 text-sm">Sélectionnez une conversation</div>
                )}
            </section>
        </div>
    );
}


function ConversationView({ messages, contactName, onSend }: { messages: Message[]; contactName: string; onSend: (text: string) => void }) {
    const [draft, setDraft] = useState("");
    useEffect(() => {
        const container = document.getElementById("chat-scroll-container");
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages.length]);

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                        {contactName.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{contactName}</div>
                </div>
                <button className="text-xs text-gray-500 hover">Infos</button>
            </div>

            <div id="chat-scroll-container" className="flex-1 overflow-y-auto bg-gray-50 px-3 py-4">
                <div className="space-y-2">
                    {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow ${m.sender === "me" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white text-gray-900 rounded-bl-sm border border-gray-200"}`}>
                                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                                <div className={`mt-1 text-[10px] ${m.sender === "me" ? "text-indigo-100" : "text-gray-400"}`}>{formatDate(m.sentAt)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200 p-3">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSend(draft);
                        setDraft("");
                    }}
                    className="flex items-end gap-2"
                >
                    <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={1}
                        placeholder="Écrire un message"
                        className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                onSend(draft);
                                setDraft("");
                            }
                        }}
                    />
                    <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover">Envoyer</button>
                </form>
            </div>
        </div>
    );
}

