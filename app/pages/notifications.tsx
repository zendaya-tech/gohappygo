import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import Header from '~/components/layout/Header';
import FooterMinimal from '~/components/layout/FooterMinimal';
import { notificationService, type Notification } from "~/services/notificationService";
import { useInfiniteScroll } from "~/hooks/useInfiniteScroll";

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "à l'instant";
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 172800) return "hier";
  if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Load initial notifications
  useEffect(() => {
    loadNotifications(1, true);
  }, [filter]);

  const loadNotifications = async (page: number, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      }

      const query: any = { page, limit: 20 };
      if (filter === "unread") {
        query.isRead = false;
      }

      const response = await notificationService.getNotifications(query);
      
      if (reset) {
        setNotifications(response.items);
      } else {
        setNotifications((prev) => [...prev, ...response.items]);
      }

      // Calculate if there are more pages
      const hasNextPage = response.meta ? response.meta.page < response.meta.totalPages : false;
      setHasMore(hasNextPage);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Erreur lors du chargement des notifications");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await loadNotifications(nextPage, false);
  }, [loadingMore, hasMore, currentPage]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleClearRead = async () => {
    try {
      await notificationService.clearReadNotifications();
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch (error) {
      console.error("Failed to clear read notifications:", error);
    }
  };

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading: loadingMore,
    threshold: 300,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 mt-16">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Toutes vos notifications sont lues"}
              </p>
            </div>
            <Link
              to="/profile"
              className="text-sm text-blue-600 hover font-medium"
            >
              ← Retour au profil
            </Link>
          </div>

          {/* Filter and Actions Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover"
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "unread"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover"
                }`}
              >
                Non lues {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover/20 transition-colors"
                >
                  Tout marquer lu
                </button>
              )}
              <button
                onClick={handleClearRead}
                className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover/20 transition-colors"
              >
                Effacer les lues
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50/20 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune notification
            </h3>
            <p className="text-gray-500">
              {filter === "unread" 
                ? "Vous n'avez aucune notification non lue"
                : "Vous n'avez aucune notification pour le moment"}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl border transition-all hover:shadow-md ${
                    !notification.isRead
                      ? "border-blue-200 bg-blue-50/30/10"
                      : "border-gray-200"
                  }`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      {/* Unread indicator */}
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            !notification.isRead ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {notification.message}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-blue-600 hover font-medium"
                            >
                              Marquer comme lu
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-xs text-red-600 hover font-medium"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="w-full py-8">
              {loadingMore && (
                <div className="flex justify-center items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              )}
              {!hasMore && notifications.length > 0 && (
                <p className="text-center text-sm text-gray-500">
                  Vous avez vu toutes vos notifications
                </p>
              )}
            </div>
          </>
        )}
      </main>

      <FooterMinimal />
    </div>
  );
}
