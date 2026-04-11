import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { io, type Socket } from 'socket.io-client';
import { getRequests, type RequestResponse } from '~/services/requestService';
import { getUnreadCount } from '~/services/messageService';
import { useAuth } from '~/hooks/useAuth';
import { useAuthStore } from '~/store/auth';

interface Conversation {
  id: number;
  requestId: number;
  otherUser: {
    id: number;
    name: string;
    avatar: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: number;
  };
  lastMessageDateTime?: string | null;
  unreadCount: number;
  travel: {
    departureAirport?: { name: string };
    arrivalAirport?: { name: string };
    flightNumber?: string;
  };
}

type ConversationMessageUpdateDetail = {
  requestId: number;
  content?: string;
  createdAt: string;
  senderId: number;
};

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: number;
  onConversationRead?: (conversationId: number, unreadCount: number) => void;
  initialRequestId?: number | null;
}

export default function ConversationList({
  onSelectConversation,
  selectedConversationId,
  onConversationRead,
  initialRequestId,
}: ConversationListProps) {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const { user } = useAuth();
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const sortConversationsByLatestMessage = (items: Conversation[]) => {
    return [...items].sort((a, b) => {
      const aTime = a.lastMessageDateTime ? new Date(a.lastMessageDateTime).getTime() : 0;
      const bTime = b.lastMessageDateTime ? new Date(b.lastMessageDateTime).getTime() : 0;
      return bTime - aTime;
    });
  };

  const mapRequestsToConversations = (requests: RequestResponse[]): Conversation[] => {
    return sortConversationsByLatestMessage(
      requests
        .filter((request) => {
          return request.requester && request.travel;
        })
        .map((request) => {
          let otherUser;

          if (request.requester.id === Number(user?.id)) {
            otherUser = {
              id: request.travel!.owner!.id,
              name: `${request.travel!.owner!.fullName}`,
              avatar: (request.travel!.owner as any)?.profilePictureUrl || '/favicon.ico',
            };
          } else {
            otherUser = {
              id: request.requester!.id,
              name: `${request.requester!.fullName}`,
              avatar: (request.requester as any)?.profilePictureUrl || '/favicon.ico',
            };
          }

          return {
            id: request.id,
            requestId: request.id,
            otherUser,
            lastMessageDateTime: request.lastMessageDateTime || null,
            unreadCount: request.unReadMessages || 0,
            travel: {
              departureAirport: request.travel?.departureAirport,
              arrivalAirport: request.travel?.arrivalAirport,
              flightNumber: request.travel?.flightNumber,
            },
          };
        })
        .filter((conversation) => {
          return conversation.otherUser.id !== Number(user?.id);
        })
    );
  };

  const applyConversationMessageUpdate = (
    items: Conversation[],
    detail: ConversationMessageUpdateDetail,
    markAsUnread: boolean
  ) => {
    return sortConversationsByLatestMessage(
      items.map((conversation) => {
        if (conversation.requestId !== detail.requestId) return conversation;

        const shouldKeepRead = selectedConversationId && conversation.id === selectedConversationId;

        return {
          ...conversation,
          lastMessage: detail.content
            ? {
                content: detail.content,
                createdAt: detail.createdAt,
                senderId: detail.senderId,
              }
            : conversation.lastMessage,
          lastMessageDateTime: detail.createdAt,
          unreadCount:
            markAsUnread && !shouldKeepRead ? conversation.unreadCount + 1 : conversation.unreadCount,
        };
      })
    );
  };

  const handleSelectConversation = useCallback((conversation: Conversation) => {
    // Mark conversation as read locally
    if (conversation.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((conv) => (conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv))
      );

      // Update total unread count
      setTotalUnreadCount((prev) => Math.max(0, prev - conversation.unreadCount));

      // Notify parent
      onConversationRead?.(conversation.id, conversation.unreadCount);
    }

    // Call the original callback
    onSelectConversation(conversation);
  }, [onConversationRead, onSelectConversation]);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);

      const requestsResponse = await getRequests(1, 1000);
      const requests = requestsResponse.items || [];

      const unreadCount = await getUnreadCount();
      setTotalUnreadCount(unreadCount);

      const conversationList = mapRequestsToConversations(requests);
      setConversations(conversationList);

      if (initialRequestId) {
        const conversationToSelect = conversationList.find((conv) => conv.requestId === initialRequestId);
        if (conversationToSelect) {
          handleSelectConversation(conversationToSelect);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [handleSelectConversation, initialRequestId, user?.id, t]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const handleConversationMessageUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<ConversationMessageUpdateDetail>;
      if (!customEvent.detail?.requestId) return;

      setConversations((prev) =>
        applyConversationMessageUpdate(prev, customEvent.detail, false)
      );
    };

    window.addEventListener('conversation-message-updated', handleConversationMessageUpdate);
    return () => {
      window.removeEventListener('conversation-message-updated', handleConversationMessageUpdate);
    };
  }, [selectedConversationId]);

  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const socket: Socket = io('https://api.gohappygo.fr/messages', {
      auth: { token },
      transports: ['websocket'],
      timeout: 20000,
      forceNew: true,
    });

    socket.on('message-notification', (payload: { requestId?: number; unreadCount?: number }) => {
      if (typeof payload?.unreadCount === 'number') {
        setTotalUnreadCount(payload.unreadCount);
      } else {
        setTotalUnreadCount((prev) => prev + 1);
      }

      if (!payload?.requestId) return;

      const requestId = payload.requestId;

      setConversations((prev) =>
        applyConversationMessageUpdate(
          prev,
          {
            requestId,
            createdAt: new Date().toISOString(),
            senderId: 0,
          },
          true
        )
      );
    });

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    socket.on(
      'request-list-refresh',
      (_payload: { requestId?: number; event?: string; timestamp?: string }) => {
        if (refreshTimer) {
          clearTimeout(refreshTimer);
        }

        refreshTimer = setTimeout(async () => {
          try {
            await loadConversations();
          } catch (error) {
            console.error('Error refreshing conversations after request update:', error);
          }
        }, 350);
      }
    );

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
      socket.disconnect();
    };
  }, [isLoggedIn, token, selectedConversationId, user?.id, t]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return t('profile.messages.time.minutesAgo');
    } else if (diffInHours < 24) {
      return t('profile.messages.time.hoursAgo', { count: Math.floor(diffInHours) });
    } else {
      return t('profile.messages.time.daysAgo', { count: Math.floor(diffInHours / 24) });
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">{t('profile.messages.noConversations')}</p>
        <p className="text-gray-400 text-sm mt-2">{t('profile.messages.conversationsDesc')}</p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 min-h-[72px] flex items-center border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-semibold text-gray-900">{t('profile.messages.messagesTitle')}</h3>
          {totalUnreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {totalUnreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Conversations */}
      <div className="custom-scrollbar flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => handleSelectConversation(conversation)}
            className={`p-4 hover cursor-pointer transition-colors ${
              selectedConversationId === conversation.id
                ? 'bg-blue-50 border-r-2 border-blue-500'
                : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={conversation.otherUser.avatar}
                  alt={conversation.otherUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conversation.otherUser.name}
                  </p>
                  {conversation.lastMessageDateTime && (
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessageDateTime)}
                    </span>
                  )}
                </div>

                {/* Travel info */}
                <p className="text-xs text-gray-500 mb-1">
                  {conversation.travel.departureAirport?.name} →{' '}
                  {conversation.travel.arrivalAirport?.name}
                  {conversation.travel.flightNumber &&
                    ` • ${t('profile.messages.flight')} ${conversation.travel.flightNumber}`}
                </p>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
