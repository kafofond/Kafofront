import { Injectable } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastId = 0;

  getToasts() {
    return this.toasts;
  }

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) {
    const toast: Toast = {
      id: this.toastId++,
      message,
      type,
      duration
    };

    this.toasts.push(toast);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  clear() {
    this.toasts = [];
  }
}