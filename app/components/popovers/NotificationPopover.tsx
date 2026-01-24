import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { notificationService, type Notification } from "~/services/notificationService";

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "à l'instant";
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 172800) return "hier";
    if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { 
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getNotificationIcon(notificationType: string) {
    const icons = {
        // Request notifications
        REQUEST_SUBMITTED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
            color: "text-blue-600", 
            bg: "bg-blue-50" 
        },
        REQUEST_ACCEPTED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: "text-green-600", 
            bg: "bg-green-50" 
        },
        REQUEST_REJECTED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: "text-red-600", 
            bg: "bg-red-50" 
        },
        REQUEST_COMPLETED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: "text-green-600", 
            bg: "bg-green-50" 
        },
        REQUEST_CANCELLED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
            color: "text-gray-600", 
            bg: "bg-gray-50" 
        },
        REQUEST_DELIVERED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
            color: "text-green-600", 
            bg: "bg-green-50" 
        },
        
        // Review notifications
        REVIEW_RECEIVED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
            color: "text-amber-600", 
            bg: "bg-amber-50" 
        },
        
        // Travel/Demand notifications
        TRAVEL_PUBLISHED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
            color: "text-blue-600", 
            bg: "bg-blue-50" 
        },
        DEMAND_PUBLISHED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
            color: "text-purple-600", 
            bg: "bg-purple-50" 
        },
        TRAVEL_MATCHED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
            color: "text-yellow-600", 
            bg: "bg-yellow-50" 
        },
        DEMAND_MATCHED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
            color: "text-yellow-600", 
            bg: "bg-yellow-50" 
        },
        
        // Payment notifications
        PAYMENT_RECEIVED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: "text-emerald-600", 
            bg: "bg-emerald-50" 
        },
        PAYMENT_COMPLETED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: "text-green-600", 
            bg: "bg-green-50" 
        },
        TRANSACTION_CREATED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
            color: "text-blue-600", 
            bg: "bg-blue-50" 
        },
        
        // Account notifications
        ACCOUNT_VERIFIED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
            color: "text-green-600", 
            bg: "bg-green-50" 
        },
        ACCOUNT_VERIFICATION_FAILED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
            color: "text-red-600", 
            bg: "bg-red-50" 
        },
        VERIFICATION_DOCUMENTS_RECEIVED: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
            color: "text-blue-600", 
            bg: "bg-blue-50" 
        },
        
        // System notifications
        SYSTEM_ANNOUNCEMENT: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
            color: "text-indigo-600", 
            bg: "bg-indigo-50" 
        },
        
        // Default
        DEFAULT: { 
            svg: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
            color: "text-indigo-600", 
            bg: "bg-indigo-50" 
        }
    };
    
    return icons[notificationType as keyof typeof icons] || icons.DEFAULT;
}

function getNotificationLink(notification: Notification): string | null {
    const { notificationType, data } = notification;
    
    if (!data?.entityId) return null;
    
    const entityId = data.entityId;
    const entityType = data.entityType;
    
    // Demandes - Rediriger vers la page d'annonce avec type=demand
    if (notificationType?.includes('DEMAND') || entityType === 'DEMAND') {
        return `/announces?id=${entityId}&type=demand`;
    }
    
    // Annonces/Voyages - Rediriger vers la page d'annonce avec type=travel
    if (notificationType?.includes('ANNOUNCE') || notificationType?.includes('TRAVEL') || entityType === 'ANNOUNCE' || entityType === 'TRAVEL') {
        return `/announces?id=${entityId}&type=travel`;
    }
    
    // Réservations - Rediriger vers le tab réservations du profil
    if (notificationType?.includes('BOOKING') || notificationType?.includes('REQUEST') || entityType === 'BOOKING' || entityType === 'REQUEST') {
        return `/profile?section=reservations`;
    }
    
    // Messages - Rediriger vers le tab messages du profil
    if (notificationType?.includes('MESSAGE') || entityType === 'MESSAGE') {
        return `/profile?section=messages`;
    }
    
    // Avis - Rediriger vers le tab avis du profil
    if (notificationType?.includes('REVIEW') || entityType === 'REVIEW') {
        return `/profile?section=reviews`;
    }
    
    // Paiements - Rediriger vers le tab paiements du profil
    if (notificationType?.includes('PAYMENT') || entityType === 'PAYMENT') {
        return `/profile?section=payments`;
    }
    
    return null;
}

