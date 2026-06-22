'use client';

import { useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateStr).toLocaleDateString();
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'exam_notice': return '📝';
    case 'payment_reminder': return '⚠️';
    case 'payment_confirmed': return '💰';
    case 'result_published': return '📊';
    case 'registration_approved': return '✅';
    case 'attendance': return '📋';
    case 'timetable': return '📅';
    default: return '🔔';
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'exam_notice': return 'Exam Notice';
    case 'payment_reminder': return 'Payment Reminder';
    case 'payment_confirmed': return 'Payment Confirmed';
    case 'result_published': return 'Results';
    case 'registration_approved': return 'Registration';
    case 'attendance': return 'Attendance';
    case 'timetable': return 'Timetable';
    default: return 'General';
  }
}

export default function NotificationsPage() {
  const { token } = useAuthStore();
  const {
    notifications,
    unreadCount,
    total,
    loading,
    connect,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    if (token) {
      connect(token);
      fetchNotifications({ limit: 50 });
    }
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading && notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-3"></div>
              <div className="h-3 bg-gray-100 rounded w-32 mx-auto"></div>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              You'll receive notifications for exams, payments, and more.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-blue-50/40' : ''
                }`}
                onClick={() => {
                  if (!notification.isRead) markAsRead(notification._id);
                }}
              >
                <div className="flex gap-4">
                  <span className="text-xl flex-shrink-0 mt-0.5">
                    {getTypeIcon(notification.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={`text-sm leading-tight ${
                            !notification.isRead
                              ? 'font-semibold text-gray-900'
                              : 'font-medium text-gray-700'
                          }`}
                        >
                          {notification.title}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-600">
                          {getTypeLabel(notification.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-400">
                          {timeAgo(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer count */}
      {total > notifications.length && (
        <p className="text-center text-sm text-gray-400 mt-4">
          Showing {notifications.length} of {total} notifications
        </p>
      )}
    </div>
  );
}
