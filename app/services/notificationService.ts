import api from './Api';

export interface Notification {
  id: number;
  userId: number;
  notificationType: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCounts {
  unreadCount: number;
  unread: number;
  total: number;
}

export interface PaginatedNotifications {
  items: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FindNotificationsQuery {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
}

export const notificationService = {
  async getNotifications(query?: FindNotificationsQuery): Promise<PaginatedNotifications> {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.isRead !== undefined) params.append('isRead', query.isRead.toString());
    if (query?.type) params.append('type', query.type);

    const response = await api.get(`/notification?${params.toString()}`);
    return response.data;
  },

  async getNotificationCounts(): Promise<NotificationCounts> {
    const response = await api.get('/notification/counts');
    return response.data;
  },

  async markAsRead(id: number): Promise<Notification> {
    const response = await api.patch(`/notification/${id}/read`);
    return response.data;
  },

  async markAllAsRead(): Promise<{ affected: number }> {
    const response = await api.patch('/notification/mark-all-read');
    return response.data;
  },

  async deleteNotification(id: number): Promise<void> {
    await api.delete(`/notification/${id}`);
  },

  async clearReadNotifications(): Promise<{ affected: number }> {
    const response = await api.delete('/notification/clear-read');
    return response.data;
  },
};
