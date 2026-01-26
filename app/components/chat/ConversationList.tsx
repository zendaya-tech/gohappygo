import { useState, useEffect } from 'react';
import { getRequests, type RequestResponse } from '~/services/requestService';
import { getUnreadCount } from '~/services/messageService';
import { useAuth } from '~/hooks/useAuth';

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
  unreadCount: number;
  travel: {
    departureAirport?: { name: string };
    arrivalAirport?: { name: string };
    flightNumber?: string;
  };
}

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: number;
  onConversationRead?: (conversationId: number) => void;
  initialRequestId?: number | null;
}

export default function ConversationList({ onSelectConversation, selectedConversationId, onConversationRead, initialRequestId }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const { user } = useAuth();

  const handleSelectConversation = (conversation: Conversation) => {
    // Mark conversation as read locally
    if (conversation.unreadCount > 0) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversation.id 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      // Update total unread count
      setTotalUnreadCount(prev => Math.max(0, prev - conversation.unreadCount));
      
      // Notify parent
      onConversationRead?.(conversation.id);
    }
    
    // Call the original callback
    onSelectConversation(conversation);
  };

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        
        // Get all requests (which represent conversations)
        const requestsResponse = await getRequests();
        const requests = requestsResponse.items || [];
        
        // Get total unread count
        const unreadCount = await getUnreadCount();
        setTotalUnreadCount(unreadCount);
        
        // Transform requests into conversations
        const conversationList: Conversation[] = requests
          .filter(request => {
            // Always include conversations - we'll determine the other user in the mapping
            return request.requester && request.travel;
          })
          .map(request => {
            // Determine who is the "other user" in the conversation
            let otherUser;
            
            if (request.requester.id === Number(user?.id)) {
              // If current user is the requester, show the travel owner as the other user
              otherUser = {
                id: request.travel!.owner!.id,
                name: `${request.travel!.owner!.fullName}`,
                avatar: (request.travel!.owner as any)?.profilePictureUrl || '/favicon.ico'
              };
            } else {
              // If current user is not the requester, show the requester as the other user
              otherUser = {
                id: request.requester!.id,
                name: `${request.requester!.fullName}`,
                avatar: (request.requester as any)?.profilePictureUrl || '/favicon.ico'
              };
            }

            return {
              id: request.id,
              requestId: request.id,
              otherUser,
              unreadCount: request.unReadMessages || 0, // Use unReadMessages from request
              travel: {
                departureAirport: request.travel?.departureAirport,
                arrivalAirport: request.travel?.arrivalAirport,
                flightNumber: request.travel?.flightNumber
              }
            };
          })
          .filter(conversation => {
            // Filter out any conversations where we couldn't determine the other user
            // or where the other user is somehow the same as current user
            return conversation.otherUser.id !== Number(user?.id);
          });
        
        setConversations(conversationList);
        
        // Auto-select conversation if initialRequestId is provided
        if (initialRequestId) {
          const conversationToSelect = conversationList.find(
            conv => conv.requestId === initialRequestId
          );
          if (conversationToSelect) {
            handleSelectConversation(conversationToSelect);
          }
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user?.id, initialRequestId]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Il y a quelques minutes';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 48) {
      return 'Il y a 1j';
    } else {
      return `Il y a ${Math.floor(diffInHours / 24)}j`;
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">Aucune conversation</p>
        <p className="text-gray-400 text-sm mt-2">
          Vos conversations avec les voyageurs apparaîtront ici
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Messages</h3>
          {totalUnreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {totalUnreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Conversations */}
      <div className="divide-y divide-gray-100">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => handleSelectConversation(conversation)}
            className={`p-4 hover cursor-pointer transition-colors ${
              selectedConversationId === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
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
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                
                {/* Travel info */}
                <p className="text-xs text-gray-500 mb-1">
                  {conversation.travel.departureAirport?.name} → {conversation.travel.arrivalAirport?.name}
                  {conversation.travel.flightNumber && ` • Vol ${conversation.travel.flightNumber}`}
                </p>
                
                {/* Last message */}
                {conversation.lastMessage && (
                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                  }`}>
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}