import { Component, Input } from '@angular/core';
import { HeadingLevel } from '../../models';

@Component({
  selector: 'app-headline',
  template: `
    @if (level === 'h1') {
      <h1 [class]="getClasses()">{{ text }}</h1>
    } @else if (level === 'h2') {
      <h2 [class]="getClasses()">{{ text }}</h2>
    } @else {
      <h3 [class]="getClasses()">{{ text }}</h3>
    }
  `,
  styles: [
    `
      .headline {
        font-family: 'Spartan', sans-serif;
        font-weight: 700;
        margin: 0;
        color: var(--color-very-dark);
      }
      .h1 {
        font-size: 2rem;
        line-height: 2.24rem;
        letter-spacing: -1px;
      }
      .h2 {
        font-size: 20px;
        line-height: 22.4px;
        letter-spacing: -0.625px;
      }
      .h3 {
        font-size: 16px;
        line-height: 24px;
        letter-spacing: -0.8px;
      }
      .h3-sm {
        font-size: 12px;
        line-height: 15px;
        letter-spacing: -0.25px;
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
      .white-color {
        color: var(--white-color);
      }
      .pending {
        color: var(--color-amber);
      }
      .paid {
         color: var(--color-mint-green);
      }
      .draft {
        color: var(--color-steel-gray);
      }

    `,
  ],
  standalone: true,
})
export class HeadlineComponent {
  @Input() level: HeadingLevel = 'h1';
  @Input() className?: string;
  @Input() text: string = '';

  getClasses(): string {
    return `headline ${this.level} ${this.className ?? ''}`.trim();
  }
}
