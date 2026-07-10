import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { notificationApi, type Notification, type NotificationQuery } from '@/api/notification.api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  loading: boolean;
  socket: Socket | null;

  connect: (token: string, batch?: string) => void;
  disconnect: () => void;
  fetchNotifications: (query?: NotificationQuery) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

const SOCKET_URL = (process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:4000/api').replace('/api', '');
function belongsToCurrentStudent(notification: Notification): boolean {
  try {
    const isWelcomeType =
      notification?.type === 'general' && /welcome/i.test(notification?.title ?? '');

    
    if (!isWelcomeType) return true;

    const message = `${notification?.title ?? ''} ${notification?.message ?? ''}`;
    const match = message.match(/STU\d+/i);

    
    if (!match) return true;

    const mentionedId = match[0].toUpperCase();

    const currentStudent = useAuthStore.getState()?.student as any;
    const currentStudentId =
      currentStudent?.studentId ??
      currentStudent?.studentID ??
      currentStudent?.id ??
      currentStudent?._id;

    
    if (!currentStudentId) return true;

    return mentionedId === String(currentStudentId).toUpperCase();
  } catch (err) {
    console.error('[Notifications] filter check failed, showing notification by default:', err);
    return true; // never hide on error
  }
}

function filterForCurrentStudent(notifications: Notification[]): Notification[] {
  return notifications.filter(belongsToCurrentStudent);
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  total: 0,
  loading: false,
  socket: null,

  connect: (token: string, batch?: string) => {
    const existing = get().socket;
    if (existing?.connected) return;

    existing?.disconnect();

    const socket = io(`${SOCKET_URL}/notifications`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socket.on('connect', () => {
      if (batch) {
        socket.emit('join-batch', { batch });
      }
    });

    socket.on('notification', (notification: Notification) => {
      get().addNotification(notification);
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
      const filtered = filterForCurrentStudent(response.notifications);
      const unreadInFiltered = filtered.filter((n) => !n.isRead).length;

      set({
        notifications: filtered,
        total: filtered.length,
        unreadCount: unreadInFiltered,
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
    if (!belongsToCurrentStudent(notification)) return; // skip other students' welcome pings

    set((state) => ({
      notifications: [{ ...notification, isRead: false }, ...state.notifications],
      unreadCount: state.unreadCount + 1,
      total: state.total + 1,
    }));
  },
}));