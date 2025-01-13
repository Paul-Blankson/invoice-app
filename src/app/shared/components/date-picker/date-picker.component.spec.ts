import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePickerComponent } from './date-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DatePickerComponent,
        FormsModule,
        ReactiveFormsModule,
        IconComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  describe('Core functionality', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.id).toBe('');
      expect(component.label).toBe('');
      expect(component.required).toBeFalse();
      expect(component.placeholder).toBe('Select date');
      expect(component.errorMessage).toBe('');
      expect(component.isOpen).toBeFalse();
      expect(component.selectedDate).toBeNull();
    });

    it('should generate calendar correctly', () => {
      component.generateCalendar();
      expect(component.calendarDays.length).toBe(42);
      expect(component.calendarDays.some(day => day.isToday)).toBeTrue();
    });

    it('should format date correctly', () => {
      const testDate = new Date('2024-03-15');
      component.writeValue(testDate);
      expect(component.formattedDate).toMatch(/15 Mar 2024/);
    });
  });

  describe('UI Interactions', () => {
    it('should toggle calendar on input click', () => {
      const input = element.querySelector('input');
      input?.click();
      fixture.detectChanges();
      expect(component.isOpen).toBeTrue();

      input?.click();
      fixture.detectChanges();
      expect(component.isOpen).toBeFalse();
    });

    it('should handle keyboard navigation', () => {
      const input = element.querySelector('input');

      // Test Enter key
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true
      });
      input?.dispatchEvent(enterEvent);
      fixture.detectChanges();
      expect(component.isOpen).toBeTrue();

      // Test Space key
      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true
      });
      component.isOpen = false;
      fixture.detectChanges();
      input?.dispatchEvent(spaceEvent);
      fixture.detectChanges();
      expect(component.isOpen).toBeTrue();
    });

    it('should navigate months', () => {
      const currentMonth = component.currentDate.getMonth();

      component.nextMonth();
      expect(component.currentDate.getMonth()).toBe((currentMonth + 1) % 12);

      component.previousMonth();
      expect(component.currentDate.getMonth()).toBe(currentMonth);
    });

    it('should select date correctly', () => {
      const today = new Date();
      const testDay = {
        date: today.getDate(),
        isCurrentMonth: true,
        isToday: true,
        isSelected: false,
        id: 'test-day'
      };

      component.selectDate(testDay);
      expect(component.selectedDate).toBeTruthy();
      expect(component.isOpen).toBeFalse();
    });
  });

  describe('Form Integration', () => {
    it('should implement ControlValueAccessor', () => {
      const testDate = new Date();
      component.writeValue(testDate);
      expect(component.selectedDate).toEqual(testDate);
      expect(component.control.value).toBeTruthy();
    });

    it('should handle disabled state', () => {
      component.setDisabledState(true);
      expect(component.control.disabled).toBeTrue();

      component.setDisabledState(false);
      expect(component.control.disabled).toBeFalse();
    });

    it('should show error state', () => {
      component.control.setErrors({ required: true });
      component.control.markAsTouched();
      fixture.detectChanges();

      const container = element.querySelector('.date-picker');
      expect(container?.classList.contains('error')).toBeTrue();
    });
  });

  describe('Accessibility', () => {
    it('should set proper aria labels', () => {
      component.ariaLabel = 'Date Selection';
      fixture.detectChanges();

      const input = element.querySelector('input');
      expect(input?.getAttribute('aria-label')).toBe('Date Selection');
    });

    it('should handle tab navigation', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const buttons = element.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach(button => {
        expect(button.getAttribute('type')).toBe('button');
      });
    });
  });
});