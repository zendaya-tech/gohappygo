import api from './Api';

export interface SendMessageDto {
  requestId: number;
  content: string;
}

export interface MessageResponse {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    profilePictureUrl?: string;
  };
}

export interface ThreadMessage {
  id: number;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    profilePictureUrl?: string;
  };
}

export interface PaginatedThreadResponse {
  items: ThreadMessage[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  unreadCount: number;
}

// Send a message
export const sendMessage = async (dto: SendMessageDto): Promise<MessageResponse> => {
  try {
    const response = await api.post('/message/send', dto);
    return response.data.message;
  } catch (error: any) {
    console.error("Error sending message:", error);
    throw error?.response?.data || error;
  }
};

// Get message thread for a request
export const getMessageThread = async (
  requestId: number,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedThreadResponse> => {
  try {
    const response = await api.get(`/message/thread/${requestId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching message thread:", error);
    // Return empty response on error
    return {
      items: [],
      meta: {
        currentPage: 1,
        itemsPerPage: limit,
        totalItems: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
  }
};

// Mark thread as read
export const markThreadAsRead = async (requestId: number): Promise<void> => {
  try {
    await api.post(`/message/thread/${requestId}/mark-read`);
  } catch (error: any) {
    console.error("Error marking thread as read:", error);
    throw error?.response?.data || error;
  }
};

// Get unread message count
export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await api.get('/message/unread-count');
    return response.data.unreadCount;
  } catch (error: any) {
    console.error("Error fetching unread count:", error);
    return 0; // Return 0 on error
  }
};