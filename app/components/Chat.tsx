import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocketIO, type ChatMessage } from '~/hooks/useSocketIO';
import { getMessageThread, markThreadAsRead, type ThreadMessage } from '~/services/messageService';
import { useAuthStore } from '~/store/auth';

interface ChatProps {
  requestId: number;
  otherUser: {
    id: number;
    name: string;
    avatar: string;
  };
  onClose?: () => void;
}

export default function Chat({ requestId, otherUser, onClose }: ChatProps) {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentUser = useAuthStore((state) => state.user);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleNewMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => {
      // Avoid duplicates
      if (prev.some(m => m.id === message.id)) {
        return prev;
      }
      return [...prev, {
        ...message,
        isRead: message.senderId === Number(currentUser?.id)
      }];
    });
    
    // Mark as read if not from current user
    if (message.senderId !== Number(currentUser?.id)) {
      // Use socket markAsRead first, fallback to HTTP
      if (!markAsRead()) {
        markThreadAsRead(requestId).catch(console.error);
      }
    }
  }, [requestId, currentUser?.id]);

  const handleTyping = useCallback((userId: number, isTyping: boolean) => {
    setTypingUsers(prev => {
      const newSet = new Set(prev);
      if (isTyping) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  }, []);

  const { isConnected, sendMessage, sendTyping, markAsRead } = useSocketIO({
    requestId,
    
    onMessage: handleNewMessage,
    onTyping: handleTyping,
    onError: (error) => console.error('Socket.IO error:', error)
  });

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const response = await getMessageThread(requestId, 1, 20);
        setMessages(response.items); // Reverse to show oldest first
        setHasMore(response.meta.hasNextPage);
        setPage(1);
        
        // Mark as read
        if (!markAsRead()) {
          await markThreadAsRead(requestId);
        }
        
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [requestId]);

  // Load more messages
  const loadMoreMessages = async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await getMessageThread(requestId, nextPage, 20);
      
      setMessages(prev => [...response.items.reverse(), ...prev]);
      setHasMore(response.meta.hasNextPage);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    
    try {
      const success = sendMessage(newMessage.trim());
      if (success) {
        setNewMessage('');
        // Stop typing indicator
        sendTyping(false);
      } else {
        throw new Error('Failed to send message via WebSocket');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (value: string) => {
    setNewMessage(value);
    
    // Send typing indicator
    if (value.trim()) {
      sendTyping(true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(false);
      }, 2000);
    } else {
      sendTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: ThreadMessage[] }, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={otherUser.avatar}
            alt={otherUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{otherUser.name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {isConnected ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>En ligne</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Hors ligne</span>
                </>
              )}
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4"
        onScroll={(e) => {
          const { scrollTop } = e.currentTarget;
          if (scrollTop === 0 && hasMore && !loadingMore) {
            loadMoreMessages();
          }
        }}
      >
        {loadingMore && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
        
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="text-center my-4">
              <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border">
                {formatDate(dayMessages[0].createdAt)}
              </span>
            </div>
            
            {/* Messages for this date */}
            {dayMessages.map((message, index) => {
              const isOwn = message.senderId === Number(currentUser?.id);
              const showAvatar = !isOwn && (
                index === 0 || 
                dayMessages[index - 1]?.senderId !== message.senderId
              );
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  {!isOwn && (
                    <div className="w-8 mr-2">
                      {showAvatar && (
                        <img
                          src={message.sender.profilePictureUrl || otherUser.avatar}
                          alt={message.sender.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                    </div>
                  )}
                  
                  <div className={`max-w-xs lg:max-w-md ${isOwn ? 'ml-auto' : ''}`}>
                    <div
                      className={`px-4 py-2 rounded-lg shadow-sm ${
                        isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Typing indicator */}
        {typingUsers.size > 0 && (
          <div className="flex justify-start mb-2">
            <div className="w-8 mr-2"></div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">En train d'écrire...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tapez votre message..."
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={sending || !isConnected}
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending || !isConnected}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        
        {!isConnected && (
          <div className="mt-2 text-xs text-red-600 text-center">
            Connexion perdue. Tentative de reconnexion...
          </div>
        )}
      </div>
    </div>
  );
}