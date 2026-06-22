import api from '@/lib/axios';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  target: string;
  batch?: string;
  moduleId?: string;
  moduleName?: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
  readBy: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isRead?: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

export interface NotificationQuery {
  type?: string;
  unreadOnly?: boolean;
  limit?: number;
  skip?: number;
}

export const notificationApi = {
  getMyNotifications: (query?: NotificationQuery): Promise<NotificationResponse> =>
    api.get('/notifications/my', { params: query }),

  getUnreadCount: (): Promise<{ unreadCount: number }> =>
    api.get('/notifications/unread-count'),

  markAsRead: (id: string): Promise<{ message: string }> =>
    api.patch(`/notifications/${id}/read`),

  markAllAsRead: (): Promise<{ message: string }> =>
    api.patch('/notifications/mark-all-read'),
};
