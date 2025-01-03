import { Component, Input } from '@angular/core';
import { TextVariant } from '../../models';

@Component({
  selector: 'app-text',
  template: `
    @if (variant === 'p') {
      <p [class]="getClasses()">{{ text }}</p>
    } @else if (variant === 'span') {
      <span [class]="getClasses()">{{ text }}</span>
    } @else {
      <label [class]="getClasses()">{{ text }}</label>
    }
  `,
  styles: [
    `
      .text {
        font-family: 'Spartan', sans-serif;
        font-weight: 400;
        margin: 0;
        color: var(--color-light-gray);
      }
      .large {
        font-size: 0.75rem;
        line-height: 15px;
        letter-spacing: -0.2496px;
      }
      .small {
        font-size: 0.6875rem;
        font-weight: 400;
        line-height: 18px;
        letter-spacing: -0.2291666716337204px;
      }
      .soft-blue {
        color: var(--color-soft-blue);
      }
      .light-gray {
        color: var(--color-light-gray);
      }
      .muted-blue {
        color: var(--color-muted-blue);
      }
      .slate-blue {
        color: var(--color-slate-blue);
      }
      .white-text {
        color: var(--white-color);
      }
    `,
  ],
  standalone: true,
})
export class TextComponent {
  @Input() variant: TextVariant = 'p';
  @Input() className?: string;
  @Input() text: string = '';

  getClasses(): string {
    return `text ${this.variant} ${this.className ?? ''}`.trim();
  }
}
