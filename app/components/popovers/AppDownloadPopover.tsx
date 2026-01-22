import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function AppDownloadPopover({ open, onClose, pinned, onTogglePin, triggerRef }: { open: boolean; onClose: () => void; pinned: boolean; onTogglePin: () => void; triggerRef?: React.RefObject<HTMLElement> }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

    useEffect(() => {
        if (!open) return;
        const onDocClick = (e: MouseEvent) => {
            if (pinned) return;
            const target = e.target as Node;
            const insidePanel = containerRef.current && containerRef.current.contains(target);
            const insideTrigger = triggerRef?.current && triggerRef.current.contains(target);
            if (!insidePanel && !insideTrigger) onClose();
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open, pinned, onClose, triggerRef]);

    useEffect(() => {
        if (open) {
            // Générer le QR code pour la page de téléchargement
            const downloadUrl = `${window.location.origin}/download-app`;
            QRCode.toDataURL(downloadUrl, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }).then(url => {
                setQrCodeUrl(url);
            }).catch(err => {
                console.error('Erreur lors de la génération du QR code:', err);
            });
        }
    }, [open]);
    if (!open) return null;

    return (
        <div
            ref={containerRef}
            className="absolute  top-full z-50 mt-2 w-64 overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200"
            role="dialog"
            aria-label="Télécharger l'application"
        >
            <div className="p-4 text-center">
                {/* QR Code */}
                <div className="w-40 h-40 mx-auto bg-white rounded-lg flex items-center justify-center mb-3 p-2">
                    {qrCodeUrl ? (
                        <img
                            src={qrCodeUrl}
                            alt="QR Code pour télécharger l'application"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                </div>

                <p className="text-xs text-gray-500 mb-3">
                    Scannez pour télécharger
                </p>
            </div>
        </div>
    );
}



