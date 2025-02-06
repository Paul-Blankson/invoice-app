import {
  Component,
  Input,
  forwardRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { HeadlineComponent } from '../headline/headline.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import {
  CalendarDay,
  DateValue,
  OnChangeCallback,
  OnTouchedCallback,
} from '../../models';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    ClickOutsideDirective,
    HeadlineComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = 'Select date';
  @Input() errorMessage: string = '';
  @Input() ariaLabel: string = '';

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  control: FormControl<DateValue> = new FormControl<DateValue>('', {
    nonNullable: false,
  });
  isOpen: boolean = false;
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  weekDays: string[] = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];
  calendarDays: CalendarDay[] = [];

  constructor() {
    this.generateCalendar();
  }

  get formattedDate(): string {
    if (!this.selectedDate) return '';
    return this.formatDate(this.selectedDate);
  }

  get currentMonthYear(): string {
    return this.currentDate.toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });
  }

  get isInvalid(): boolean {
    return Boolean(this.control.touched && this.control.errors);
  }

  closeCalendar(): void {
    this.isOpen = false;
  }

  ngOnInit(): void {
    this.generateCalendar();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.toggleCalendar();
    }
  }

  private enableControl(): void {
    this.control.enable();
  }

  private disableControl(): void {
    this.control.disable();
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.disableControl();
    }
    this.enableControl();
  }

  toggleCalendar(): void {
    if (this.control.disabled) return;

    this.generateCalendar();
    this.isOpen = !this.isOpen;

    requestAnimationFrame(() => {
      if (this.isOpen) {
        this.scrollToSelectedDate();
      }
    });
  }

  private scrollToSelectedDate(): void {
    if (this.selectedDate) {
      const selectedDay = this.calendarDays.find(
        (day) => day.isSelected && day.isCurrentMonth,
      );
      if (selectedDay) {
        const element = document.querySelector('.day-button.selected');
        element?.scrollIntoView({ block: 'center' });
      }
    }
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    this.calendarDays = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = prevMonthLastDay - i;
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        id: `prev-${date}`,
      });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      this.calendarDays.push({
        date: i,
        isCurrentMonth: true,
        isToday: this.isSameDate(date, today),
        isSelected: this.selectedDate
          ? this.isSameDate(date, this.selectedDate)
          : false,
        id: `current-${i}`,
      });
    }

    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      this.calendarDays.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        id: `next-${i}`,
      });
    }
  }

  selectDate(day: CalendarDay): void {
    if (!day.isCurrentMonth) return;

    const selectedDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day.date,
    );

    this.selectedDate = selectedDate;
    const formattedDate = this.formatDate(selectedDate);
    this.control.setValue(formattedDate);
    this.onChange(formattedDate);
    this.isOpen = false;
    this.generateCalendar();
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
    );
    this.generateCalendar();
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  // ControlValueAccessor implementation
  onChange: OnChangeCallback = () => {};
  onTouched: OnTouchedCallback = () => {};

  writeValue(value: DateValue): void {
    if (value) {
      this.selectedDate = new Date(value);
      this.control.setValue(this.formatDate(this.selectedDate));
    }
  }

  registerOnChange(fn: OnChangeCallback): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedCallback): void {
    this.onTouched = fn;
  }
}
