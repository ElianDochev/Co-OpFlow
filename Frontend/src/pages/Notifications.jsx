import { useState } from 'react';
import {
  BellIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  StarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'connection',
      title: 'New Connection Request',
      message: 'John Doe wants to connect with you',
      time: '5 minutes ago',
      read: false,
      icon: UserPlusIcon,
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      message: 'Jane Smith sent you a message about the project',
      time: '1 hour ago',
      read: false,
      icon: ChatBubbleLeftRightIcon,
    },
    {
      id: 3,
      type: 'like',
      title: 'Project Liked',
      message: 'Your project "AI Assistant" received a like',
      time: '2 hours ago',
      read: true,
      icon: HeartIcon,
    },
    {
      id: 4,
      type: 'star',
      title: 'Project Starred',
      message: 'Your project "AI Assistant" was starred by 3 people',
      time: '1 day ago',
      read: true,
      icon: StarIcon,
    },
    {
      id: 5,
      type: 'success',
      title: 'Project Approved',
      message: 'Your project "AI Assistant" has been approved',
      time: '2 days ago',
      read: true,
      icon: CheckCircleIcon,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getUnreadCount = () => {
    return notifications.filter((notification) => !notification.read).length;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BellIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          {getUnreadCount() > 0 && (
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
              {getUnreadCount()} new
            </span>
          )}
        </div>
        {getUnreadCount() > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.read
                ? 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                : 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`p-2 rounded-full ${
                  notification.read
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'bg-indigo-100 dark:bg-indigo-800'
                }`}
              >
                <notification.icon
                  className={`h-6 w-6 ${
                    notification.read
                      ? 'text-gray-600 dark:text-gray-300'
                      : 'text-indigo-600 dark:text-indigo-400'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-medium ${
                      notification.read
                        ? 'text-gray-900 dark:text-white'
                        : 'text-indigo-900 dark:text-indigo-100'
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {notification.time}
                  </p>
                </div>
                <p
                  className={`text-sm ${
                    notification.read
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-indigo-700 dark:text-indigo-300'
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications; 