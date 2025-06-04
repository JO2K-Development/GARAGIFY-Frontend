'use client';

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { notification } from 'antd';
import type {  NotificationInstance } from 'antd/es/notification/interface';

type ToastContextType = NotificationInstance;

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [api, contextHolder] = notification.useNotification();

  const value = useMemo(() => api, [api]);

  return (
    <ToastContext.Provider value={value}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

