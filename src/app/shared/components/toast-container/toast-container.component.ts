import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { Toast } from '../../../models/services.type';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../models';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule, IconComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
  animations: [
    trigger('toastAnimation', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('200ms ease-in'))
    ])
  ]
})
export class ToastContainerComponent implements OnInit {
  toasts$!: Observable<Toast[]>;

  constructor(private readonly toastService: ToastService) {}

  ngOnInit(): void {
    this.toasts$ = this.toastService.toasts$;
  }

  public removeToast(id: string): void {
    this.toastService.remove(id);
  }

  public onKeyDown(event: KeyboardEvent, toastId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.removeToast(toastId);
    }
  }

  public getIconName(type: string): IconName {
    switch (type) {
      case 'success':
        return 'icon-check';
      case 'error':
        return 'icon-error';
      case 'warning':
        return 'icon-warning';
      case 'info':
        return 'icon-info';
      default:
        return 'icon-info';
    }
  }
}
