import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BadgeVariant, FilterOption } from '../../models';
import { HeadlineComponent } from '../headline/headline.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-filter',
  imports: [HeadlineComponent, IconComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  @Input() options: FilterOption[] = [];
  @Input() label: string = 'Filter';
  @Input() selectedStatuses: BadgeVariant[] = [];
  @Output() selectionChange = new EventEmitter<BadgeVariant[]>();

  isOpen = false;

  toggleFilter(): void {
    this.isOpen = !this.isOpen;
  }

  isSelected(value: string): boolean {
    return this.selectedStatuses.includes(value as BadgeVariant);
  }

  toggleOption(value: string): void {
    const badgeValue = value as BadgeVariant;
    const currentStatuses = [...this.selectedStatuses];
    const index = currentStatuses.indexOf(badgeValue);

    if (index === -1) {
      currentStatuses.push(badgeValue);
    } else {
      currentStatuses.splice(index, 1);
    }

    this.selectionChange.emit(currentStatuses);
  }
}
