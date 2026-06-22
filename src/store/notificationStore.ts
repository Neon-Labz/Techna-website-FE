import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { notificationApi, type Notification, type NotificationQuery } from '@/api/notification.api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  loading: boolean;
  socket: Socket | null;

  // Actions
  connect: (token: string, batch?: string) => void;
  disconnect: () => void;
  fetchNotifications: (query?: NotificationQuery) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api').replace('/api', '');

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  total: 0,
  loading: false,
  socket: null,

  connect: (token: string, batch?: string) => {
    const existing = get().socket;
    if (existing?.connected) return;

    // Disconnect any stale socket
    existing?.disconnect();

    const socket = io(`${SOCKET_URL}/notifications`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socket.on('connect', () => {
      console.log('[Notifications] WebSocket connected');

      // Join batch room if student has a batch
      if (batch) {
        socket.emit('join-batch', { batch });
      }
    });

    socket.on('notification', (notification: Notification) => {
      get().addNotification(notification);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('[Notifications] WebSocket disconnected:', reason);
    });

    socket.on('connect_error', (err: Error) => {
      console.warn('[Notifications] WebSocket connection error:', err.message);
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchNotifications: async (query?: NotificationQuery) => {
    set({ loading: true });
    try {
      const response = await notificationApi.getMyNotifications(query);
      set({
        notifications: response.notifications,
        total: response.total,
        unreadCount: response.unreadCount,
      });
    } catch (error) {
      console.error('[Notifications] Failed to fetch:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      set({ unreadCount: response.unreadCount });
    } catch (error) {
      console.error('[Notifications] Failed to fetch unread count:', error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error('[Notifications] Failed to mark as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationApi.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('[Notifications] Failed to mark all as read:', error);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [{ ...notification, isRead: false }, ...state.notifications],
      unreadCount: state.unreadCount + 1,
      total: state.total + 1,
    }));
  },
}));
