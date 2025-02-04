import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast, ToastType } from '../models/services.type';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toasts: BehaviorSubject<Toast[]> = new BehaviorSubject<
    Toast[]
  >([]);
  public toasts$: Observable<Toast[]> = this.toasts.asObservable();

  constructor() {}

  public show(
    message: string,
    type: ToastType = 'info',
    timeout: number = 5000,
  ): void {
    const toast: Toast = {
      id: this.generateId(),
      message,
      type,
      timeout,
    };

    const currentToasts = this.toasts.getValue();
    this.toasts.next([...currentToasts, toast]);

    if (timeout > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, timeout);
    }
  }

  public remove(id: string): void {
    const currentToast = this.toasts.getValue();
    this.toasts.next(currentToast.filter((toast) => toast.id !== id));
  }

  public success(message: string, timeout?: number): void {
    this.show(message, 'success', timeout);
  }

  public error(message: string, timeout?: number): void {
    this.show(message, 'error', timeout);
  }

  public info(message: string, timeout?: number): void {
    this.show(message, 'info', timeout);
  }

  public warning(message: string, timeout?: number): void {
    this.show(message, 'warning', timeout);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
