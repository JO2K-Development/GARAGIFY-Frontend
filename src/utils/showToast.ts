import { notification } from 'antd';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'open';

interface ToastOptions {
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  key?: string;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

export function showToast({
  type,
  message,
  description,
  duration,
  key,
  placement,
}: ToastOptions) {
  const config = {
    message,
    description,
    duration: duration ?? 4.5,
    key,
    placement,
  };

  if (type === 'open') {
    notification.open(config);
  } else {
    notification[type](config);
  }
}