export default function NotificationPopover({
    open,
    onClose,
    onCountChange,
}: {
    open: boolean;
    onClose: () => void;
    onCountChange?: (count: number) => void;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            loadNotifications();
        }
    }, [open]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getNotifications({ limit: 10 });
            setNotifications(response.items);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications((prev) => {
                const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
                const unreadCount = updated.filter((n) => !n.isRead).length;
                onCountChange?.(unreadCount);
                return updated;
            });
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read if not already
        if (!notification.isRead) {
            await handleMarkAsRead(notification.id);
        }
        
        // Get the link and navigate
        const link = getNotificationLink(notification);
        if (link) {
            onClose();
            navigate(link);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            onCountChange?.(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    useEffect(() => {
        if (!open) return;
        
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        
        const onClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        
        // Delay adding the click listener to avoid immediate closure
        const timeoutId = setTimeout(() => {
            window.addEventListener("mousedown", onClickOutside);
        }, 0);
        
        window.addEventListener("keydown", onKey);
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("mousedown", onClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={containerRef}
            className="absolute right-0 top-full mt-3 w-96 overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-gray-900/5 backdrop-blur-xl"
            role="dialog"
            aria-label="Notifications"
            onMouseDown={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Notifications</h3>
                        {notifications.length > 0 && (
                            <p className="text-xs text-gray-500">
                                {notifications.filter(n => !n.isRead).length} non lue{notifications.filter(n => !n.isRead).length > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    aria-label="Fermer"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                    </svg>
                </button>
            </div>

            {/* Mark all as read button */}
            {notifications && notifications.some((n) => !n.isRead) && (
                <div className="px-6 py-2 border-b border-gray-100">
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                        ✓ Tout marquer comme lu
                    </button>
                </div>
            )}

            {/* Notifications List */}
            <ul className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                {loading ? (
                    <li className="px-6 py-12 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-3 text-sm text-gray-500">Chargement...</p>
                    </li>
                ) : notifications.length === 0 ? (
                    <li className="px-6 py-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Aucune notification</p>
                        <p className="text-xs text-gray-500 mt-1">Vous êtes à jour !</p>
                    </li>
                ) : (
                    notifications.map((n) => {
                        const iconData = getNotificationIcon(n.notificationType || 'DEFAULT');
                        const hasLink = getNotificationLink(n) !== null;
                        
                        return (
                            <li key={n.id}>
                                <button
                                    onClick={() => handleNotificationClick(n)}
                                    className={`w-full text-left px-4 py-3 transition-all duration-200 ${
                                        !n.isRead 
                                            ? 'bg-blue-50/30 hover:bg-blue-50/50' 
                                            : 'hover:bg-gray-50'
                                    } ${hasLink ? 'cursor-pointer' : 'cursor-default'} group`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className={`shrink-0 w-9 h-9 rounded-xl ${iconData.bg} ${iconData.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                                            {iconData.svg}
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-0.5">
                                                <h4 className={`text-xs font-semibold ${!n.isRead ? 'text-gray-900' : 'text-gray-700'} line-clamp-1`}>
                                                    {n.title}
                                                </h4>
                                                {!n.isRead && (
                                                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-1"></span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-2 mb-1.5">
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{formatTimeAgo(n.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </li>
                        );
                    })
                )}
            </ul>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="border-t border-gray-100 p-3">
                    <Link
                        to="/notifications"
                        onClick={onClose}
                        className="block rounded-xl px-4 py-3 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                        Voir toutes les notifications →
                    </Link>
                </div>
            )}
        </div>
    );
}
