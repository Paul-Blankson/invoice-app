import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { InputFieldProps } from '../../models';

@Component({
  selector: 'app-text-field',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.css',
})
export class TextFieldComponent implements ControlValueAccessor {
  @Input() id = `text-field-${Math.random().toString(36).slice(2, 11)}`;
  @Input() props!: InputFieldProps;

  public value = '';
  public isDisabled = false;

  public onChange: (value: string) => void = () => {};
  public onTouched: () => void = () => {};

  public writeValue(obj: string): void {
    this.value = obj || '';
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  public onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value = inputValue;
    this.onChange(inputValue);
  }

  get ariaInvalid(): boolean {
    return this.props.isInvalid!;
  }

  get ariaDescribedBy(): string {
    return this.props.isInvalid ? `${this.id}-error` : '';
  }
}
