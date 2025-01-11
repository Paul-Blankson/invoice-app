import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextFieldType, ValidationError } from '../../models';

@Component({
  selector: 'app-text-field',
  imports: [],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
})
export class TextFieldComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: TextFieldType = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() id = `text-field-${Math.random().toString(36).slice(2, 11)}`;

  @Output() blur = new EventEmitter<void>();

  value = '';
  touched = false;
  private readonly emailRegex =
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  get error(): string {
    const errorType = this.getValidationError();

    switch (errorType) {
      case 'required':
        return "can't be empty";
      case 'email':
        return 'invalid email format';
      default:
        return '';
    }
  }

  private getValidationError(): ValidationError {
    if (this.required && this.touched && !this.value) {
      return 'required';
    }

    if (this.type === 'email' && this.value && !this.isValidEmail(this.value)) {
      return 'email';
    }

    return null;
  }

  private isValidEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
    this.blur.emit();
  }
}
