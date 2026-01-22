import { useState } from "react";

interface ShareDialogProps {
    open: boolean;
    onClose: () => void;
    listing: {
        title: string;
        location: string;
        rating: number;
        bedrooms: number;
        beds: number;
        bathrooms: number;
        image: string;
    };
}

export default function ShareDialog({ open, onClose, listing }: ShareDialogProps) {
    const [copied, setCopied] = useState(false);

    if (!open) return null;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    };

    const shareOptions = [
        {
            name: "Copier le lien",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-9 8h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v8" />
                </svg>
            ),
            action: handleCopyLink,
            primary: true
        },
        {
            name: "E-mail",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            action: () => window.open(`mailto:?subject=${encodeURIComponent(listing.title)}&body=${encodeURIComponent(window.location.href)}`)
        },
        {
            name: "Messages",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            action: () => { }
        },
        {
            name: "WhatsApp",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.62-6.03C.122 5.281 5.403 0 12.06 0c3.183 0 6.167 1.24 8.413 3.488a11.82 11.82 0 013.48 8.408c-.003 6.657-5.284 11.938-11.94 11.938-2.011 0-3.985-.508-5.744-1.472L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.593 5.448.003 9.886-4.431 9.889-9.88.002-5.462-4.415-9.885-9.881-9.888-5.45-.003-9.887 4.43-9.889 9.881a9.82 9.82 0 001.63 5.357l-.999 3.648 3.858-.711zM17.47 14.33c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.007-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
            ),
            action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${listing.title} - ${window.location.href}`)}`)
        },
        {
            name: "Messenger",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 4.925 0 11c0 5.514 3.163 10.292 7.75 12.438-.312-.937-.5-1.945-.5-3 0-3.314 2.686-6 6-6s6 2.686 6 6c0 1.055-.188 2.063-.5 3C20.837 21.292 24 16.514 24 11c0-6.075-5.373-11-12-11z" />
                </svg>
            ),
            action: () => window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=YOUR_APP_ID`)
        },
        {
            name: "Facebook",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.57V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
                </svg>
            ),
            action: () => {
                // Facebook utilise les métadonnées Open Graph de la page
                // Le paramètre quote ajoute un texte supplémentaire au partage
                const shareText = "Allez sur GoHappyGo pour réagir à cette annonce !";
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${shareText}`)
            }
        },
        {
            name: "Twitter",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.87-2.35 8.54 8.54 0 0 1-2.71 1.04 4.26 4.26 0 0 0-7.26 3.88A12.1 12.1 0 0 1 3.16 4.9a4.25 4.25 0 0 0 1.32 5.68 4.21 4.21 0 0 1-1.93-.53v.05a4.26 4.26 0 0 0 3.42 4.18c-.47.13-.96.2-1.46.08a4.27 4.27 0 0 0 3.98 2.96A8.54 8.54 0 0 1 2 19.54a12.06 12.06 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2v-.56A8.56 8.56 0 0 0 22.46 6z" />
                </svg>
            ),
            action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(listing.title)}`)
        },
        {
            name: "Intégrer",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            ),
            action: () => { }
        },
        {
            name: "Plus d'options",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            ),
            action: () => { }
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />
            <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Partager cette annonce</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Listing Preview */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{listing.title}</h3>
                            <p className="text-sm text-gray-600">
                                {listing.location} • ★{listing.rating}

                            </p>
                        </div>
                    </div>
                </div>

                {/* Sharing Options Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-3 gap-3">
                        {shareOptions.map((option, index) => (
                            <button
                                key={index}
                                onClick={option.action}
                                className={`flex  items-center justify-center p-2 rounded-xl border transition-all duration-200 ${option.primary
                                    ? 'border-blue-500 bg-blue-50 hover'
                                    : 'border-gray-200 hover hover'
                                    }`}
                            >
                                <div className={`w-8 h-8 flex items-center justify-center  ${option.primary ? 'text-blue-600' : 'text-gray-600'
                                    }`}>
                                    {option.icon}
                                </div>
                                <span className={`text-xs font-medium ${option.primary ? 'text-blue-600' : 'text-gray-700'
                                    }`}>
                                    {option.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Copy Link Success Message */}
                    {copied && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 text-center">
                                Lien copié avec succès ! ✓
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
