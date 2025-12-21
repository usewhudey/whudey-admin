'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { notification, hideNotification } = useUIStore();

  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification.isVisible, hideNotification]);

  if (!notification.isVisible) return null;

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border p-4 shadow-lg',
          bgColors[notification.type]
        )}
      >
        {icons[notification.type]}
        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
        <button
          onClick={hideNotification}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}