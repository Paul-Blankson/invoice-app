export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h3-sm';
export type TextVariant = 'p' | 'span' | 'label';
export type IconName =
  | 'icon-sun'
  | 'icon-moon'
  | 'icon-arrow-down'
  | 'icon-arrow-up'
  | 'icon-arrow-left'
  | 'icon-arrow-right'
  | 'icon-calendar'
  | 'icon-check'
  | 'icon-delete'
  | 'icon-plus'
  | 'illustration-empty'
  | 'image-avatar'
  | 'logo';
export type BadgeVariant = 'pending' | 'paid' | 'draft';
export interface FilterOption {
  title: string;
  value: string;
}
export type ButtonVariant = 'btn1' | 'btn2' | 'btn3' | 'btn4' | 'btn5' | 'btn6';
export type InputFieldType = 'text' | 'email' | 'password' | 'number' | 'date';
export interface DropdownOption<T> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface DropdownChanges<T> {
  option: DropdownOption<T>;
  value: T;
}
export interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  id: string;
}

export interface InputFieldProps {
  type: InputFieldType;
  label: string;
  isInvalid?: boolean;
  placeholder?: string;
  errorMessage?: string;
}

export type DateValue = string | null;
export type OnChangeCallback = (value: DateValue) => void;
export type OnTouchedCallback = () => void;
