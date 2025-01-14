import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextFieldType } from '../../models';

@Component({
  selector: 'app-text-field',
  imports: [ReactiveFormsModule],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.css',
})
export class TextFieldComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: TextFieldType = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() id = `text-field-${Math.random().toString(36).slice(2, 11)}`;
  @Input() control?: FormControl<string | null>;
  @Input() error = '';

  @Output() blur = new EventEmitter<void>();

  private readonly emailRegex =
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  get showError(): boolean {
    return Boolean(this.control?.touched && this.error);
  }

  get value(): string {
    return this.control?.value ?? '';
  }

  private getValidationError(): string | null {
    if (!this.control?.touched) {
      return null;
    }

    if (this.required && !this.value) {
      return "can't be empty";
    }

    if (this.type === 'email' && this.value && !this.isValidEmail(this.value)) {
      return 'invalid email format';
    }

    return null;
  }

  private isValidEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.control?.setValue(target.value);
  }

  onBlur(): void {
    this.control?.markAsTouched();
    this.blur.emit();
  }
}
