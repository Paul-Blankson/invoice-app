import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { DropdownOption, InputFieldProps } from '../../models';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent<T> implements ControlValueAccessor {
  @Input() id = `dropdown-${Math.random().toString(36).slice(2, 11)}`;
  @Input() props!: InputFieldProps;
  @Input() options: DropdownOption<T>[] = [];

  public value: T | null = null;
  public isDisabled = false;
  public isOpen = false;
  public selectedOption?: DropdownOption<T>;
  private focusedIndex = -1;

  public onChange: (value: T | null) => void = () => {};
  public onTouched: () => void = () => {};

  public writeValue(value: T | null): void {
    this.value = value;
    this.selectedOption = this.options.find((option) => option.value === value);
  }

  public registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  public toggleDropdown(): void {
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
    }
  }

  public closeDropdown(): void {
    this.isOpen = false;
    this.onTouched();
  }

  public selectOption(option: DropdownOption<T>): void {
    if (option.disabled) return;

    this.selectedOption = option;
    this.value = option.value;
    this.onChange(option.value);
    this.onTouched();
    this.closeDropdown();
  }

  public handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = Math.min(
          this.focusedIndex + 1,
          this.options.length - 1,
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

  private focusOption(): void {
    const options = document.querySelectorAll('.dropdown__option');
    (options[this.focusedIndex] as HTMLElement)?.focus();
  }

  get displayValue(): string {
    return this.selectedOption?.label ?? this.props.placeholder ?? '';
  }
}
