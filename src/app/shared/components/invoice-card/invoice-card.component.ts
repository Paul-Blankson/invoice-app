import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HeadlineComponent } from '../headline/headline.component';
import { TextComponent } from '../text/text.component';
import { BadgeComponent } from '../badge/badge.component';
import { IconComponent } from '../icon/icon.component';
import { Invoice } from '../../../models/services.type';
import { BadgeVariant } from '../../models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invoice-card',
  imports: [
    CommonModule,
    HeadlineComponent,
    TextComponent,
    BadgeComponent,
    IconComponent,
    RouterLink,
  ],
  templateUrl: './invoice-card.component.html',
  styleUrl: './invoice-card.component.css',
})
export class InvoiceCardComponent {
  @Input({ required: true }) invoice!: Invoice;

  getBadgeVariant(status: string): BadgeVariant {
    const statusMap: Record<string, BadgeVariant> = {
      paid: 'paid',
      pending: 'pending',
      draft: 'draft',
    };
    return statusMap[status.toLowerCase()] || 'draft';
  }
}
