'use client';

import { useState, useRef, ReactElement } from 'react';
import Notification, { NotificationType } from '@/components/ui/toast';

interface ToastItem {
  id: number;
  type: NotificationType;
  title: string;
  message?: string;
  showIcon: boolean;
  duration?: number;
}

export function useToast() {
  const [notifications, setNotifications] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(1);

  const addToast = (type: NotificationType, title: string, message?: string, duration?: number) => {
    const id = nextIdRef.current++;
    const newToast: ToastItem = {
      id,
      type,
      title,
      message,
      showIcon: true,
      duration,
    };

    // Chỉ hiển thị 1 toast - thay thế toast cũ bằng toast mới
    setNotifications([newToast]);
  };

  const removeToast = (id: number) => {
    setNotifications(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, message?: string, duration = 3000) =>
    addToast('success', title, message, duration);

  const error = (title: string, message?: string, duration = 5000) =>
    addToast('error', title, message, duration);

  const warning = (title: string, message?: string, duration = 4000) =>
    addToast('warning', title, message, duration);

  const info = (title: string, message?: string, duration = 4000) =>
    addToast('info', title, message, duration);

  const loading = (title: string, message?: string) =>
    addToast('loading', title, message);


  const ToastContainer = () => (
    <div className="fixed mt-10 top-4 right-4 z-50 space-y-2">

      {notifications.map(toast => (
        <Notification
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          showIcon={toast.showIcon}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return {
    notifications,
    success,
    error,
    warning,
    info,
    loading,
    removeToast,
    ToastContainer,
  };
}











