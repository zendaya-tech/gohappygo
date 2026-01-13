import { useEffect, useRef, useReducer, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '~/store/auth';

export interface SocketMessage {
  type: 'message' | 'typing' | 'user_joined' | 'user_left' | 'error';
  data: any;
}

export interface ChatMessage {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    profilePictureUrl?: string;
  };
}

interface UseSocketIOOptions {
  requestId?: number;
  onMessage?: (message: ChatMessage) => void;
  onTyping?: (userId: number, isTyping: boolean) => void;
  onUserJoined?: (userId: number) => void;
  onUserLeft?: (userId: number) => void;
  onError?: (error: string) => void;
}

// Socket state
interface SocketState {
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  error: string | null;
}

// Socket actions
type SocketAction =
  | { type: 'CONNECTING' }
  | { type: 'CONNECTED' }
  | { type: 'DISCONNECTED' }
  | { type: 'ERROR'; payload: string }
  | { type: 'RECONNECT_ATTEMPT' }
  | { type: 'RESET_ATTEMPTS' };

// Initial state
const initialState: SocketState = {
  isConnected: false,
  isConnecting: false,
  reconnectAttempts: 0,
  error: null,
};

// Reducer
function socketReducer(state: SocketState, action: SocketAction): SocketState {
  switch (action.type) {
    case 'CONNECTING':
      return {
        ...state,
        isConnecting: true,
        error: null,
      };
    case 'CONNECTED':
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        reconnectAttempts: 0,
        error: null,
      };
    case 'DISCONNECTED':
      return {
        ...state,
        isConnected: false,
        isConnecting: false,
      };
    case 'ERROR':
      return {
        ...state,
        isConnecting: false,
        error: action.payload,
      };
    case 'RECONNECT_ATTEMPT':
      return {
        ...state,
        reconnectAttempts: state.reconnectAttempts + 1,
      };
    case 'RESET_ATTEMPTS':
      return {
        ...state,
        reconnectAttempts: 0,
      };
    default:
      return state;
  }
}

export const useSocketIO = (options: UseSocketIOOptions = {}) => {
  const { requestId, onMessage, onTyping, onUserJoined, onUserLeft, onError } = options;
  const [state, dispatch] = useReducer(socketReducer, initialState);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const optionsRef = useRef(options);
  const maxReconnectAttempts = 5;
  
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // Update options ref when they change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (state.reconnectAttempts >= maxReconnectAttempts) {
      return;
    }

    clearReconnectTimeout();
    const delay = Math.min(1000 * Math.pow(2, state.reconnectAttempts), 30000);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      dispatch({ type: 'RECONNECT_ATTEMPT' });
      connect();
    }, delay);
  }, [state.reconnectAttempts]);

  const connect = useCallback(() => {
    if (!isLoggedIn || !token || !requestId) {
      return;
    }

    if (socketRef.current?.connected || state.isConnecting) {
      return;
    }

    dispatch({ type: 'CONNECTING' });
    clearReconnectTimeout();
    
    try {
      const socket = io("https://api.gohappygo.fr/messages", {
        auth: {
          token: token,
        },
        transports: ['websocket'],
        reconnection: false, // We handle reconnection manually
        timeout: 20000,
        forceNew: true
      });
      
      socket.on('connect', () => {
        console.log('Socket.IO connected');
        dispatch({ type: 'CONNECTED' });
        
        // Join the thread (matching test client)
        socket.emit('join-thread', { requestId });
      });

      socket.on('joined-thread', (data: { requestId: number; roomName: string; message: string }) => {
        console.log('Joined thread successfully:', data);
      });

      socket.on('new-message', (data: ChatMessage) => {
        optionsRef.current.onMessage?.(data);
      });

      socket.on('user-typing', (data: { userId: number; isTyping: boolean }) => {
        optionsRef.current.onTyping?.(data.userId, data.isTyping);
      });

      socket.on('marked-read', (data: { requestId: number; success: boolean }) => {
        console.log('Messages marked as read:', data);
      });

      socket.on('messages-read', (data: { userId: number; requestId: number }) => {
        console.log(`User ${data.userId} has read messages in request ${data.requestId}`);
      });

      socket.on('user-joined-thread', (data: { userId: number; userName: string }) => {
        console.log(`User ${data.userName} joined the thread`);
        optionsRef.current.onUserJoined?.(data.userId);
      });

      socket.on('user-left-thread', (data: { userId: number }) => {
        console.log(`User ${data.userId} left the thread`);
        optionsRef.current.onUserLeft?.(data.userId);
      });

      socket.on('error', (error: any) => {
        console.error('Socket.IO error:', error);
        const errorMessage = error.message || 'Connection error';
        dispatch({ type: 'ERROR', payload: errorMessage });
        optionsRef.current.onError?.(errorMessage);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected:', reason);
        dispatch({ type: 'DISCONNECTED' });

        // Only attempt to reconnect if it wasn't a manual disconnect
        if (reason !== 'io client disconnect' && state.reconnectAttempts < maxReconnectAttempts) {
          scheduleReconnect();
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        const errorMessage = 'Failed to connect';
        dispatch({ type: 'ERROR', payload: errorMessage });
        optionsRef.current.onError?.(errorMessage);
        
        // Attempt to reconnect on connection error
        if (state.reconnectAttempts < maxReconnectAttempts) {
          scheduleReconnect();
        }
      });

      socketRef.current = socket;
    } catch (error) {
      console.error('Failed to create Socket.IO connection:', error);
      const errorMessage = 'Failed to connect';
      dispatch({ type: 'ERROR', payload: errorMessage });
      optionsRef.current.onError?.(errorMessage);
    }
  }, [isLoggedIn, token, requestId, state.isConnecting, state.reconnectAttempts, clearReconnectTimeout, scheduleReconnect]);

  const disconnect = useCallback(() => {
    clearReconnectTimeout();
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    dispatch({ type: 'DISCONNECTED' });
    dispatch({ type: 'RESET_ATTEMPTS' });
  }, [clearReconnectTimeout]);

  const sendMessage = useCallback((content: string, receiverId?: number) => {
    if (socketRef.current?.connected && requestId) {
      const messageData: any = {
        requestId,
        content
      };
      
      // Add receiverId if provided
      if (receiverId) {
        messageData.receiverId = receiverId;
      }
      
      socketRef.current.emit('send-message', messageData);
      return true;
    }
    return false;
  }, [requestId]);



  const markAsRead = useCallback(() => {
    if (socketRef.current?.connected && requestId) {
      socketRef.current.emit('mark-read', {
        requestId
      });
      return true;
    }
    return false;
  }, [requestId]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (socketRef.current?.connected && requestId) {
      socketRef.current.emit('typing', {
        requestId,
        isTyping
      });
    }
  }, [requestId]);

  // Connect when dependencies change
  useEffect(() => {
    if (requestId && isLoggedIn && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [requestId, isLoggedIn, token]); // Removed connect/disconnect from deps to avoid loops

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearReconnectTimeout();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [clearReconnectTimeout]);

  return {
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
    reconnectAttempts: state.reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    markAsRead
  };
};