import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { DropdownOption, DropdownChanges } from '../../models';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    ClickOutsideDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent<T> {
  @Input() options: DropdownOption<T>[] = [];
  @Input() label = '';
  @Input() placeholder = 'Select an option';
  @Input() control?: FormControl<T | null>;
  @Input() required = false;
  @Input() error = '';
  @Output() selectionChange = new EventEmitter<DropdownChanges<T>>();

  isOpen = false;
  selectedOption?: DropdownOption<T>;
  focusedIndex = -1;

  toggleDropdown(): void {
    if (!this.control?.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  selectOption(option: DropdownOption<T>): void {
    if (option.disabled) return;

    this.selectedOption = option;
    this.control?.setValue(option.value);
    this.selectionChange.emit({ value: option.value, option });
    this.closeDropdown();
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = Math.min(
          this.focusedIndex + 1,
          this.options.length - 1
        );
        this.focusOption();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        this.focusOption();
        break;
      case 'Enter':
        event.preventDefault();
        if (this.focusedIndex >= 0) {
          this.selectOption(this.options[this.focusedIndex]);
        }
        break;
      case 'Escape':
        this.closeDropdown();
        break;
    }
  }

  @HostListener('window:keydown.escape')
  handleEscapeKey(): void {
    if (this.isOpen) {
      this.closeDropdown();
    }
  }

  private focusOption(): void {
    const options = document.querySelectorAll('.dropdown__option');
    (options[this.focusedIndex] as HTMLElement)?.focus();
  }

  get displayValue(): string {
    return this.selectedOption?.label ?? this.placeholder;
  }

  get showError(): boolean {
    return Boolean(this.control?.touched && this.error);
  }
}
