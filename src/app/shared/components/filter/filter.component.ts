import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterOption } from '../../models';
import { HeadlineComponent } from "../headline/headline.component";
import { IconComponent } from "../icon/icon.component";
import { TextComponent } from "../text/text.component";

@Component({
  selector: 'app-filter',
  imports: [HeadlineComponent, IconComponent, TextComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Input() options: FilterOption[] = [];
  @Input() label: string = 'Filter';
  @Output() selectionChange = new EventEmitter<string[]>();

  isOpen = false;
  selectedValues: string[] = [];

  toggleFilter(): void {
    this.isOpen = !this.isOpen;
  }

  isSelected(value: string): boolean {
    return this.selectedValues.includes(value);
  }

  toggleOption(value: string): void {
    const index = this.selectedValues.indexOf(value);
    if (index === -1) {
      this.selectedValues.push(value);
    } else {
      this.selectedValues.splice(index, 1);
    }
    this.selectionChange.emit(this.selectedValues);
  }
}
